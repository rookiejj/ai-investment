-- send_logs에 메시지 종류 구분 (친구톡·알림톡·SMS 통합 로깅)

alter table public.send_logs
  add column if not exists message_type text not null default 'friendtalk'
  check (message_type in ('friendtalk', 'alimtalk', 'sms'));

create index if not exists send_logs_message_type_idx
  on public.send_logs(message_type);
