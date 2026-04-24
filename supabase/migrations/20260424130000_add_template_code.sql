-- send_logs에 발송 용도/템플릿 식별자 추가
-- 알림톡 템플릿(payment_complete, renew_reminder 등) + 친구톡 용도(daily_news, manual) 구분용
-- nullable: 과거 로그와 호환

alter table public.send_logs
  add column if not exists template_code text;

create index if not exists send_logs_template_code_idx
  on public.send_logs(template_code);
