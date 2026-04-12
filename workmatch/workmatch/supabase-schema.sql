-- ============================================================
-- WorkMatch — Supabase SQL Schema
-- Ausführen in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. PROFILES (erweitert die Supabase auth.users Tabelle)
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('jobseeker', 'employer')),
  company_name TEXT,
  bio         TEXT,
  location    TEXT,
  website     TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. JOBS
CREATE TABLE public.jobs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  company      TEXT NOT NULL,
  location     TEXT NOT NULL,
  type         TEXT NOT NULL CHECK (type IN ('Remote', 'Hybrid', 'Vor Ort')),
  contract     TEXT NOT NULL CHECK (contract IN ('Vollzeit', 'Teilzeit', 'Freelance', 'Praktikum')),
  level        TEXT NOT NULL CHECK (level IN ('Junior', 'Mid', 'Senior')),
  field        TEXT NOT NULL,
  salary_min   INTEGER NOT NULL DEFAULT 0,
  salary_max   INTEGER NOT NULL DEFAULT 0,
  description  TEXT NOT NULL,
  is_active    BOOLEAN DEFAULT TRUE,
  views        INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 3. APPLICATIONS (Bewerbungen)
CREATE TABLE public.applications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id       UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message      TEXT,
  status       TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'interview', 'rejected', 'accepted')),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (job_id, applicant_id)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) — WICHTIG!
-- ============================================================

ALTER TABLE public.profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- PROFILES: jeder kann lesen, nur eigenes Profil bearbeiten
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- JOBS: alle können aktive Jobs lesen, nur Eigentümer können schreiben
CREATE POLICY "jobs_select"    ON public.jobs FOR SELECT USING (is_active = true OR employer_id = auth.uid());
CREATE POLICY "jobs_insert"    ON public.jobs FOR INSERT WITH CHECK (auth.uid() = employer_id);
CREATE POLICY "jobs_update"    ON public.jobs FOR UPDATE USING (auth.uid() = employer_id);
CREATE POLICY "jobs_delete"    ON public.jobs FOR DELETE USING (auth.uid() = employer_id);

-- APPLICATIONS: Bewerber sehen eigene, Arbeitgeber sehen ihre Job-Bewerbungen
CREATE POLICY "applications_select" ON public.applications FOR SELECT
  USING (auth.uid() = applicant_id OR auth.uid() = (SELECT employer_id FROM jobs WHERE id = job_id));
CREATE POLICY "applications_insert" ON public.applications FOR INSERT WITH CHECK (auth.uid() = applicant_id);
CREATE POLICY "applications_update" ON public.applications FOR UPDATE
  USING (auth.uid() = (SELECT employer_id FROM jobs WHERE id = job_id));

-- ============================================================
-- TRIGGER: Profil automatisch bei neuem User anlegen
-- (Optional — die App erstellt das Profil manuell)
-- ============================================================

-- Beispiel-Daten zum Testen (nach Erstellung ausführen):
/*
INSERT INTO public.jobs (employer_id, title, company, location, type, contract, level, field, salary_min, salary_max, description, is_active)
VALUES
  ('DEINE-USER-UUID', 'Senior Frontend Developer', 'TechCorp GmbH', 'Berlin', 'Remote', 'Vollzeit', 'Senior', 'Tech & IT', 75000, 95000, 'Wir suchen einen erfahrenen Frontend-Entwickler mit Kenntnissen in React, TypeScript und modernen Web-Technologien. Du wirst Teil eines 8-köpfigen Entwicklerteams und arbeitest an unserem Kernprodukt.

Aufgaben:
- Entwicklung und Pflege unserer React-Anwendung
- Code Reviews und Mentoring von Junior-Entwicklern
- Technische Entscheidungen mitgestalten

Anforderungen:
- 5+ Jahre Erfahrung mit React
- Sehr gute TypeScript-Kenntnisse
- Erfahrung mit REST APIs und GraphQL

Benefits:
- 30 Tage Urlaub
- Home Office komplett möglich
- Budget für Weiterbildung', true);
*/
