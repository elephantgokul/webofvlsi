-- Gallery policies and managed media setup. The initial_schema migration must
-- run first. This migration intentionally does not create application tables.
-- Existing Storage objects are retained; their visibility transition is covered
-- in supabase/SCHEMA_REQUIREMENTS.md and must be reviewed before deployment.

BEGIN;

DO $preflight$
DECLARE
  missing_tables TEXT;
  missing_columns TEXT;
BEGIN
  SELECT string_agg(required.table_name, ', ' ORDER BY required.table_name)
    INTO missing_tables
  FROM (VALUES
    ('events'),
    ('gallery_categories'),
    ('gallery_media'),
    ('contact_messages')
  ) AS required(table_name)
  WHERE to_regclass('public.' || required.table_name) IS NULL;

  IF missing_tables IS NOT NULL THEN
    RAISE EXCEPTION 'Initial schema is incomplete; missing public tables: %', missing_tables;
  END IF;

  IF to_regclass('storage.buckets') IS NULL OR to_regclass('storage.objects') IS NULL THEN
    RAISE EXCEPTION 'Supabase Storage schema is unavailable; enable Storage before applying the Gallery migration.';
  END IF;

  SELECT string_agg(format('%I.%I', required.table_name, required.column_name), ', ' ORDER BY required.table_name, required.column_name)
    INTO missing_columns
  FROM (VALUES
    ('events', 'id'), ('events', 'status'),
    ('gallery_categories', 'id'), ('gallery_categories', 'name'), ('gallery_categories', 'slug'), ('gallery_categories', 'is_active'),
    ('gallery_media', 'id'), ('gallery_media', 'event_id'), ('gallery_media', 'category_id'),
    ('gallery_media', 'caption'), ('gallery_media', 'media_kind'), ('gallery_media', 'storage_path'),
    ('gallery_media', 'thumbnail_path'), ('gallery_media', 'file_name'), ('gallery_media', 'mime_type'),
    ('gallery_media', 'file_size'), ('gallery_media', 'status'), ('gallery_media', 'uploaded_at'),
    ('contact_messages', 'name'), ('contact_messages', 'email'), ('contact_messages', 'subject'),
    ('contact_messages', 'message'), ('contact_messages', 'page_url'), ('contact_messages', 'created_at')
  ) AS required(table_name, column_name)
  WHERE NOT EXISTS (
    SELECT 1
    FROM information_schema.columns AS actual
    WHERE actual.table_schema = 'public'
      AND actual.table_name = required.table_name
      AND actual.column_name = required.column_name
  );

  IF missing_columns IS NOT NULL THEN
    RAISE EXCEPTION 'Initial schema has an incompatible shape; missing columns: %', missing_columns;
  END IF;
END;
$preflight$;

CREATE OR REPLACE FUNCTION public.is_site_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT lower(COALESCE(auth.jwt() ->> 'email', '')) = 'hodvlsi@siet.ac.in'
    AND COALESCE(auth.jwt() -> 'app_metadata' ->> 'site_admin', 'false') = 'true';
$$;
REVOKE ALL ON FUNCTION public.is_site_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_site_admin() TO anon, authenticated;

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
GRANT SELECT ON public.events TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.events TO authenticated;

INSERT INTO public.gallery_categories (name, slug) VALUES
  ('Laboratories','labs'),('Events','events'),('Cultural','cultural'),
  ('Workshops','workshops'),('Seminars','seminars'),('Campus','campus'),
  ('Achievements','achievements'),('Other','other')
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_media ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read active gallery categories" ON public.gallery_categories;
DROP POLICY IF EXISTS "Site admin can read gallery categories" ON public.gallery_categories;
DROP POLICY IF EXISTS "Site admin can insert gallery categories" ON public.gallery_categories;
DROP POLICY IF EXISTS "Site admin can update gallery categories" ON public.gallery_categories;
DROP POLICY IF EXISTS "Site admin can delete gallery categories" ON public.gallery_categories;
DROP POLICY IF EXISTS "Public can read published gallery media" ON public.gallery_media;
DROP POLICY IF EXISTS "Site admin can read all gallery media" ON public.gallery_media;
DROP POLICY IF EXISTS "Site admin can insert gallery media" ON public.gallery_media;
DROP POLICY IF EXISTS "Site admin can update gallery media" ON public.gallery_media;
DROP POLICY IF EXISTS "Site admin can delete gallery media" ON public.gallery_media;
CREATE POLICY "Public can read active gallery categories" ON public.gallery_categories
  FOR SELECT TO anon, authenticated USING (is_active OR public.is_site_admin());
