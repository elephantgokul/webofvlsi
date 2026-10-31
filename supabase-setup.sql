-- Legacy SQL Editor bootstrap retained for compatibility and schema reference.
-- The canonical fresh-project order is now supabase/migrations/* in timestamp
-- order. Do not run this script before or alongside those migrations.
-- This file defines only the core tables below; it does not define students,
-- faculty, or hod. A complete fresh setup is blocked until their real schema
-- and public-field policies are added from an authoritative schema source.

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_status_date ON public.events(status, event_date);

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
DROP POLICY IF EXISTS "Admins can create events" ON public.events;
DROP POLICY IF EXISTS "Admins can update events" ON public.events;
DROP POLICY IF EXISTS "Admins can delete events" ON public.events;
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

CREATE TABLE IF NOT EXISTS public.gallery_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(trim(name)) BETWEEN 2 AND 80),
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.gallery_categories (name, slug) VALUES
  ('Laboratories', 'labs'),
  ('Events', 'events'),
  ('Cultural', 'cultural'),
  ('Workshops', 'workshops'),
  ('Seminars', 'seminars'),
  ('Campus', 'campus'),
  ('Achievements', 'achievements'),
  ('Other', 'other')
ON CONFLICT (slug) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.gallery_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  category_id UUID NOT NULL REFERENCES public.gallery_categories(id) ON DELETE RESTRICT,
  caption TEXT NOT NULL DEFAULT '' CHECK (char_length(caption) <= 500),
  media_kind TEXT NOT NULL CHECK (media_kind IN ('image', 'video')),
  storage_path TEXT NOT NULL UNIQUE,
  thumbnail_path TEXT,
  file_name TEXT NOT NULL CHECK (char_length(file_name) <= 160),
  mime_type TEXT NOT NULL CHECK (mime_type IN ('image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm')),
  file_size BIGINT NOT NULL CHECK (file_size > 0),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK ((media_kind = 'image' AND mime_type LIKE 'image/%') OR (media_kind = 'video' AND mime_type LIKE 'video/%'))
);

CREATE INDEX IF NOT EXISTS idx_gallery_media_public ON public.gallery_media(status, uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_media_event ON public.gallery_media(event_id, uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_media_category ON public.gallery_media(category_id, uploaded_at DESC);

ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_media ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read active gallery categories" ON public.gallery_categories;
DROP POLICY IF EXISTS "Site admin can manage gallery categories" ON public.gallery_categories;
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
GRANT SELECT (id, event_id, category_id, caption, media_kind, status, uploaded_at)
  ON public.gallery_media TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_media TO authenticated;

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(trim(name)) BETWEEN 2 AND 120),
  email TEXT NOT NULL CHECK (char_length(trim(email)) BETWEEN 6 AND 254 AND position('@' IN email) > 1),
  subject TEXT NOT NULL CHECK (char_length(trim(subject)) BETWEEN 4 AND 200),
  message TEXT NOT NULL CHECK (char_length(trim(message)) BETWEEN 20 AND 10000),
  page_url TEXT CHECK (page_url IS NULL OR char_length(page_url) <= 1000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Visitors can submit valid contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Site admin can read contact messages" ON public.contact_messages;
CREATE POLICY "Visitors can submit valid contact messages" ON public.contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(trim(name)) BETWEEN 2 AND 120
    AND char_length(trim(email)) BETWEEN 6 AND 254
    AND position('@' IN email) > 1
    AND email !~ '\s'
    AND char_length(trim(subject)) BETWEEN 4 AND 200
    AND char_length(trim(message)) BETWEEN 20 AND 10000
    AND (page_url IS NULL OR char_length(page_url) <= 1000)
  );
CREATE POLICY "Site admin can read contact messages" ON public.contact_messages
  FOR SELECT TO authenticated USING (public.is_site_admin());
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT ON public.contact_messages TO authenticated;

-- `gallery` is deliberately private. A server-side Edge Function signs links
-- only for published rows; direct browser uploads and public object URLs are not used.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('gallery', 'gallery', false, 20971520,
  ARRAY['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm'])
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Existing event posters remain publicly viewable, but uploads are mediated by
-- the authenticated gallery-media Edge Function and never use a browser secret.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('events', 'events', true, 5242880, ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Do not add anon/authenticated storage.objects write policies for these buckets.
-- Supabase service-role access is restricted to Edge Function secrets.

-- Optional historical seed events were intentionally omitted. Add real events
-- through the authorized dashboard rather than inserting placeholder records.
