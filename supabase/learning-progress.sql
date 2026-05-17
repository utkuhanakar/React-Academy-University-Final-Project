-- React Akademi: Supabase SQL editor veya migrate ile tek sefer uygulanır.
-- Projede OTP / Magic Link e-posta doğrulaması etkin olmalıdır.

create table if not exists public.learning_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  completed_lesson_ids text[] not null default '{}'::text[],
  last_lesson_id text null,
  extended_progress jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.learning_progress add column if not exists extended_progress jsonb not null default '{}'::jsonb;

comment on table public.learning_progress is 'React Akademi tamamlanan dersler ve son konum kaydı';

create index if not exists learning_progress_updated_at_idx
  on public.learning_progress (updated_at desc);

alter table public.learning_progress enable row level security;

drop policy if exists "Kullanıcı kendi kaydına erişsin" on public.learning_progress;
create policy "Kullanıcı kendi kaydına erişsin"
  on public.learning_progress
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
