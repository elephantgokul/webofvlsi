-- Migration: 20261112140000_fix_faculty_hod_data.sql
-- Fix duplicate faculty & HOD records, insert missing faculty members, and add unique constraints.

BEGIN;

-- 1. Deduplicate public.faculty (retain lowest ID per email or normalized name)
DELETE FROM public.faculty a USING public.faculty b
WHERE a.id > b.id AND (
  (a.email IS NOT NULL AND b.email IS NOT NULL AND lower(trim(a.email)) = lower(trim(b.email)))
  OR (lower(trim(a.name)) = lower(trim(b.name)))
);

-- 2. Insert missing faculty members (emails set to NULL, Prema qualification "M.E., Ph.D.")
INSERT INTO public.faculty (name, designation, qualification, specialization, email, orcid, image, photo_url)
SELECT 'Mrs. Priscilla Sophia', 'Assistant Professor', 'M.E.', 'VLSI Design and Technology', NULL, '', 'priscillasophia.jpg', 'priscillasophia.jpg'
WHERE NOT EXISTS (
  SELECT 1 FROM public.faculty WHERE lower(trim(name)) = 'mrs. priscilla sophia'
);

INSERT INTO public.faculty (name, designation, qualification, specialization, email, orcid, image, photo_url)
SELECT 'Mrs. C. Prema', 'Assistant Professor', 'M.E., Ph.D.', 'VLSI Design and Technology', NULL, '', 'prema.jpg', 'prema.jpg'
WHERE NOT EXISTS (
  SELECT 1 FROM public.faculty WHERE lower(trim(name)) = 'mrs. c. prema'
);

INSERT INTO public.faculty (name, designation, qualification, specialization, email, orcid, image, photo_url)
SELECT 'Mrs. Vasanthi', 'Assistant Professor', 'M.E.', 'VLSI Design and Technology', NULL, '', 'vasanthi.jpg', 'vasanthi.jpg'
WHERE NOT EXISTS (
  SELECT 1 FROM public.faculty WHERE lower(trim(name)) = 'mrs. vasanthi'
);

-- 3. Add UNIQUE constraint on faculty(name)
ALTER TABLE public.faculty
  DROP CONSTRAINT IF EXISTS uq_faculty_name;
ALTER TABLE public.faculty
  ADD CONSTRAINT uq_faculty_name UNIQUE (name);

-- 4. Deduplicate public.hod (retain lowest ID per name)
DELETE FROM public.hod a USING public.hod b
WHERE a.id > b.id AND lower(trim(a.name)) = lower(trim(b.name));

-- 5. Add UNIQUE constraint on hod(name)
ALTER TABLE public.hod
  DROP CONSTRAINT IF EXISTS uq_hod_name;
ALTER TABLE public.hod
  ADD CONSTRAINT uq_hod_name UNIQUE (name);

COMMIT;
