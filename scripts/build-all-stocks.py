#!/usr/bin/env python3
"""
전 상장 종목(미국 + 한국, ETF 포함) 정적 데이터 생성기.

출력:
  stocks/us.json  — 미국 전 종목 (NASDAQ·NYSE·AMEX·Arca 등, ETF 포함)
  stocks/kr.json  — 한국 전 종목 (KOSPI·KOSDAQ·KONEX + 국내 ETF)
  stocks/meta.json — 생성 시각·개수 요약

소스:
  - 미국: NASDAQ Trader 공개 파일 (인증 불필요)
      https://www.nasdaqtrader.com/dynamic/SymDir/nasdaqlisted.txt
      https://www.nasdaqtrader.com/dynamic/SymDir/otherlisted.txt
  - 한국: FinanceDataReader (KRX 직접 호출은 anti-bot 으로 막혀 라이브러리 경유)

레코드 스키마 (짧은 키로 용량 최소화):
  { "t": 티커, "n": 종목명, "e": 거래소/시장, "ty": "stock"|"etf",
    "c": "US"|"KR", "m": 시가총액(현지통화: US=USD, KR=KRW, 미상=0) }

시가총액 소스:
  - 미국: NASDAQ screener API (보통주 ~7천개). ETF·단위·일부 우선주는 0.
  - 한국: FinanceDataReader 의 Marcap (KRW).

실행: python3 scripts/build-all-stocks.py
"""
import json
import os
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "stocks")

NASDAQ_LISTED = "https://www.nasdaqtrader.com/dynamic/SymDir/nasdaqlisted.txt"
OTHER_LISTED = "https://www.nasdaqtrader.com/dynamic/SymDir/otherlisted.txt"

# otherlisted.txt 의 거래소 코드 → 사람이 읽는 라벨
EXCH = {
    "A": "NYSE American",
    "N": "NYSE",
    "P": "NYSE Arca",
    "Z": "Cboe BZX",
    "V": "IEX",
}


NASDAQ_SCREENER = ("https://api.nasdaq.com/api/screener/stocks"
                   "?tableonly=true&limit=10&download=true")
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120 Safari/537.36")


def _fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode("utf-8", "replace")


def _us_marketcaps():
    """NASDAQ screener 에서 {심볼: 시가총액(USD)} 맵."""
    req = urllib.request.Request(
        NASDAQ_SCREENER,
        headers={"User-Agent": UA, "Accept": "application/json"},
    )
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


def build_us():
    rows = []
    try:
        caps = _us_marketcaps()
        print(f"  미국 시가총액 {len(caps)} 종목 매칭")
    except Exception as e:
        print(f"  ! 미국 시가총액 가져오기 실패 (m=0 으로 진행): {e}")
        caps = {}
    # --- NASDAQ ---
    text = _fetch(NASDAQ_LISTED)
    for line in text.splitlines()[1:]:
        if line.startswith("File Creation Time"):
            continue
        f = line.split("|")
        if len(f) < 8:
            continue
        sym, name, _mcat, test, _fin, _lot, etf, _ns = f[:8]
        if test == "Y":
            continue
        s = sym.strip()
        rows.append({
            "t": s,
            "n": name.strip(),
            "e": "NASDAQ",
            "ty": "etf" if etf == "Y" else "stock",
            "c": "US",
            "m": caps.get(s, 0),
        })
    # --- NYSE / AMEX / Arca ---
    text = _fetch(OTHER_LISTED)
    for line in text.splitlines()[1:]:
        if line.startswith("File Creation Time"):
            continue
        f = line.split("|")
        if len(f) < 8:
            continue
        act, name, exch, _cqs, etf, _lot, test, _nq = f[:8]
        if test == "Y":
            continue
        s = act.strip()
        rows.append({
            "t": s,
            "n": name.strip(),
            "e": EXCH.get(exch, exch),
            "ty": "etf" if etf == "Y" else "stock",
            "c": "US",
            "m": caps.get(s, 0),
        })
    # 중복 티커 제거 (otherlisted 에 NASDAQ 심볼이 겹쳐 들어오는 경우)
    seen, uniq = set(), []
    for r in rows:
        if r["t"] in seen:
            continue
        seen.add(r["t"])
        uniq.append(r)
    uniq.sort(key=lambda r: (-r.get("m", 0), r["t"]))
    return uniq


def build_kr():
    try:
        import FinanceDataReader as fdr
    except ImportError:
        sys.exit("FinanceDataReader 필요: pip install finance-datareader")
    rows = []
    # --- 보통주 (KOSPI·KOSDAQ·KONEX) ---
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
        rows.append({"t": code, "n": name, "e": market or "KRX",
                     "ty": "stock", "c": "KR", "m": cap})
    # --- 국내 ETF ---
    try:
        etf = fdr.StockListing("ETF/KR")
        sym_col = "Symbol" if "Symbol" in etf.columns else "Code"
        for _, x in etf.iterrows():
            code = str(x.get(sym_col, "")).strip()
            name = str(x.get("Name", "")).strip()
            if not code or not name or name == "nan":
                continue
            try:
                cap = int(x.get("Marcap") or x.get("MarCap") or 0)
            except (ValueError, TypeError):
                cap = 0
            rows.append({"t": code, "n": name, "e": "ETF", "ty": "etf", "c": "KR", "m": cap})
    except Exception as e:
        print(f"  ! 한국 ETF 가져오기 실패 (보통주만 포함): {e}")
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
    print(f"  미국 {len(us)} 종목 (ETF {sum(1 for r in us if r['ty']=='etf')} 포함)")
    print("한국 종목 수집 중…")
    kr = build_kr()
    print(f"  한국 {len(kr)} 종목 (ETF {sum(1 for r in kr if r['ty']=='etf')} 포함)")

    with open(os.path.join(OUT_DIR, "us.json"), "w", encoding="utf-8") as f:
        json.dump(us, f, ensure_ascii=False, separators=(",", ":"))
    with open(os.path.join(OUT_DIR, "kr.json"), "w", encoding="utf-8") as f:
        json.dump(kr, f, ensure_ascii=False, separators=(",", ":"))
    meta = {
        "us": {"total": len(us), "etf": sum(1 for r in us if r["ty"] == "etf")},
        "kr": {"total": len(kr), "etf": sum(1 for r in kr if r["ty"] == "etf")},
        "total": len(us) + len(kr),
    }
    with open(os.path.join(OUT_DIR, "meta.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)
    print(f"완료 → {OUT_DIR}/us.json · kr.json · meta.json (총 {meta['total']} 종목)")


if __name__ == "__main__":
    main()