CREATE POLICY "Site admin can insert gallery categories" ON public.gallery_categories
  FOR INSERT TO authenticated WITH CHECK (public.is_site_admin());
CREATE POLICY "Site admin can update gallery categories" ON public.gallery_categories
  FOR UPDATE TO authenticated USING (public.is_site_admin()) WITH CHECK (public.is_site_admin());
CREATE POLICY "Site admin can delete gallery categories" ON public.gallery_categories
  FOR DELETE TO authenticated USING (public.is_site_admin());
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
GRANT SELECT ON public.gallery_categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.gallery_categories TO authenticated;
REVOKE ALL ON public.gallery_media FROM anon, authenticated;
GRANT SELECT (id,event_id,category_id,caption,media_kind,status,uploaded_at)
  ON public.gallery_media TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_media TO authenticated;

-- Preserve objects already visible from the former public `gallery` bucket.
-- Their existing visibility is treated as published; review them after migration.
INSERT INTO public.gallery_media
  (category_id, caption, media_kind, storage_path, file_name, mime_type, file_size, status, uploaded_at)
SELECT
  c.id,
  trim(regexp_replace(regexp_replace(split_part(o.name, '/', -1), '\.[^.]+$', ''), '[-_.]+', ' ', 'g')),
  CASE WHEN COALESCE(o.metadata ->> 'mimetype','') LIKE 'video/%' THEN 'video' ELSE 'image' END,
  o.name,
  left(split_part(o.name, '/', -1), 160),
  CASE
    WHEN o.metadata ->> 'mimetype' IN ('image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm') THEN o.metadata ->> 'mimetype'
    WHEN o.name ~* '\.(jpe?g)$' THEN 'image/jpeg'
    WHEN o.name ~* '\.png$' THEN 'image/png'
    WHEN o.name ~* '\.webp$' THEN 'image/webp'
    WHEN o.name ~* '\.gif$' THEN 'image/gif'
    WHEN o.name ~* '\.mp4$' THEN 'video/mp4'
    WHEN o.name ~* '\.webm$' THEN 'video/webm'
  END,
  CASE WHEN COALESCE(o.metadata ->> 'size','') ~ '^[0-9]+$' THEN (o.metadata ->> 'size')::bigint ELSE 1 END,
  'published',
  COALESCE(o.created_at, now())
FROM storage.objects o
JOIN public.gallery_categories c ON c.slug = CASE
  WHEN lower(o.name) LIKE '%lab%' THEN 'labs'
  WHEN lower(o.name) LIKE '%workshop%' OR lower(o.name) LIKE '%fdp%' THEN 'workshops'
  WHEN lower(o.name) LIKE '%seminar%' OR lower(o.name) LIKE '%talk%' OR lower(o.name) LIKE '%lecture%' THEN 'seminars'
  WHEN lower(o.name) LIKE '%campus%' OR lower(o.name) LIKE '%building%' THEN 'campus'
  WHEN lower(o.name) LIKE '%cultural%' OR lower(o.name) LIKE '%sports%' THEN 'cultural'
  WHEN lower(o.name) LIKE '%award%' OR lower(o.name) LIKE '%achieve%' OR lower(o.name) LIKE '%prize%' THEN 'achievements'
  ELSE 'events' END
WHERE o.bucket_id = 'gallery'
  AND (o.name ~* '\.(jpe?g|png|webp|gif|mp4|webm)$')
ON CONFLICT (storage_path) DO NOTHING;

-- The gallery bucket is private. A server-side function signs only published rows.
INSERT INTO storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
VALUES ('gallery','gallery',false,20971520,
  ARRAY['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm'])
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

INSERT INTO storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
VALUES ('events','events',true,5242880,ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;
DROP POLICY IF EXISTS "Admins can upload event posters" ON storage.objects;

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Visitors can submit valid contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Site admin can read contact messages" ON public.contact_messages;
CREATE POLICY "Visitors can submit valid contact messages" ON public.contact_messages
  FOR INSERT TO anon, authenticated WITH CHECK (
    char_length(trim(name)) BETWEEN 2 AND 120
    AND char_length(trim(email)) BETWEEN 6 AND 254
    AND position('@' IN email) > 1 AND email !~ '\s'
    AND char_length(trim(subject)) BETWEEN 4 AND 200
    AND char_length(trim(message)) BETWEEN 20 AND 10000
    AND (page_url IS NULL OR char_length(page_url) <= 1000)
  );
CREATE POLICY "Site admin can read contact messages" ON public.contact_messages
  FOR SELECT TO authenticated USING (public.is_site_admin());
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT ON public.contact_messages TO authenticated;

COMMIT;
