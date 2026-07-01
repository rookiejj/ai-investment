#!/usr/bin/env python3
"""
전 상장 종목(미국 + 한국, ETF 제외) 정적 데이터 생성기.

출력:
  stocks/us.json  — 미국 전 보통주 (NASDAQ·NYSE·AMEX·Arca 등, ETF 제외)
  stocks/kr.json  — 한국 전 보통주 (KOSPI·KOSDAQ·KONEX, ETF 제외)
  stocks/meta.json — 개수 요약
  stocks/.ko-cache.json — 한글명 번역 캐시 (재실행 시 재번역 방지, git 제외)

소스:
  - 미국: NASDAQ Trader 공개 파일 + 시총 screener API
  - 한국: FinanceDataReader (KRX 직접 호출은 anti-bot 으로 막혀 라이브러리 경유)

한글명(k) 생성 (미국 종목):
  1) 주식종류 설명(Common Stock·Class A 등) 제거, 법인 접미사는 유지
  2) company-ko.js 큐레이션 매핑에 코어 브랜드명이 있으면 그 값 사용
  3) 없으면 Google 번역(무키 엔드포인트) 배치 → 한글 법인어(주식회사·코퍼레이션 등) 제거
     * 법인 접미사를 붙인 채 번역해야 브랜드명 오역(Apple→사과) 방지
  한국 종목은 n 이 이미 한글이라 k=n.

레코드: { "t":티커, "n":영문/국문명, "k":한글명, "e":거래소/시장, "c":"US"|"KR", "m":시가총액 }

실행: python3 scripts/build-all-stocks.py
"""
import json
import os
import re
import subprocess
import sys
import time
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "stocks")
KO_CACHE = os.path.join(OUT_DIR, ".ko-cache.json")

NASDAQ_LISTED = "https://www.nasdaqtrader.com/dynamic/SymDir/nasdaqlisted.txt"
OTHER_LISTED = "https://www.nasdaqtrader.com/dynamic/SymDir/otherlisted.txt"
NASDAQ_SCREENER = ("https://api.nasdaq.com/api/screener/stocks"
                   "?tableonly=true&limit=10&download=true")
GTRANSLATE = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ko&dt=t&q="
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120 Safari/537.36")

EXCH = {"A": "NYSE American", "N": "NYSE", "P": "NYSE Arca", "Z": "Cboe BZX", "V": "IEX"}

# 주식 종류·증권 설명 — 여기서부터 잘라내 코어 회사명만 남긴다.
DESC_RE = re.compile(
    r'\b(American Depositary|Registry Shares?|New York Registry|'
    r'Common Stock|Ordinary Shares?|Depositary Shares?|Depositary Receipts?|'
    r'Common Shares?|Common Units?|Depositary Units?|Preferred Stock|'
    r'Beneficial Interest|Subordinate Voting Shares?|Warrants?|Rights?|Units?|'
    r'Class [A-Z]\b).*', re.I)
# 법인 접미사 (override 코어 브랜드 추출용)
CORP_RE = re.compile(
    r'[,\s]+(Inc\.?|Incorporated|Corp\.?|Corporation|Company|Co\.?|Ltd\.?|Limited|'
    r'PLC|Holdings?|Group|L\.?P\.?|LLC|N\.?V\.?|S\.?A\.?|AG|SE|Trust)\.?$', re.I)
# 번역 결과에서 떼어낼 한글 법인어 (후미)
KO_TAILS = ['앤드 컴퍼니', '앤 컴퍼니', '주식회사', '㈜', '(주)', '코퍼레이션',
            '인코퍼레이티드', '리미티드', '컴퍼니', '회사', '보통주', '피엘씨',
            'PLC', 'plc', '인크', '앤드', '앤']


def _fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode("utf-8", "replace")


