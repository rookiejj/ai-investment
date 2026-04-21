-- ═══════════════════════════════════════════════════
-- 브리픽 친구톡 운영 쿼리 템플릿
-- Supabase Dashboard > SQL Editor에 필요한 섹션만 복사해 실행.
-- 전화번호 형식: '01012345678' (하이픈 없음).
-- ═══════════════════════════════════════════════════


-- ───────────────────────────────────────────────
-- 구독자 등록
-- 카카오 채널 친구 추가·광고 수신 동의 이후 실행
-- ───────────────────────────────────────────────
insert into subscribers (phone, name, kakao_id, metadata)
values (
  '01012345678',
  '홍길동',
  null,              -- 카카오 user_id 있으면 채움
  jsonb_build_object(
    'ad_consent_at',       now(),
    'channel_friended_at', now(),
    'source',              'manual'   -- manual / kakao-channel / web
  )
);


-- ───────────────────────────────────────────────
-- 상태 변경
-- ───────────────────────────────────────────────
-- 일시 정지 (결제 실패·휴가·사용자 요청)
update subscribers set status = 'paused'
  where phone = '01012345678';

-- 재개
update subscribers set status = 'active'
  where phone = '01012345678';

-- 해지 (복구 불가 의도)
update subscribers set status = 'cancelled', expires_at = now()
  where phone = '01012345678';


-- ───────────────────────────────────────────────
-- 광고 수신 동의 갱신 (법적으로 2년 주기 재동의 권장)
-- ───────────────────────────────────────────────
update subscribers
  set metadata = metadata || jsonb_build_object('ad_consent_at', now())
  where phone = '01012345678';


-- ───────────────────────────────────────────────
-- 운영 조회
-- ───────────────────────────────────────────────
-- 활성 구독자 수
select count(*) as active_count
  from subscribers where status = 'active';

-- 최근 7일 상태별 발송량
select
  date_trunc('day', sent_at)::date as day,
  status,
  count(*) as n
from send_logs
where sent_at >= now() - interval '7 days'
group by 1, 2
order by 1 desc, 2;

-- 특정 번호 최근 발송 이력 30건
select sent_at, status, char_count, provider, provider_code, provider_message
from send_logs
where phone = '01012345678'
order by sent_at desc
limit 30;

-- 실패분만 최근 24시간
select sent_at, phone, provider, provider_code, provider_message
from send_logs
where status = 'fail' and sent_at >= now() - interval '24 hours'
order by sent_at desc;

-- 광고 수신 동의가 만료 임박한 구독자 (동의 후 23개월 경과)
select phone, name, metadata->>'ad_consent_at' as consent_at
from subscribers
where status = 'active'
  and (metadata->>'ad_consent_at')::timestamptz < now() - interval '23 months'
order by consent_at;
