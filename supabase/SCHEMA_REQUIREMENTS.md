# Supabase schema and migration requirements

## Migration sequence

The CLI migration directory is the canonical source for fresh projects:

1. `20261031090000_initial_schema.sql` creates only the four core tables whose complete column definitions are present in this repository. It enables RLS and revokes client grants so the database remains closed until the next migration applies its explicit policies.
2. `20261031100000_security_gallery.sql` checks that the core tables and required columns exist, then adds the core policies, grants, bucket settings, and legacy Gallery metadata import.
3. `20261031110000_people_schema.sql` creates schema-backed `students`, `faculty`, and `hod` tables with Row-Level Security enabled, fulfilling the preflight prerequisites for hardening.
4. `20261031120000_security_hardening.sql` requires `students`, `faculty`, and `hod` first. It adds restrictive policy ceilings, creates the `public_students` security-invoker view, and restricts access to public fields.

The final migration sequence is deliberately incomplete for a fresh project. This repository does not contain enough authoritative schema information to create or safely expose `students`, `faculty`, or `hod`. Add a schema-specific migration before hardening only after obtaining the actual DDL and approved public fields. Do not add guessed columns or sample student records.

`supabase-setup.sql` is retained as a legacy SQL Editor reference. Do not apply it before or alongside the canonical migration sequence. It duplicates the core schema and still does not define the people tables.

The old Gallery migration used the 8-digit version `20261031`; its current filename has a standard 14-digit version. Before any staging rollout, inspect the target migration history. If `20261031` is already recorded, reconcile that history before applying the renamed migration; do not blindly push it as a second Gallery migration.

## Repository-defined tables and columns

| Table | Columns defined by repository SQL |
|---|---|
| `public.events` | `id`, `title`, `category`, `event_date`, `event_time`, `end_date`, `venue`, `description`, `poster_url`, `registration_url`, `registration_deadline`, `status`, `created_at`, `updated_at` |
| `public.gallery_categories` | `id`, `name`, `slug`, `is_active`, `created_at` |
| `public.gallery_media` | `id`, `event_id`, `category_id`, `caption`, `media_kind`, `storage_path`, `thumbnail_path`, `file_name`, `mime_type`, `file_size`, `status`, `uploaded_at` |
| `public.contact_messages` | `id`, `name`, `email`, `subject`, `message`, `page_url`, `created_at` |
| `public.contact_rate_limits` | `bucket_key`, `window_started_at`, `request_count` (created by the hardening migration) |

The Gallery migration uses UUID keys and references `events` and `gallery_categories`; deleting an event sets its media `event_id` to null, while deleting a category with media is restricted. No migration deletes application records.

## Schema-backed people tables

- `public.students`: created or augmented idempotently by `20261031110000_people_schema.sql` (`ALTER TABLE ... ADD COLUMN IF NOT EXISTS`). Supports `name`, `programme`, `year`, `batch`, `achievement_title`, `achievement`, `description`, `projects_overview`, `image`, `photo_url`, `linkedin`, `linkedin_url`, `github_url`.
- `public.faculty`: created or augmented idempotently with `id`, `name`, `designation`, `qualification`, `specialization`, `email`, `orcid`, `image`, `photo_url`, `created_at`.
- `public.hod`: created or augmented idempotently with `id`, `name`, `designation`, `qualification`, `message`, `contact`, `phone`, `research_interests`, `photo_url`, `created_at`.
- The hardening migration (`20261031120000_security_hardening.sql`) validates prerequisites in its preflight check (`students.name` / `students.student_name`, RLS on `faculty` and `hod`), dynamically maps known candidate fields into `public.public_students`, and enforces restrictive policy ceilings.

## Frontend database and Storage operations

- `js/api.js` reads `public_students` with an explicit public field list. It reads `faculty` and `hod` with `select('*')` in both initial load and background revalidation.
- `js/events-manager.js` reads `events` with `select('*')` and reads an event by ID. `pages/admin.html` reads all events and performs event insert, update, status update, and delete.
- `js/gallery.js` reads published `gallery_media` metadata and joined category names, then calls `gallery-media?action=sign` for temporary object URLs.
- `js/admin-gallery.js` reads active categories and events, reads Gallery metadata, and updates captions and publication status. Upload and deletion use the `gallery-media` Edge Function.
- `js/contact.js` submits through the `contact-message` Edge Function. It does not insert directly into `contact_messages`.
- `js/supabase-config.js` lists `faculty`, `students`, `gallery`, `alumni`, `achievements`, `events`, and `notices` as bucket names. Repository SQL configures only `gallery` and `events`; setup and access policies for the other five buckets are not documented.