def _us_marketcaps():
    req = urllib.request.Request(NASDAQ_SCREENER,
                                 headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        d = json.loads(r.read().decode("utf-8", "replace"))
    out = {}
    for row in (d.get("data", {}).get("rows") or []):
        sym = (row.get("symbol") or "").strip()
        cap = (row.get("marketCap") or "").strip()
        if not sym:
            continue
        try:
            out[sym] = int(float(cap)) if cap else 0
        except ValueError:
            out[sym] = 0
    return out


# ---------- 한글명 ----------
def clean_name(raw):
    """주식종류 설명 제거, 코어 회사명(법인 접미사 유지). 후미 대시·쉼표 제거."""
    m = DESC_RE.search(raw)
    s = raw[:m.start()] if m else raw
    s = re.sub(r'[\s\-–—,]+$', '', s).strip()
    return s or raw.strip()


def core_brand(cleaned):
    """법인 접미사까지 떼어낸 브랜드 코어 (override 매칭용)."""
    s, prev = cleaned, None
    while prev != s:
        prev = s
        s = CORP_RE.sub('', s).strip().strip(',').strip()
        s = re.sub(r'\.com$', '', s, flags=re.I).strip()  # Amazon.com → Amazon
    return s


def strip_ko_corp(ko):
    s = ko.strip().strip('\n').strip()
    s = re.sub(r'\s*\([A-Za-z][^)]*\)\s*$', '', s).strip()  # 후미 영문 괄호 (Taiwan...) 제거
    s = re.sub(r'^\s*(㈜|\(주\))\s*', '', s).strip()          # 선두 ㈜ / (주)
    changed = True
    while changed:
        changed = False
        s = re.sub(r'[\s\-–—,]+$', '', s).strip()
        for t in KO_TAILS:
            if s.endswith(t):
                s = s[:-len(t)].strip()
                changed = True
        # 후미 영문 잔재 (Inc. / Corp. / and 등)
        s2 = re.sub(r'[\s,]+(Inc\.?|Corp\.?|Corporation|Ltd\.?|Co\.?|LLC|PLC|and|&)\.?$',
                    '', s, flags=re.I).strip()
        if s2 != s:
            s, changed = s2, True
    return s or ko.strip()


def load_overrides():
    """company-ko.js 의 COMPANY_KO 를 {소문자 키: 한글} 로."""
    try:
        src = open(os.path.join(ROOT, "data", "company-ko.js"), encoding="utf-8").read()
        out = subprocess.run(
            ["node", "-e", src + ";process.stdout.write(JSON.stringify(COMPANY_KO))"],
            capture_output=True, text=True, timeout=20)
        m = json.loads(out.stdout)
        return {k.lower(): v for k, v in m.items()}
    except Exception as e:
        print(f"  ! company-ko.js override 로드 실패 (번역만 사용): {e}")
        return {}


def translate_batch(names, cache):
    """미번역 이름들을 배치 번역 → cache 갱신. 실패분은 None(영문 유지)."""
    todo = [n for n in names if n not in cache]
    if not todo:
        return
    print(f"  번역 대상 {len(todo)} 개 (캐시 {len(names) - len(todo)} 재사용)")
    B = 50
    done = 0
    for i in range(0, len(todo), B):
        chunk = todo[i:i + B]
        q = '\n'.join(chunk)
        try:
            req = urllib.request.Request(GTRANSLATE + urllib.parse.quote(q),
                                         headers={"User-Agent": UA})
            d = json.loads(urllib.request.urlopen(req, timeout=30).read().decode("utf-8"))
            full = ''.join(s[0] for s in d[0])
            lines = full.split('\n')
            if len(lines) == len(chunk):
                for nm, ko in zip(chunk, lines):
                    cache[nm] = ko.strip()  # 원본 저장 (strip 은 빌드 시점)
            else:  # 정렬 깨지면 이 배치는 영문 유지
                for nm in chunk:
                    cache[nm] = None
        except Exception as e:
            print(f"  ! 번역 배치 실패({i}~), 영문 유지: {e}")
            for nm in chunk:
                cache[nm] = None
        done += len(chunk)
        if done % 500 < B:
            print(f"    …{done}/{len(todo)}")
            _save_cache(cache)
        time.sleep(0.25)
    _save_cache(cache)


def _save_cache(cache):
    try:
        with open(KO_CACHE, "w", encoding="utf-8") as f:
            json.dump(cache, f, ensure_ascii=False)
    except Exception:
        pass


def koreanize_us(rows):
    """US rows 에 k(한글명) 부여. rows[i]['n'] 은 clean_name 결과."""
    overrides = load_overrides()
    cache = {}
    if os.path.exists(KO_CACHE):
        try:
            cache = json.load(open(KO_CACHE, encoding="utf-8"))
        except Exception:
            cache = {}
    # override 로 못 채우는 것만 번역 대상
    need = []
    for r in rows:
        ov = overrides.get(core_brand(r["n"]).lower())
        if ov:
            r["k"] = ov
        else:
            need.append(r["n"])
    translate_batch(list(dict.fromkeys(need)), cache)
    for r in rows:
        if "k" in r:
            continue
        ko = cache.get(r["n"])
        r["k"] = strip_ko_corp(ko) if ko else r["n"]  # 빌드 시점 정제, 실패 시 영문


# ---------- 빌드 ----------
def build_us():
    try:
        caps = _us_marketcaps()
        print(f"  미국 시가총액 {len(caps)} 종목 매칭")
    except Exception as e:
        print(f"  ! 미국 시가총액 실패 (m=0): {e}")
        caps = {}
    rows = []

    def add(sym, name, exch, etf):
        if etf == "Y":
            return  # ETF 제외
        s = sym.strip()
        rows.append({"t": s, "n": clean_name(name.strip()), "e": exch,
                     "c": "US", "m": caps.get(s, 0)})

    for line in _fetch(NASDAQ_LISTED).splitlines()[1:]:
        if line.startswith("File Creation Time"):
            continue
        f = line.split("|")
        if len(f) < 8 or f[3] == "Y":  # test issue
            continue
        add(f[0], f[1], "NASDAQ", f[6])
    for line in _fetch(OTHER_LISTED).splitlines()[1:]:
        if line.startswith("File Creation Time"):
            continue
        f = line.split("|")
        if len(f) < 8 or f[6] == "Y":  # test issue
            continue
        add(f[0], f[1], EXCH.get(f[2], f[2]), f[4])

    seen, uniq = set(), []
    for r in rows:
        if r["t"] in seen:
            continue
        seen.add(r["t"])
        uniq.append(r)
    print(f"  미국 보통주 {len(uniq)} 종목 — 한글명 생성 중…")
    koreanize_us(uniq)
    uniq.sort(key=lambda r: (-r.get("m", 0), r["t"]))
    return uniq


def build_kr():
    try:
        import FinanceDataReader as fdr
    except ImportError:
        sys.exit("FinanceDataReader 필요: pip install finance-datareader")
    rows = []
    df = fdr.StockListing("KRX")
    for _, x in df.iterrows():
        code = str(x.get("Code", "")).strip()
        name = str(x.get("Name", "")).strip()
        market = str(x.get("Market", "")).strip()
        if not code or not name or name == "nan":
            continue
        try:
            cap = int(x.get("Marcap") or 0)
        except (ValueError, TypeError):
            cap = 0
        # 한국은 n 이 이미 한글 → k=n
        rows.append({"t": code, "n": name, "k": name,
                     "e": market or "KRX", "c": "KR", "m": cap})
    seen, uniq = set(), []
    for r in rows:
        if r["t"] in seen:
            continue
        seen.add(r["t"])
        uniq.append(r)
    uniq.sort(key=lambda r: (-r.get("m", 0), r["t"]))
    return uniq


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    print("미국 종목 수집 중…")
    us = build_us()
    print(f"  미국 {len(us)} 종목 (ETF 제외)")
    print("한국 종목 수집 중…")
    kr = build_kr()
    print(f"  한국 {len(kr)} 종목 (ETF 제외)")

    with open(os.path.join(OUT_DIR, "us.json"), "w", encoding="utf-8") as f:
        json.dump(us, f, ensure_ascii=False, separators=(",", ":"))
    with open(os.path.join(OUT_DIR, "kr.json"), "w", encoding="utf-8") as f:
        json.dump(kr, f, ensure_ascii=False, separators=(",", ":"))
    meta = {"us": {"total": len(us)}, "kr": {"total": len(kr)},
            "total": len(us) + len(kr), "etf": "excluded"}
    with open(os.path.join(OUT_DIR, "meta.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)
    # 한글명 미매칭 통계
    us_ko = sum(1 for r in us if r["k"] != r["n"])
    print(f"완료 → 총 {meta['total']} 종목 · 미국 한글명 {us_ko}/{len(us)}")


if __name__ == "__main__":
    main()
