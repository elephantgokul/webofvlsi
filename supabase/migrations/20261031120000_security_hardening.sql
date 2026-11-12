-- Security hardening for the SIET VLSI public website.
-- Apply only after reviewing against the target schema. This is a forward-only
-- migration: it adds restrictive policy ceilings and does not delete unknown policies.
-- It requires schema-backed students, faculty, and hod tables. The repository
-- does not define those tables; this migration fails before changing anything
-- if they are absent. Faculty/HOD column allowlists still require schema review.

BEGIN;

DO $preflight$
DECLARE
  missing_tables TEXT;
  people_rls_disabled TEXT;
BEGIN
  SELECT string_agg(required.table_name, ', ' ORDER BY required.table_name)
    INTO missing_tables
  FROM (VALUES
    ('events'),
    ('gallery_categories'),
    ('gallery_media'),
    ('contact_messages'),
    ('students'),
    ('faculty'),
    ('hod')
  ) AS required(table_name)
  WHERE to_regclass('public.' || required.table_name) IS NULL;

  IF missing_tables IS NOT NULL THEN
    RAISE EXCEPTION 'Security hardening prerequisites are missing public tables: %. Add a schema-backed migration before hardening.', missing_tables;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'students'
      AND column_name IN ('name', 'student_name')
  ) THEN
    RAISE EXCEPTION 'Security hardening requires public.students.name or public.students.student_name; inspect the source schema first.';
  END IF;

  SELECT string_agg(required.table_name, ', ' ORDER BY required.table_name)
    INTO people_rls_disabled
  FROM (VALUES ('faculty'), ('hod')) AS required(table_name)
  JOIN pg_class AS rel ON rel.oid = to_regclass('public.' || required.table_name)
  WHERE NOT rel.relrowsecurity;

  IF people_rls_disabled IS NOT NULL THEN
    RAISE EXCEPTION 'Row-level security must be defined by a schema-backed migration for: %.', people_rls_disabled;
  END IF;
END;
$preflight$;

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

-- Events: remove table/column grants that could survive policy changes, then
-- restore only the public read and authenticated admin operations used by the site.
REVOKE ALL PRIVILEGES ON TABLE public.events FROM PUBLIC, anon, authenticated;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published events" ON public.events;
DROP POLICY IF EXISTS "Admins can read all events" ON public.events;
DROP POLICY IF EXISTS "Site admin can read all events" ON public.events;
DROP POLICY IF EXISTS "Admins can create events" ON public.events;
DROP POLICY IF EXISTS "Site admin can create events" ON public.events;
DROP POLICY IF EXISTS "Admins can update events" ON public.events;
DROP POLICY IF EXISTS "Site admin can update events" ON public.events;
DROP POLICY IF EXISTS "Admins can delete events" ON public.events;
DROP POLICY IF EXISTS "Site admin can delete events" ON public.events;

CREATE POLICY "Public can read published events" ON public.events
  FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "Site admin can read all events" ON public.events
  FOR SELECT TO authenticated USING (public.is_site_admin());
CREATE POLICY "Site admin can create events" ON public.events
  FOR INSERT TO authenticated WITH CHECK (public.is_site_admin());
CREATE POLICY "Site admin can update events" ON public.events
  FOR UPDATE TO authenticated USING (public.is_site_admin()) WITH CHECK (public.is_site_admin());
CREATE POLICY "Site admin can delete events" ON public.events
  FOR DELETE TO authenticated USING (public.is_site_admin());

DROP POLICY IF EXISTS "security_events_read_ceiling" ON public.events;
DROP POLICY IF EXISTS "security_events_insert_ceiling" ON public.events;
DROP POLICY IF EXISTS "security_events_update_ceiling" ON public.events;
DROP POLICY IF EXISTS "security_events_delete_ceiling" ON public.events;
CREATE POLICY "security_events_read_ceiling" ON public.events
  AS RESTRICTIVE FOR SELECT TO anon, authenticated
  USING (
    (auth.role() IN ('anon', 'authenticated') AND status = 'published')
    OR (auth.role() = 'authenticated' AND public.is_site_admin())
  );
