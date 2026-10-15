-- Coeus operational schema

create table if not exists profiles (
  user_id text primary key,
  email text,
  name text,
  role text not null default 'submitter',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists form_schemas (
  id serial primary key,
  slug text not null unique,
  name text not null,
  description text not null default '',
  version int not null default 1,
  fields jsonb not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists submissions (
  id serial primary key,
  schema_id int not null references form_schemas(id),
  submitted_by text not null,
  submitter_name text not null default '',
  channel text not null default 'form',
  status text not null default 'pending_review',
  payload jsonb not null,
  validation_errors jsonb,
  region text,
  category text,
  severity text,
  quality_score int,
  ai_notes text,
  ai_model text,
  ai_reviewed_at timestamptz,
  is_seed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists submissions_submitted_by_idx on submissions (submitted_by);
create index if not exists submissions_status_idx on submissions (status);
create index if not exists submissions_created_at_idx on submissions (created_at desc);
create index if not exists submissions_region_idx on submissions (region);

create table if not exists audit_events (
  id serial primary key,
  actor_id text,
  action text not null,
  entity_type text,
  entity_id text,
  details jsonb,
  created_at timestamptz not null default now()
);

create table if not exists ai_summaries (
  id serial primary key,
  title text not null,
  period_start date,
  period_end date,
  trigger text not null,
  facts jsonb not null,
  narrative text not null,
  sources jsonb,
  confidence text not null default 'medium',
  model text not null,
  prompt_version text not null default 'v1',
  input_tokens int not null default 0,
  output_tokens int not null default 0,
  cost_cents numeric not null default 0,
  flagged boolean not null default false,
  flag_note text,
  created_by text,
  created_at timestamptz not null default now()
);

create table if not exists ai_usage (
  id serial primary key,
  user_id text,
  purpose text not null,
  model text not null,
  input_tokens int not null default 0,
  output_tokens int not null default 0,
  cost_cents numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists chat_threads (
  id serial primary key,
  user_id text not null,
  title text not null default 'New conversation',
  created_at timestamptz not null default now()
);

create table if not exists chat_messages (
  id serial primary key,
  thread_id int not null references chat_threads(id) on delete cascade,
  user_id text not null,
  role text not null,
  content text not null,
  chart jsonb,
  sources jsonb,
  created_at timestamptz not null default now()
);

create index if not exists chat_threads_user_idx on chat_threads (user_id);
create index if not exists chat_messages_thread_idx on chat_messages (thread_id);

create table if not exists app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by text
);

create table if not exists saved_views (
  id serial primary key,
  user_id text not null,
  name text not null,
  filters jsonb not null,
  created_at timestamptz not null default now()
);
