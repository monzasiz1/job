-- ============================================================
-- Migration: Erweiterte Job-Struktur für schönere Inserate
-- Ausführen in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Neue Spalten zur jobs-Tabelle hinzufügen
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS requirements TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS offers TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS expectations TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS company_description TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS company_website TEXT,
ADD COLUMN IF NOT EXISTS company_logo_url TEXT,
ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
ADD COLUMN IF NOT EXISTS benefits TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Kommentare für Dokumentation
COMMENT ON COLUMN public.jobs.description IS 'Deine Aufgaben - Hauptaufgabenbeschreibung';
COMMENT ON COLUMN public.jobs.requirements IS 'Dein Profil - Anforderungen und Qualifikationen';
COMMENT ON COLUMN public.jobs.offers IS 'Wir bieten dir - Leistungen und Benefits';
COMMENT ON COLUMN public.jobs.expectations IS 'Was erwartet dich? - Erwartungen und Perspektiven';
COMMENT ON COLUMN public.jobs.company_description IS 'Unternehmensbeschreibung';
COMMENT ON COLUMN public.jobs.company_website IS 'Website des Unternehmens';
COMMENT ON COLUMN public.jobs.company_logo_url IS 'URL zum Company Logo';
COMMENT ON COLUMN public.jobs.cover_image_url IS 'Cover/Hero Image für die Stellenanzeige';
COMMENT ON COLUMN public.jobs.benefits IS 'Array von Benefit-Strings (z.B. ["Kostenlos Kaffee", "Homeoffice"])';
