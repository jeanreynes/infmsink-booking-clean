create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_reference text not null unique,
  client_name text not null,
  mobile_number text not null,
  email text,
  social_handle text,
  artist_name text not null,
  service_name text not null,
  booking_date date not null,
  booking_time text not null,
  placement text,
  size text,
  budget text,
  preferred_branch text,
  design_description text,
  notes text,
  reference_image_url text,
  proof_of_payment_url text not null,
  proof_reference_number text,
  payer_name text,
  deposit_amount numeric not null default 0,
  status text not null,
  submitted_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.slots (
  id uuid primary key default gen_random_uuid(),
  artist_name text not null,
  slot_date date not null,
  slot_time text not null,
  status text not null,
  held_until timestamptz,
  booking_id uuid references public.bookings(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (artist_name, slot_date, slot_time)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  action text not null,
  action_by text not null,
  notes text,
  created_at timestamptz not null default now()
);
