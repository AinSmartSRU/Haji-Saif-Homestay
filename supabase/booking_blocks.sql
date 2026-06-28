create table if not exists booking_blocks (
  id uuid primary key default gen_random_uuid(),
  unit text not null check (unit in ('Nonamanis', 'Serimuka')),
  check_in date not null,
  check_out date not null,
  source text not null default 'manual' check (
    source in ('manual', 'booking.com', 'agoda', 'whatsapp', 'internal', 'maintenance', 'other')
  ),
  reason text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (check_in < check_out)
);

create index if not exists booking_blocks_unit_dates_idx
on booking_blocks (unit, check_in, check_out)
where is_active = true;

-- Recommended RLS follow-up (review before applying):
-- alter table booking_blocks enable row level security;
-- Public users should not be able to insert/update/delete booking_blocks.
-- Admin users should be allowed to read/create/update booking_blocks.
