#!/usr/bin/env python3
"""
전 상장 종목(미국 + 한국, ETF 제외) 정적 데이터 생성기.

출력:
  stocks/us.json  — 미국 전 보통주 (NASDAQ·NYSE·AMEX·Arca 등, ETF 제외)
  stocks/kr.json  — 한국 전 보통주 (KOSPI·KOSDAQ·KONEX, ETF 제외)
  stocks/meta.json — 개수 요약
  stocks/.ko-cache.json — 한글명 캐시 (티커→한글명, git 제외)

소스:
  - 미국: NASDAQ Trader 공개 파일 + 시총 screener API
  - 한국: FinanceDataReader (KRX 직접 호출은 anti-bot 으로 막혀 라이브러리 경유)

한글명(k) — 미국 종목:
  네이버 증권 autocomplete API(ac.stock.naver.com)에서 티커별 정식 한글명 조회.
  이것이 primary. 없으면 company-ko.js 큐레이션, 그래도 없으면 영문(clean_name).
  * 기계 번역(의역·오역) 대신 증권사 표준 표기를 쓰기 위함.
  한국 종목은 n 이 이미 한글이라 k=n.

레코드: { "t":티커, "n":영문/국문명, "k":한글명, "e":거래소/시장, "c":"US"|"KR", "m":시가총액 }

실행: python3 scripts/build-all-stocks.py
"""
import concurrent.futures
import json
import os
import re
import subprocess
import sys
import threading
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "stocks")
KO_CACHE = os.path.join(OUT_DIR, ".ko-cache.json")

NASDAQ_LISTED = "https://www.nasdaqtrader.com/dynamic/SymDir/nasdaqlisted.txt"
OTHER_LISTED = "https://www.nasdaqtrader.com/dynamic/SymDir/otherlisted.txt"
NASDAQ_SCREENER = ("https://api.nasdaq.com/api/screener/stocks"
                   "?tableonly=true&limit=10&download=true")
NAVER_AC = "https://ac.stock.naver.com/ac?target=stock&st=111&q="
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120 Safari/537.36")

EXCH = {"A": "NYSE American", "N": "NYSE", "P": "NYSE Arca", "Z": "Cboe BZX", "V": "IEX"}

# 주식 종류·증권 설명 — 여기서부터 잘라내 코어 회사명만 남긴다 (영문 fallback·override용).
DESC_RE = re.compile(
    r'\b(American Depositary|Registry Shares?|New York Registry|'
    r'Common Stock|Ordinary Shares?|Depositary Shares?|Depositary Receipts?|'
    r'Common Shares?|Common Units?|Depositary Units?|Preferred Stock|'
    r'Beneficial Interest|Subordinate Voting Shares?|Warrants?|Rights?|Units?|'
    r'Class [A-Z]\b).*', re.I)
CORP_RE = re.compile(
    r'[,\s]+(Inc\.?|Incorporated|Corp\.?|Corporation|Company|Co\.?|Ltd\.?|Limited|'
    r'PLC|Holdings?|Group|L\.?P\.?|LLC|N\.?V\.?|S\.?A\.?|AG|SE|Trust)\.?$', re.I)


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


# ---------- 이름 ----------
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
        s = re.sub(r'\.com$', '', s, flags=re.I).strip()
    return s


def load_overrides():
    try:
        src = open(os.path.join(ROOT, "data", "company-ko.js"), encoding="utf-8").read()
        out = subprocess.run(
            ["node", "-e", src + ";process.stdout.write(JSON.stringify(COMPANY_KO))"],
            capture_output=True, text=True, timeout=20)
        return {k.lower(): v for k, v in json.loads(out.stdout).items()}
    except Exception as e:
        print(f"  ! company-ko.js override 로드 실패: {e}")
        return {}


# ---------- 네이버 한글명 ----------
def naver_ko(ticker):
    """네이버 autocomplete 에서 미국 상장 티커의 정식 한글명. 없으면 None."""
    try:
        req = urllib.request.Request(NAVER_AC + urllib.parse.quote(ticker),
                                     headers={"User-Agent": UA,
                                              "Referer": "https://m.stock.naver.com/"})
        d = json.loads(urllib.request.urlopen(req, timeout=15).read().decode("utf-8"))
        for it in d.get("items", []):
            if it.get("code", "").upper() == ticker.upper() and it.get("nationCode") == "USA":
                nm = (it.get("name") or "").strip()
                if nm:
                    return nm
    except Exception:
        return None
    return None


def _load_cache():
    if os.path.exists(KO_CACHE):
        try:
            return json.load(open(KO_CACHE, encoding="utf-8"))
        except Exception:
            pass
    return {}


def _save_cache(cache):
    try:
        with open(KO_CACHE, "w", encoding="utf-8") as f:
            json.dump(cache, f, ensure_ascii=False)
    except Exception:
        pass


def koreanize_us(rows):
    """US rows 에 k(한글명): 네이버 → company-ko.js override → 영문 fallback."""
    overrides = load_overrides()
    cache = _load_cache()  # {ticker: 한글명 or ""}  ("" = 조회했으나 없음)
    todo = [r["t"] for r in rows if r["t"] not in cache]
    if todo:
        print(f"  네이버 한글명 조회 {len(todo)} 종목 (캐시 {len(rows) - len(todo)} 재사용)…")
        lock = threading.Lock()
        prog = [0]

        def work(tk):
            nm = naver_ko(tk)
            with lock:
                cache[tk] = nm or ""
                prog[0] += 1
                if prog[0] % 500 == 0:
                    print(f"    …{prog[0]}/{len(todo)}")
                    _save_cache(cache)

        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
            list(ex.map(work, todo))
        _save_cache(cache)

    for r in rows:
        nm = cache.get(r["t"])
        if nm:
            r["k"] = nm
        else:
            r["k"] = overrides.get(core_brand(r["n"]).lower()) or r["n"]


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
        if len(f) < 8 or f[3] == "Y":
            continue
        add(f[0], f[1], "NASDAQ", f[6])
    for line in _fetch(OTHER_LISTED).splitlines()[1:]:
        if line.startswith("File Creation Time"):
            continue
        f = line.split("|")
        if len(f) < 8 or f[6] == "Y":
            continue
        add(f[0], f[1], EXCH.get(f[2], f[2]), f[4])

    seen, uniq = set(), []
    for r in rows:
        if r["t"] in seen:
            continue
        seen.add(r["t"])
        uniq.append(r)
    print(f"  미국 보통주 {len(uniq)} 종목 — 한글명 조회 중…")
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
    us_ko = sum(1 for r in us if r["k"] != r["n"])
    print(f"완료 → 총 {meta['total']} 종목 · 미국 한글명 {us_ko}/{len(us)}")


if __name__ == "__main__":
    main()