## Policies, grants, and functions in repository SQL

- `events`: `Public can read published events`, `Site admin can read all events`, `Site admin can create events`, `Site admin can update events`, and `Site admin can delete events`. Hardening adds `security_events_read_ceiling`, `security_events_insert_ceiling`, `security_events_update_ceiling`, and `security_events_delete_ceiling` as restrictive policies.
- `gallery_categories`: `Public can read active gallery categories`, `Site admin can insert gallery categories`, `Site admin can update gallery categories`, and `Site admin can delete gallery categories`. Hardening adds `security_gallery_categories_read_ceiling`, `security_gallery_categories_insert_ceiling`, `security_gallery_categories_update_ceiling`, and `security_gallery_categories_delete_ceiling` as restrictive policies.
- `gallery_media`: `Public can read published gallery media`, `Site admin can read all gallery media`, `Site admin can insert gallery media`, `Site admin can update gallery media`, and `Site admin can delete gallery media`. Hardening adds the matching `security_gallery_media_*_ceiling` restrictive policies.
- `contact_messages`: the legacy setup/Gallery migration allows `Visitors can submit valid contact messages` and `Site admin can read contact messages`. Hardening removes visitor inserts, retains admin reads, and adds the restrictive `security_contact_messages_read_ceiling` policy.
- `students`: hardening adds `security_public_students_read`, revokes broad client grants, grants only matched allowlist columns, and exposes the `security_invoker` view `public_students`.
- `storage.objects`: hardening adds the restrictive `security_gallery_objects_read_ceiling`, `security_no_client_storage_insert`, `security_no_client_storage_update`, and `security_no_client_storage_delete` policies.
- `faculty` and `hod`: no policies or grants are defined by repository SQL. Their access cannot be certified from the repository.
- `contact_rate_limits`: no client table grants; only the service-role-executable `consume_contact_rate_limit` security-definer function can change rate-limit rows. The function fixes `search_path` and uses qualified object names.
- `storage.objects`: hardening denies anonymous/authenticated reads from the `gallery` bucket and denies their Storage writes. Other existing Storage policies are not removed. Public `events` poster reads are configured at the bucket level.
- `public.is_site_admin()` checks the signed-in email and trusted `app_metadata.site_admin`. MFA assurance (`aal2`) is not required by this function.

Explicit grants in the migrations are: `is_site_admin()` execution for `anon` and `authenticated`; event/category reads for those roles and writes for `authenticated`; limited public Gallery metadata columns with authenticated Gallery CRUD; hardened `service_role` reads needed for lookup, Gallery select/insert/delete and contact inserts; authenticated-only contact-message reads; allowlist source-column reads plus `public_students` reads; and service-role execution of `consume_contact_rate_limit`. The legacy setup also grants visitor inserts to `contact_messages`, which hardening removes. The initial migration explicitly revokes client grants until Gallery policies are installed.

The exact existing policies and grants on a deployed project are not available locally. The migrations replace known policy names and add restrictive ceilings, but they do not inventory or remove unknown custom policies.

## Gallery visibility transition

The Gallery migration does not delete or move Storage objects. It imports eligible image/video paths from the old `gallery` bucket as published metadata rows, then changes the bucket to private. Files that do not match the accepted extensions are not imported. Existing direct `/storage/v1/object/public/gallery/...` URLs stop working after the bucket becomes private.

The current Gallery page already loads metadata and requests temporary signed URLs through the Edge Function; video playback requests a fresh signature when opened. Existing imported records have no `thumbnail_path` because the import does not infer thumbnail relationships. Separate legacy thumbnail files may be imported as standalone image rows. Review object inventory, unsupported file extensions, duplicates, and thumbnail relationships in isolated staging before any rollout. Never run this import against a live dataset without that review.

The `getSupabasePublicUrl()` helper can still construct a public Gallery URL, so future code must not use it for the now-private `gallery` bucket. A repository search found no current Gallery-page use of that helper for Gallery objects; the current Gallery loader uses signed URLs.

## Compatibility and validation boundary

The 14-digit filenames establish local ordering only. No remote migration history has been inspected. The fresh baseline intentionally errors if core tables already exist; use a source-backed adoption migration for an existing database rather than applying this fresh baseline to it. The hardening migration requires the external people schema and cannot complete from this repository alone.

No PostgreSQL/Supabase parser or local database is available in this environment. Static checks can verify file order and declared prerequisites but cannot prove SQL execution, grants, RLS behavior, or Gallery media preservation. Validate the full chain and real media access only in an isolated staging project with synthetic data.