CREATE POLICY "security_events_insert_ceiling" ON public.events
  AS RESTRICTIVE FOR INSERT TO anon, authenticated
  WITH CHECK (auth.role() = 'authenticated' AND public.is_site_admin());
CREATE POLICY "security_events_update_ceiling" ON public.events
  AS RESTRICTIVE FOR UPDATE TO anon, authenticated
  USING (auth.role() = 'authenticated' AND public.is_site_admin())
  WITH CHECK (auth.role() = 'authenticated' AND public.is_site_admin());
CREATE POLICY "security_events_delete_ceiling" ON public.events
  AS RESTRICTIVE FOR DELETE TO anon, authenticated
  USING (auth.role() = 'authenticated' AND public.is_site_admin());

GRANT SELECT ON TABLE public.events TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.events TO authenticated;
GRANT SELECT (id) ON TABLE public.events TO service_role;

-- Public category names are harmless; all category writes remain admin-only.
REVOKE ALL PRIVILEGES ON TABLE public.gallery_categories FROM PUBLIC, anon, authenticated;
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active gallery categories" ON public.gallery_categories;
DROP POLICY IF EXISTS "Site admin can manage gallery categories" ON public.gallery_categories;
DROP POLICY IF EXISTS "Site admin can insert gallery categories" ON public.gallery_categories;
DROP POLICY IF EXISTS "Site admin can update gallery categories" ON public.gallery_categories;
DROP POLICY IF EXISTS "Site admin can delete gallery categories" ON public.gallery_categories;
CREATE POLICY "Public can read active gallery categories" ON public.gallery_categories
  FOR SELECT TO anon, authenticated USING (is_active OR public.is_site_admin());
CREATE POLICY "Site admin can insert gallery categories" ON public.gallery_categories
  FOR INSERT TO authenticated WITH CHECK (public.is_site_admin());
CREATE POLICY "Site admin can update gallery categories" ON public.gallery_categories
  FOR UPDATE TO authenticated USING (public.is_site_admin()) WITH CHECK (public.is_site_admin());
CREATE POLICY "Site admin can delete gallery categories" ON public.gallery_categories
  FOR DELETE TO authenticated USING (public.is_site_admin());

DROP POLICY IF EXISTS "security_gallery_categories_read_ceiling" ON public.gallery_categories;
DROP POLICY IF EXISTS "security_gallery_categories_insert_ceiling" ON public.gallery_categories;
DROP POLICY IF EXISTS "security_gallery_categories_update_ceiling" ON public.gallery_categories;
DROP POLICY IF EXISTS "security_gallery_categories_delete_ceiling" ON public.gallery_categories;
CREATE POLICY "security_gallery_categories_read_ceiling" ON public.gallery_categories
  AS RESTRICTIVE FOR SELECT TO anon, authenticated
  USING (is_active OR (auth.role() = 'authenticated' AND public.is_site_admin()));
CREATE POLICY "security_gallery_categories_insert_ceiling" ON public.gallery_categories
  AS RESTRICTIVE FOR INSERT TO anon, authenticated
  WITH CHECK (auth.role() = 'authenticated' AND public.is_site_admin());
CREATE POLICY "security_gallery_categories_update_ceiling" ON public.gallery_categories
  AS RESTRICTIVE FOR UPDATE TO anon, authenticated
  USING (auth.role() = 'authenticated' AND public.is_site_admin())
  WITH CHECK (auth.role() = 'authenticated' AND public.is_site_admin());
CREATE POLICY "security_gallery_categories_delete_ceiling" ON public.gallery_categories
  AS RESTRICTIVE FOR DELETE TO anon, authenticated
  USING (auth.role() = 'authenticated' AND public.is_site_admin());

GRANT SELECT ON TABLE public.gallery_categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.gallery_categories TO authenticated;
GRANT SELECT (id) ON TABLE public.gallery_categories TO service_role;

