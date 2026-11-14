-- 20261031115000_students_schema.sql
-- Ensure public.students table schema, columns, and unique constraint.
-- Runs before 20261031120000_security_hardening.sql.
-- Note: RLS, policies, grants, and public_students view are managed exclusively by 20261031120000_security_hardening.sql.

BEGIN;

CREATE TABLE IF NOT EXISTS public.students (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  programme TEXT NOT NULL DEFAULT 'B.E. VLSI Design and Technology',
  year TEXT,
  batch TEXT,
  achievement_title TEXT,
  achievement TEXT,
  description TEXT,
  projects_overview TEXT,
  image TEXT,
  photo_url TEXT,
  linkedin TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Safely ensure all columns exist if the table was pre-existing with partial columns
ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS programme TEXT DEFAULT 'B.E. VLSI Design and Technology',
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

-- Unique constraint on (name, batch) to support ON CONFLICT and prevent duplicates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'uq_students_name_batch'
      AND conrelid = 'public.students'::regclass
  ) THEN
    ALTER TABLE public.students
      ADD CONSTRAINT uq_students_name_batch UNIQUE (name, batch);
  END IF;
END $$;

COMMIT;

