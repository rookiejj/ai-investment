#!/usr/bin/env node
/**
 * snapshot-prices — 사내 시세 피드를 레포 안 정적 파일로 떠서 자동 갱신 에이전트에 공급.
 *
 * 왜 필요한가 (2026-07-20 사고):
 *   자동 갱신 원격 sandbox 는 proxy 가 Supabase 호스트(prices/latest.json)를 차단해
 *   시세 피드에 못 닿는다. 그래서 KR/US "현재가·등락률"을 웹검색으로 쓰는데, 프리마켓
 *   (07시 실행)엔 장중 데이터가 없어 에이전트가 "블랙먼데이 반등 +3.74%" 같은 등락률을
 *   창작하고, 심지어 토요일(7/18)에 장 마감을 부여하는 날짜 착각까지 냈다. (7/14 도 동일)
 *
 *   GitHub Actions runner 는 Supabase 차단이 없다(db-sync 가 그 경로로 동작). 이 스크립트를
 *   Actions cron(장 마감 직후)이 돌려 피드를 data/prices-snapshot.json 으로 커밋하면,
 *   sandbox 는 git 작업공간에서 그 파일을 읽어 "실제 마지막 종가"를 그대로 쓴다. 창작 여지 제거.
 *
 * 산출물: data/prices-snapshot.json
 *   { asOf, asOfKst, session, note, prices:{ ticker:{c,pc,chg} } }
 *   c=스냅샷 시점 가격(장 마감 직후면 당일 종가), pc=prevClose, chg=changePct(소수1)
 *
 * 지수(KOSPI 등)는 넣지 않는다: 사내 피드에 없고, Yahoo ^KS11 은 previousClose 참조가
 *   stale 이라 등락률이 실제와 크게 어긋난다(개별주 -2%대인데 지수 -10% 로 뱉는 케이스 확인).
 *   잘못된 숫자 주입이 애초의 사고 원인이므로, 신뢰 가능한 사내 피드(개별 종목)만 담는다.
 *   에이전트는 개별주 스냅샷으로 시장 방향·대표 등락을 잡고, 지수 레벨은 별도 검증한다.
 *
 * 사용: node scripts/snapshot-prices.js   (env FEED_URL 로 피드 URL 오버라이드 가능)
 * exit: 피드 실패 시 1, 그 외 0.
 */
const fs = require('fs');
const path = require('path');

const FEED_URL = process.env.FEED_URL
  || 'https://ytvcgoldauysvnqckzze.supabase.co/storage/v1/object/public/prices/latest.json';
const OUT = path.resolve(__dirname, '..', 'data', 'prices-snapshot.json');

const UA = 'Mozilla/5.0';

function kst(date) {
  const p = (n) => String(n).padStart(2, '0');
  const k = new Date(date.getTime() + 9 * 3600 * 1000);
  return `${k.getUTCFullYear()}-${p(k.getUTCMonth() + 1)}-${p(k.getUTCDate())} ${p(k.getUTCHours())}:${p(k.getUTCMinutes())} KST`;
}

async function main() {
  const now = new Date();

  // 1) 피드 (필수)
  const fr = await fetch(`${FEED_URL}?_=${now.getTime()}`, { headers: { 'User-Agent': UA } });
  if (!fr.ok) { console.error(`[snapshot-prices] 피드 실패 ${fr.status}`); process.exit(1); }
  const feed = await fr.json();
  const src = feed.prices || feed;
  const tickers = Object.keys(src);
  if (!tickers.length) { console.error('[snapshot-prices] 피드 종목 0건'); process.exit(1); }

  const prices = {};
  for (const t of tickers) {
    const x = src[t];
    if (!x || x.price == null) continue;
    prices[t] = {
      c: x.price,
      pc: x.prevClose ?? null,
      chg: x.changePct != null ? Number(x.changePct.toFixed(1)) : 0,
    };
  }

  // 2) KST 시각으로 세션 판정 (장 마감 직후 크론이 주 용도)
  const hourKst = (now.getUTCHours() + 9) % 24;
  const session = hourKst >= 16 || hourKst < 6
    ? 'KR 당일 종가 (장 마감 후)'
    : 'KR 장중/장전 (c=스냅샷 시점가·pc=직전 종가)';

  const out = {
    asOf: now.toISOString(),
    asOfKst: kst(now),
    session,
    note: '자동 갱신 에이전트 시세 소스. KR/US 종목 개별 가격·등락률은 이 파일을 1차로 쓰고 창작 금지. c=가격, pc=직전 종가, chg=등락률(%). 지수는 미포함 — 별도 검증하되 방향은 이 종목들과 일치해야 함.',
    count: Object.keys(prices).length,
    prices,
  };
  fs.writeFileSync(OUT, JSON.stringify(out, null, 0) + '\n');
  console.log(`[snapshot-prices] ${out.count}종목 → ${path.relative(process.cwd(), OUT)} (${out.asOfKst})`);
}

main().catch((e) => { console.error('[snapshot-prices] fail:', e.message); process.exit(1); });
