/* trading 터미널 설정 (공개·비밀 없음).
 *
 * 데이터 경로 우선순위:
 *   1) 같은 오리진에 /api/market-data 프록시가 있으면 그것 사용 (로컬 node server / Docker)
 *   2) 없으면 SUPABASE_MARKET_URL (Cloudflare Pages 정적 배포 → Supabase Edge Function)
 *   3) 둘 다 실패하면 시세는 "데이터 없음 / API 필요" 로 표시 (가짜 숫자 금지)
 *
 * ⚠️ 비밀 키(GEMINI_API_KEY, 브로커 키 등)는 절대 이 파일에 넣지 말 것.
 *    사용자가 터미널 [설정] 패널에서 입력 → 브라우저 localStorage 에만 저장.
 *    배포 서버/깃에는 저장되지 않음. 보안 주의는 trading/README.md 참조.
 */
window.TRADING_CONFIG = {
  // 프로덕션 정적 배포에서 쓸 시세 프록시 (Supabase Edge Function market-data).
  // 로컬/Docker 로 실행하면 자동으로 /api/market-data 가 우선되어 이 값은 폴백.
  SUPABASE_MARKET_URL: 'https://ytvcgoldauysvnqckzze.supabase.co/functions/v1/market-data',

  // 첫 화면 지수 스트립 (실데이터). Yahoo 심볼 표기.
  INDICES: [
    { sym: '^GSPC', label: 'S&P 500' },
    { sym: '^IXIC', label: 'NASDAQ' },
    { sym: '^DJI',  label: 'DOW' },
    { sym: '^VIX',  label: 'VIX' },
    { sym: '^TNX',  label: 'US 10Y' },
    { sym: 'DX-Y.NYB', label: 'DXY' },
    { sym: 'CL=F',  label: 'WTI' },
    { sym: 'GC=F',  label: 'GOLD' },
    { sym: 'BTC-USD', label: 'BTC' },
    { sym: 'KRW=X', label: 'USD/KRW' },
    { sym: '^KS11', label: 'KOSPI' },
    { sym: '^KQ11', label: 'KOSDAQ' },
  ],

  // 기본 관심종목 (비로그인도 실데이터로 보임)
  DEFAULT_WATCHLIST: ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN', 'GOOGL', 'META', 'SPY', 'QQQ', '005930.KS'],

  // 기본 차트 심볼
  DEFAULT_SYMBOL: 'AAPL',

  // 지수 스트립·관심종목 폴링 주기(ms). Yahoo 15분 지연이라 잦게 안 함.
  POLL_MS: 60000,
};
