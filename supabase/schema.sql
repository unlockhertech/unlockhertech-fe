-- Unlock Her Tech Supabase Schema
-- Tables: resource_leads, booking_leads, event_discount_claims

-- 1. Resource Download Leads Table
CREATE TABLE IF NOT EXISTS public.resource_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  full_name TEXT,
  discord_handle TEXT,
  role_interest TEXT,
  resource_title TEXT NOT NULL,
  resource_slug TEXT,
  category TEXT,
  collection TEXT,
  download_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_agent TEXT,
  referrer TEXT
);

-- Index for analytics & fast queries
CREATE INDEX IF NOT EXISTS idx_resource_leads_email ON public.resource_leads(email);
CREATE INDEX IF NOT EXISTS idx_resource_leads_download_date ON public.resource_leads(download_date);
CREATE INDEX IF NOT EXISTS idx_resource_leads_category ON public.resource_leads(category);
CREATE INDEX IF NOT EXISTS idx_resource_leads_collection ON public.resource_leads(collection);

-- 2. Event Ticket Discount Claims Table
CREATE TABLE IF NOT EXISTS public.event_discount_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  full_name TEXT,
  event_title TEXT NOT NULL,
  discount_code TEXT,
  discount_percentage TEXT,
  ticket_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_discount_claims_email ON public.event_discount_claims(email);
CREATE INDEX IF NOT EXISTS idx_discount_claims_event ON public.event_discount_claims(event_title);

-- 3. Mentorship & Booking Leads Table
CREATE TABLE IF NOT EXISTS public.booking_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  full_name TEXT,
  meeting_key TEXT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TEXT,
  timezone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_leads_email ON public.booking_leads(email);
CREATE INDEX IF NOT EXISTS idx_booking_leads_date ON public.booking_leads(booking_date);

-- Enable Row Level Security (RLS) across all tables
ALTER TABLE public.resource_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_discount_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_leads ENABLE ROW LEVEL SECURITY;

-- Restrict direct public access. Serverless functions use service role key to insert.
CREATE POLICY "Service role full access on resource_leads"
  ON public.resource_leads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on event_discount_claims"
  ON public.event_discount_claims
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on booking_leads"
  ON public.booking_leads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