-- Gallery metadata exposes only published rows and non-secret columns to visitors.
REVOKE ALL PRIVILEGES ON TABLE public.gallery_media FROM PUBLIC, anon, authenticated;
ALTER TABLE public.gallery_media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published gallery media" ON public.gallery_media;
DROP POLICY IF EXISTS "Site admin can read all gallery media" ON public.gallery_media;
DROP POLICY IF EXISTS "Site admin can insert gallery media" ON public.gallery_media;
DROP POLICY IF EXISTS "Site admin can update gallery media" ON public.gallery_media;
DROP POLICY IF EXISTS "Site admin can delete gallery media" ON public.gallery_media;
CREATE POLICY "Public can read published gallery media" ON public.gallery_media
  FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "Site admin can read all gallery media" ON public.gallery_media
  FOR SELECT TO authenticated USING (public.is_site_admin());
CREATE POLICY "Site admin can insert gallery media" ON public.gallery_media
  FOR INSERT TO authenticated WITH CHECK (public.is_site_admin());
CREATE POLICY "Site admin can update gallery media" ON public.gallery_media
  FOR UPDATE TO authenticated USING (public.is_site_admin()) WITH CHECK (public.is_site_admin());
CREATE POLICY "Site admin can delete gallery media" ON public.gallery_media
  FOR DELETE TO authenticated USING (public.is_site_admin());

DROP POLICY IF EXISTS "security_gallery_media_read_ceiling" ON public.gallery_media;
DROP POLICY IF EXISTS "security_gallery_media_insert_ceiling" ON public.gallery_media;
DROP POLICY IF EXISTS "security_gallery_media_update_ceiling" ON public.gallery_media;
DROP POLICY IF EXISTS "security_gallery_media_delete_ceiling" ON public.gallery_media;
CREATE POLICY "security_gallery_media_read_ceiling" ON public.gallery_media
  AS RESTRICTIVE FOR SELECT TO anon, authenticated
  USING (
    (auth.role() IN ('anon', 'authenticated') AND status = 'published')
    OR (auth.role() = 'authenticated' AND public.is_site_admin())
  );
CREATE POLICY "security_gallery_media_insert_ceiling" ON public.gallery_media
  AS RESTRICTIVE FOR INSERT TO anon, authenticated
  WITH CHECK (auth.role() = 'authenticated' AND public.is_site_admin());
CREATE POLICY "security_gallery_media_update_ceiling" ON public.gallery_media
  AS RESTRICTIVE FOR UPDATE TO anon, authenticated
  USING (auth.role() = 'authenticated' AND public.is_site_admin())
  WITH CHECK (auth.role() = 'authenticated' AND public.is_site_admin());
CREATE POLICY "security_gallery_media_delete_ceiling" ON public.gallery_media
  AS RESTRICTIVE FOR DELETE TO anon, authenticated
  USING (auth.role() = 'authenticated' AND public.is_site_admin());

GRANT SELECT (id, event_id, category_id, caption, media_kind, status, uploaded_at)
  ON TABLE public.gallery_media TO anon, authenticated;
GRANT SELECT (storage_path, thumbnail_path, file_name, mime_type, file_size)
  ON TABLE public.gallery_media TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.gallery_media TO authenticated;
GRANT SELECT, INSERT, DELETE ON TABLE public.gallery_media TO service_role;

-- Student records: the old public SELECT * query exposed personal email and
-- institution identifiers. Build a security-invoker view with a strict allowlist.
DO $block$
DECLARE
  field RECORD;
  chosen_column TEXT;
  select_list TEXT := '';
  safe_columns TEXT[] := ARRAY[]::TEXT[];
