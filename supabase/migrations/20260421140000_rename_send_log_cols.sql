-- send_logs 컬럼을 업체 중립 이름으로 정리 + provider 구분자 추가

alter table public.send_logs rename column aligo_code    to provider_code;
alter table public.send_logs rename column aligo_message to provider_message;
alter table public.send_logs rename column aligo_msg_id  to provider_msg_id;

alter table public.send_logs
  add column if not exists provider text not null default 'solapi';

create index if not exists send_logs_provider_idx on public.send_logs(provider);
