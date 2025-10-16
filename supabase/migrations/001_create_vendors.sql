-- Create vendors table
create table if not exists vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  service_type text not null,
  city text not null,
  state text not null,
  rating numeric(2,1) check (rating >= 0 and rating <= 5),
  review_count int default 0,
  image_url text,
  description text,
  price_range text check (price_range in ('$', '$$', '$$$')),
  is_licensed boolean default false,
  is_insured boolean default false,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table vendors enable row level security;

-- Create policy to allow anyone to read vendors (for discovery)
create policy "Anyone can read vendors"
  on vendors for select
  using (true);

-- Create policy to allow authenticated users to insert vendors
create policy "Authenticated users can insert vendors"
  on vendors for insert
  with check (auth.role() = 'authenticated');

-- Create index on service_type and city for faster searches
create index idx_vendors_service_city on vendors(service_type, city);

-- Insert 2 fake vendors for testing
insert into vendors (name, service_type, city, state, rating, review_count, image_url, description, price_range, is_licensed, is_insured)
values
  (
    'Crystal Clear Power Washing',
    'Power Washing',
    'Austin',
    'TX',
    4.9,
    127,
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
    'Professional power washing services with eco-friendly solutions. Family-owned and operated for 15 years.',
    '$$',
    true,
    true
  ),
  (
    'Sparkle Window Pros',
    'Window Cleaning',
    'Austin',
    'TX',
    4.7,
    89,
    'https://images.unsplash.com/photo-1581578949510-fa7315c4c350?w=800&q=80',
    'Expert window cleaning for residential and commercial properties. Same-day service available.',
    '$',
    true,
    true
  );
