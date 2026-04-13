-- ============================================================
-- PROFILE & IMAGE ERWEITERUNGEN
-- In Supabase SQL Editor ausführen
-- ============================================================

-- Profiles erweitern
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS website TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS skills TEXT[],
  ADD COLUMN IF NOT EXISTS experience_years INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS linkedin TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT;

-- Jobs erweitern mit Bild + Firmeninfo
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
  ADD COLUMN IF NOT EXISTS company_logo_url TEXT,
  ADD COLUMN IF NOT EXISTS company_description TEXT,
  ADD COLUMN IF NOT EXISTS company_website TEXT,
  ADD COLUMN IF NOT EXISTS benefits TEXT[],
  ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Storage Buckets anlegen
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('job-images', 'job-images', true)
ON CONFLICT DO NOTHING;

-- Storage Policies
CREATE POLICY "avatar_upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "avatar_public" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "job_image_upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'job-images' AND auth.role() = 'authenticated');

CREATE POLICY "job_image_public" ON storage.objects
FOR SELECT USING (bucket_id = 'job-images');
