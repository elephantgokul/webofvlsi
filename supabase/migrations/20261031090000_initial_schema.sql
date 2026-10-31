-- Initial schema for the database objects fully specified by this repository.
-- This is a fresh-project baseline. It deliberately does not use IF NOT EXISTS:
-- an existing table with an unknown shape must be reconciled before migration.
-- Student, faculty, and HOD schemas are not documented here and are not guessed.

BEGIN;

CREATE TABLE public.events (
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

CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_date ON public.events(event_date);
CREATE INDEX idx_events_status_date ON public.events(status, event_date);

CREATE TABLE public.gallery_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(trim(name)) BETWEEN 2 AND 80),
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.gallery_media (
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

CREATE INDEX idx_gallery_media_public ON public.gallery_media(status, uploaded_at DESC);
CREATE INDEX idx_gallery_media_event ON public.gallery_media(event_id, uploaded_at DESC);
CREATE INDEX idx_gallery_media_category ON public.gallery_media(category_id, uploaded_at DESC);

CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(trim(name)) BETWEEN 2 AND 120),
  email TEXT NOT NULL CHECK (char_length(trim(email)) BETWEEN 6 AND 254 AND position('@' IN email) > 1),
  subject TEXT NOT NULL CHECK (char_length(trim(subject)) BETWEEN 4 AND 200),
  message TEXT NOT NULL CHECK (char_length(trim(message)) BETWEEN 20 AND 10000),
  page_url TEXT CHECK (page_url IS NULL OR char_length(page_url) <= 1000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Keep the interval between baseline and policy migrations fail-closed.
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
REVOKE ALL PRIVILEGES ON TABLE public.events FROM PUBLIC, anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE public.gallery_categories FROM PUBLIC, anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE public.gallery_media FROM PUBLIC, anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE public.contact_messages FROM PUBLIC, anon, authenticated;

COMMIT;
