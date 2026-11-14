-- Schema-backed tables for students, faculty, and hod.
-- Required prerequisite before 20261031120000_security_hardening.sql.
-- Safe and idempotent: handles both fresh databases and pre-existing tables.

BEGIN;

-- Helper function: verify site administrator
CREATE OR REPLACE FUNCTION public.is_site_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $function$
  SELECT lower(COALESCE(auth.jwt() ->> 'email', '')) = 'hodvlsi@siet.ac.in'
    AND COALESCE(auth.jwt() -> 'app_metadata' ->> 'site_admin', 'false') = 'true';
$function$;

REVOKE ALL ON FUNCTION public.is_site_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_site_admin() TO anon, authenticated;

-- 1. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS public.students (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  programme TEXT,
  year TEXT,
  batch TEXT,
  achievement_title TEXT,
  achievement TEXT,
  description TEXT,
  projects_overview TEXT,
  image TEXT,
  photo_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Safely ensure all columns exist if the table was pre-existing with partial columns
ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS programme TEXT,
  ADD COLUMN IF NOT EXISTS year TEXT,
  ADD COLUMN IF NOT EXISTS batch TEXT,
  ADD COLUMN IF NOT EXISTS achievement_title TEXT,
  ADD COLUMN IF NOT EXISTS achievement TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS projects_overview TEXT,
  ADD COLUMN IF NOT EXISTS image TEXT,
  ADD COLUMN IF NOT EXISTS photo_url TEXT,
  ADD COLUMN IF NOT EXISTS linkedin TEXT,
  ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
  ADD COLUMN IF NOT EXISTS github_url TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read students" ON public.students;
DROP POLICY IF EXISTS "Public can view students" ON public.students;
CREATE POLICY "Public can read students" ON public.students
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admins can manage students" ON public.students;
CREATE POLICY "Admins can manage students" ON public.students
  FOR ALL TO authenticated
  USING (public.is_site_admin())
  WITH CHECK (public.is_site_admin());

GRANT SELECT ON TABLE public.students TO anon, authenticated;
GRANT ALL ON TABLE public.students TO authenticated;


-- 2. FACULTY TABLE
CREATE TABLE IF NOT EXISTS public.faculty (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  qualification TEXT,
  specialization TEXT,
  email TEXT,
  orcid TEXT,
  image TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Safely ensure all columns exist if the table was pre-existing with partial columns
ALTER TABLE public.faculty
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS designation TEXT,
  ADD COLUMN IF NOT EXISTS qualification TEXT,
  ADD COLUMN IF NOT EXISTS specialization TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS orcid TEXT,
  ADD COLUMN IF NOT EXISTS image TEXT,
  ADD COLUMN IF NOT EXISTS photo_url TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read faculty" ON public.faculty;
DROP POLICY IF EXISTS "Public can view faculty" ON public.faculty;
CREATE POLICY "Public can read faculty" ON public.faculty
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admins can manage faculty" ON public.faculty;
CREATE POLICY "Admins can manage faculty" ON public.faculty
  FOR ALL TO authenticated
  USING (public.is_site_admin())
  WITH CHECK (public.is_site_admin());

GRANT SELECT ON TABLE public.faculty TO anon, authenticated;
GRANT ALL ON TABLE public.faculty TO authenticated;


-- 3. HOD TABLE
CREATE TABLE IF NOT EXISTS public.hod (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  qualification TEXT,
  message TEXT,
  contact TEXT,
  phone TEXT,
  research_interests TEXT[],
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Safely ensure all columns exist if the table was pre-existing with partial columns
ALTER TABLE public.hod
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS designation TEXT,
  ADD COLUMN IF NOT EXISTS qualification TEXT,
  ADD COLUMN IF NOT EXISTS message TEXT,
  ADD COLUMN IF NOT EXISTS contact TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS research_interests TEXT[],
  ADD COLUMN IF NOT EXISTS photo_url TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

ALTER TABLE public.hod ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read hod" ON public.hod;
DROP POLICY IF EXISTS "Public can view hod" ON public.hod;
CREATE POLICY "Public can read hod" ON public.hod
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admins can manage hod" ON public.hod;
CREATE POLICY "Admins can manage hod" ON public.hod
  FOR ALL TO authenticated
  USING (public.is_site_admin())
  WITH CHECK (public.is_site_admin());

GRANT SELECT ON TABLE public.hod TO anon, authenticated;
GRANT ALL ON TABLE public.hod TO authenticated;

COMMIT;