BEGIN
  IF to_regclass('public.students') IS NULL THEN
    RAISE EXCEPTION 'Required public.students table is missing; inspect schema before applying this migration.';
  END IF;

  FOR field IN
    SELECT * FROM (VALUES
      ('id', ARRAY['id','student_id','reg_no','roll_no']::TEXT[]),
      ('name', ARRAY['name','student_name','full_name','fullname']::TEXT[]),
      ('programme', ARRAY['programme','program','course']::TEXT[]),
      ('year', ARRAY['year','academic_year']::TEXT[]),
      ('batch', ARRAY['batch']::TEXT[]),
      ('achievementTitle', ARRAY['achievementTitle','achievement_title']::TEXT[]),
      ('achievement', ARRAY['achievement']::TEXT[]),
      ('description', ARRAY['description']::TEXT[]),
      ('projectsOverview', ARRAY['projectsOverview','projects_overview','projects','project']::TEXT[]),
      ('image', ARRAY['image']::TEXT[]),
      ('photoUrl', ARRAY['photoUrl','photo_url','photo','image_url']::TEXT[]),
      ('linkedin', ARRAY['linkedin','linkedin_url','linkedinUrl']::TEXT[]),
      ('github', ARRAY['github','github_url','githubUrl']::TEXT[])
    ) AS fields(output_name, candidates)
  LOOP
    SELECT c.column_name INTO chosen_column
    FROM information_schema.columns AS c
    WHERE c.table_schema = 'public'
      AND c.table_name = 'students'
      AND c.column_name = ANY(field.candidates)
    ORDER BY array_position(field.candidates, c.column_name)
    LIMIT 1;

    IF chosen_column IS NULL THEN
      IF field.output_name = 'name' THEN
        RAISE EXCEPTION 'Required public.students name column is missing; inspect schema before applying this migration.';
      END IF;
      select_list := select_list || CASE WHEN select_list = '' THEN '' ELSE ', ' END
        || format('NULL::TEXT AS %I', field.output_name);
    ELSE
      select_list := select_list || CASE WHEN select_list = '' THEN '' ELSE ', ' END
        || format('s.%I::TEXT AS %I', chosen_column, field.output_name);
      IF NOT chosen_column = ANY(safe_columns) THEN
        safe_columns := array_append(safe_columns, chosen_column);
      END IF;
    END IF;
  END LOOP;

  -- Remove table and column grants before granting only the columns used by the view.
  REVOKE ALL PRIVILEGES ON TABLE public.students FROM PUBLIC, anon, authenticated;
  FOR field IN
    SELECT a.attname AS output_name
    FROM pg_attribute AS a
    WHERE a.attrelid = 'public.students'::regclass
      AND a.attnum > 0
      AND NOT a.attisdropped
  LOOP
    EXECUTE format('REVOKE ALL (%I) ON TABLE public.students FROM PUBLIC, anon, authenticated', field.output_name);
  END LOOP;

  ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
  DROP POLICY IF EXISTS "security_public_students_read" ON public.students;
  CREATE POLICY "security_public_students_read" ON public.students
    FOR SELECT TO anon, authenticated USING (true);

  DROP POLICY IF EXISTS "Admins can manage students" ON public.students;
  CREATE POLICY "Admins can manage students" ON public.students
    FOR ALL TO authenticated
    USING (public.is_site_admin())
    WITH CHECK (public.is_site_admin());

  -- Use the public name as the detail identifier so institution IDs are never exposed.
  EXECUTE 'CREATE OR REPLACE VIEW public.public_students WITH (security_invoker = true) AS SELECT '
    || select_list || ' FROM public.students AS s';

  IF array_length(safe_columns, 1) > 0 THEN
    EXECUTE 'GRANT SELECT (' ||
      (SELECT string_agg(format('%I', column_name), ', ' ORDER BY ordinal_position)
       FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = 'students'
         AND column_name = ANY(safe_columns))
      || ') ON TABLE public.students TO anon, authenticated';
  END IF;

  GRANT INSERT, UPDATE, DELETE ON TABLE public.students TO authenticated;
END;
$block$;

REVOKE ALL PRIVILEGES ON TABLE public.public_students FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.public_students TO anon, authenticated;

-- Contact submissions become server-mediated. The browser no longer has direct
-- INSERT access, so the Edge Function can validate and rate-limit before storing.
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
REVOKE ALL PRIVILEGES ON TABLE public.contact_messages FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS "Visitors can submit valid contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Site admin can read contact messages" ON public.contact_messages;
CREATE POLICY "Site admin can read contact messages" ON public.contact_messages
  FOR SELECT TO authenticated USING (public.is_site_admin());
