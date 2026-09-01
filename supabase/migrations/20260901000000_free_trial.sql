-- 무료 체험 시작 일시 추적 컬럼. NOT NULL이면 이미 체험 사용한 번호.
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS trial_starts_at TIMESTAMPTZ;
