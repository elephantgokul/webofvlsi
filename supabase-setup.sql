-- =========================================================================
-- SIET VLSI — Supabase Database Setup Script
-- Run this in Supabase Dashboard → SQL Editor → New Query
-- =========================================================================

-- 1. CREATE THE EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'event',
  event_date DATE NOT NULL,
  event_time TEXT,
  end_date DATE,
  venue TEXT,
  description TEXT,
  poster_url TEXT,
  registration_url TEXT,
  registration_deadline DATE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. CREATE INDEX FOR FASTER QUERIES
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_status_date ON public.events(status, event_date);

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES

-- Allow public (anonymous) users to READ only published events
DROP POLICY IF EXISTS "Public can read published events" ON public.events;
CREATE POLICY "Public can read published events"
  ON public.events
  FOR SELECT
  USING (status = 'published');

-- Allow authenticated users (admins) to read ALL events (including drafts)
DROP POLICY IF EXISTS "Admins can read all events" ON public.events;
CREATE POLICY "Admins can read all events"
  ON public.events
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users (admins) to INSERT events
DROP POLICY IF EXISTS "Admins can create events" ON public.events;
CREATE POLICY "Admins can create events"
  ON public.events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users (admins) to UPDATE events
DROP POLICY IF EXISTS "Admins can update events" ON public.events;
CREATE POLICY "Admins can update events"
  ON public.events
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users (admins) to DELETE events
DROP POLICY IF EXISTS "Admins can delete events" ON public.events;
CREATE POLICY "Admins can delete events"
  ON public.events
  FOR DELETE
  TO authenticated
  USING (true);

-- 5. STORAGE BUCKET FOR EVENT POSTERS
-- Note: Run this separately if the 'events' bucket doesn't already exist.
-- In Supabase Dashboard → Storage → Create new bucket named 'events' (set to Public).
-- Then add this storage policy:

-- INSERT INTO storage.buckets (id, name, public) VALUES ('events', 'events', true)
-- ON CONFLICT (id) DO NOTHING;

-- Storage policy: Allow authenticated users to upload to events bucket
-- (Run in SQL Editor or set via Supabase Dashboard → Storage → Policies)

-- CREATE POLICY "Admins can upload event posters"
-- ON storage.objects
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (bucket_id = 'events');

-- CREATE POLICY "Public can view event posters"
-- ON storage.objects
-- FOR SELECT
-- USING (bucket_id = 'events');

-- 6. SEED SAMPLE EVENTS (Optional - uncomment to add starter data)
/*
INSERT INTO public.events (title, category, event_date, event_time, venue, description, status) VALUES
  ('ELECNOVA 2026 — National Technical Symposium', 'symposium', '2026-07-14', '9:00 AM', 'Main Auditorium', 'Annual national-level technical symposium featuring paper presentations, project expo, workshops, and guest lectures from industry leaders.', 'published'),
  ('Expert Talk: 5G Networks & Open RAN Architecture', 'talk', '2026-07-21', '2:00 PM', 'Seminar Hall 2', 'Industry expert from Ericsson India speaks on 5G NR, Open RAN, and what it means for VLSI engineers entering the workforce.', 'published'),
  ('Hands-on: PCB Design & Rapid Prototyping', 'workshop', '2026-08-02', '10:00 AM', 'Electronics Lab 3', 'Full-day workshop — design a PCB in KiCad, generate Gerbers, fabricate using lab CNC milling machine, and solder live.', 'published'),
  ('Circuit Debugging Challenge 2026', 'competition', '2026-08-10', '10:00 AM', 'Electronics Lab 1', 'Inter-batch circuit debugging competition. Teams of 2 race to identify and fix faults in pre-built PCBs within a time limit.', 'published'),
  ('Alumni Meet & Mentorship Day 2026', 'alumni', '2026-08-16', '4:00 PM', 'Dept Block Lawn', 'Annual alumni gathering — networking, mentorship panels, career guidance sessions, and department project showcase.', 'published'),
  ('Freshers Day 2026 — Welcome Celebration', 'cultural', '2026-08-28', '5:30 PM', 'College Auditorium', 'Welcome event for the new batch — cultural performances, faculty introductions, and department orientation.', 'published');
*/

-- =========================================================================
-- DONE! After running this script:
-- 1. Go to Authentication → Users → Invite User
--    Email: Hodvlsi@siet.ac.in
--    Password: vlsi@2024
-- 2. Or use the one-time setup page: pages/setup.html
-- =========================================================================