DROP POLICY IF EXISTS "security_contact_messages_read_ceiling" ON public.contact_messages;
CREATE POLICY "security_contact_messages_read_ceiling" ON public.contact_messages
  AS RESTRICTIVE FOR SELECT TO anon, authenticated
  USING (auth.role() = 'authenticated' AND public.is_site_admin());
GRANT SELECT ON TABLE public.contact_messages TO authenticated;
GRANT INSERT ON TABLE public.contact_messages TO service_role;

CREATE TABLE IF NOT EXISTS public.contact_rate_limits (
  bucket_key TEXT PRIMARY KEY CHECK (bucket_key ~ '^[a-f0-9]{64}$'),
  window_started_at TIMESTAMPTZ NOT NULL,
  request_count INTEGER NOT NULL CHECK (request_count > 0)
);
CREATE INDEX IF NOT EXISTS idx_contact_rate_limits_window
  ON public.contact_rate_limits(window_started_at);
ALTER TABLE public.contact_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL PRIVILEGES ON TABLE public.contact_rate_limits FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.consume_contact_rate_limit(
  p_bucket_key TEXT,
  p_limit INTEGER,
  p_window_seconds INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  observed_count INTEGER;
  now_at TIMESTAMPTZ := pg_catalog.clock_timestamp();
BEGIN
  IF p_bucket_key !~ '^[a-f0-9]{64}$'
    OR p_limit < 1 OR p_limit > 50
    OR p_window_seconds < 60 OR p_window_seconds > 86400 THEN
    RETURN FALSE;
  END IF;

  DELETE FROM public.contact_rate_limits
    WHERE window_started_at < now_at - pg_catalog.make_interval(secs => p_window_seconds * 2);

  INSERT INTO public.contact_rate_limits AS current_limit (bucket_key, window_started_at, request_count)
  VALUES (p_bucket_key, now_at, 1)
  ON CONFLICT (bucket_key) DO UPDATE SET
    window_started_at = CASE
      WHEN current_limit.window_started_at <= now_at - pg_catalog.make_interval(secs => p_window_seconds)
        THEN now_at
      ELSE current_limit.window_started_at
    END,
    request_count = CASE
      WHEN current_limit.window_started_at <= now_at - pg_catalog.make_interval(secs => p_window_seconds)
        THEN 1
      ELSE current_limit.request_count + 1
    END
  RETURNING request_count INTO observed_count;

  RETURN observed_count <= p_limit;
END;
$function$;

REVOKE ALL ON FUNCTION public.consume_contact_rate_limit(TEXT, INTEGER, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_contact_rate_limit(TEXT, INTEGER, INTEGER) TO service_role;

-- No browser client may read files directly from the private gallery bucket or
-- write any Storage object. The authenticated Edge Function uses service_role,
-- which bypasses RLS; public event posters remain publicly readable.
DROP POLICY IF EXISTS "security_gallery_objects_read_ceiling" ON storage.objects;
DROP POLICY IF EXISTS "security_no_client_storage_insert" ON storage.objects;
DROP POLICY IF EXISTS "security_no_client_storage_update" ON storage.objects;
DROP POLICY IF EXISTS "security_no_client_storage_delete" ON storage.objects;
CREATE POLICY "security_gallery_objects_read_ceiling" ON storage.objects
  AS RESTRICTIVE FOR SELECT TO anon, authenticated
  USING (bucket_id <> 'gallery');
CREATE POLICY "security_no_client_storage_insert" ON storage.objects
  AS RESTRICTIVE FOR INSERT TO anon, authenticated
  WITH CHECK (false);
CREATE POLICY "security_no_client_storage_update" ON storage.objects
  AS RESTRICTIVE FOR UPDATE TO anon, authenticated
  USING (false) WITH CHECK (false);
CREATE POLICY "security_no_client_storage_delete" ON storage.objects
  AS RESTRICTIVE FOR DELETE TO anon, authenticated
  USING (false);

COMMIT;

