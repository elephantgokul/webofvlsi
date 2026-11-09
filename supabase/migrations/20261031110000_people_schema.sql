-- Schema-backed tables for students, faculty, and hod.
-- Required prerequisite before 20261031120000_security_hardening.sql.

BEGIN;

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

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read students" ON public.students;
CREATE POLICY "Public can read students" ON public.students
  FOR SELECT TO anon, authenticated USING (true);

GRANT SELECT ON TABLE public.students TO anon, authenticated;


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

ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read faculty" ON public.faculty;
CREATE POLICY "Public can read faculty" ON public.faculty
  FOR SELECT TO anon, authenticated USING (true);

GRANT SELECT ON TABLE public.faculty TO anon, authenticated;


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

ALTER TABLE public.hod ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read hod" ON public.hod;
CREATE POLICY "Public can read hod" ON public.hod
  FOR SELECT TO anon, authenticated USING (true);

GRANT SELECT ON TABLE public.hod TO anon, authenticated;

COMMIT;
