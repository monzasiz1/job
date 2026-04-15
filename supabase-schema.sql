-- ============================================================
-- Talento — Supabase SQL Schema
-- Ausführen in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- OPTIONAL: Alte Tabellen löschen (wenn Sie ein Clean Slate brauchen):
-- DROP TABLE IF EXISTS public.messages CASCADE;
-- DROP TABLE IF EXISTS public.conversations CASCADE;
-- DROP TABLE IF EXISTS public.job_interests CASCADE;
-- DROP TABLE IF EXISTS public.applications CASCADE;
-- DROP TABLE IF EXISTS public.jobs CASCADE;
-- DROP TABLE IF EXISTS public.resumes CASCADE;
-- DROP TABLE IF EXISTS public.job_matches CASCADE;
-- DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. PROFILES (erweitert die Supabase auth.users Tabelle)
CREATE TABLE IF NOT EXISTS public.profiles (
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
CREATE TABLE IF NOT EXISTS public.jobs (
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
CREATE TABLE IF NOT EXISTS public.applications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id       UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message      TEXT,
  status       TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'interview', 'rejected', 'accepted')),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (job_id, applicant_id)
);

-- 4. CONVERSATIONS (Chat-Konversationen zwischen Arbeitgeber & Bewerber)
CREATE TABLE IF NOT EXISTS public.conversations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  applicant_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_id        UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  last_message  TEXT,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (employer_id, applicant_id, job_id)
);

-- 5. MESSAGES (Chat-Nachrichtenverlauf)
CREATE TABLE IF NOT EXISTS public.messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content         TEXT NOT NULL,
  is_read         BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 6. JOB_INTERESTS (Swipe-Interesse von Bewerbern)
CREATE TABLE IF NOT EXISTS public.job_interests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id        UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  applicant_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action        TEXT NOT NULL CHECK (action IN ('like', 'maybe', 'nope')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (job_id, applicant_id)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) — WICHTIG!
-- ============================================================

ALTER TABLE public.profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_interests ENABLE ROW LEVEL SECURITY;

-- Lösche alte Policies, bevor neue erstellt werden
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
DROP POLICY IF EXISTS "jobs_select" ON public.jobs;
DROP POLICY IF EXISTS "jobs_insert" ON public.jobs;
DROP POLICY IF EXISTS "jobs_update" ON public.jobs;
DROP POLICY IF EXISTS "jobs_delete" ON public.jobs;
DROP POLICY IF EXISTS "applications_select" ON public.applications;
DROP POLICY IF EXISTS "applications_insert" ON public.applications;
DROP POLICY IF EXISTS "applications_update" ON public.applications;
DROP POLICY IF EXISTS "conversations_select" ON public.conversations;
DROP POLICY IF EXISTS "conversations_insert" ON public.conversations;
DROP POLICY IF EXISTS "conversations_update" ON public.conversations;
DROP POLICY IF EXISTS "messages_select" ON public.messages;
DROP POLICY IF EXISTS "messages_insert" ON public.messages;
DROP POLICY IF EXISTS "job_interests_select" ON public.job_interests;
DROP POLICY IF EXISTS "job_interests_insert" ON public.job_interests;
DROP POLICY IF EXISTS "job_interests_update" ON public.job_interests;
DROP POLICY IF EXISTS "resumes_all" ON public.resumes;
DROP POLICY IF EXISTS "job_matches_all" ON public.job_matches;

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

-- CONVERSATIONS: Beide Parteien können ihre Konversationen sehen
CREATE POLICY "conversations_select" ON public.conversations FOR SELECT
  USING (auth.uid() = employer_id OR auth.uid() = applicant_id);
CREATE POLICY "conversations_insert" ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() = employer_id OR auth.uid() = applicant_id);
CREATE POLICY "conversations_update" ON public.conversations FOR UPDATE
  USING (auth.uid() = employer_id OR auth.uid() = applicant_id);

-- MESSAGES: Beide Parteien können Nachrichten in ihrer Konversation sehen/schreiben
CREATE POLICY "messages_select" ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND (conversations.employer_id = auth.uid() OR conversations.applicant_id = auth.uid())
    )
  );
CREATE POLICY "messages_insert" ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = conversation_id 
      AND (conversations.employer_id = auth.uid() OR conversations.applicant_id = auth.uid())
    )
  );

-- JOB_INTERESTS: Bewerber sehen/erstellen eigene, Arbeitgeber sehen ihre Job-Interessenten
CREATE POLICY "job_interests_select" ON public.job_interests FOR SELECT
  USING (auth.uid() = applicant_id OR auth.uid() = (SELECT employer_id FROM jobs WHERE id = job_id));
CREATE POLICY "job_interests_insert" ON public.job_interests FOR INSERT
  WITH CHECK (auth.uid() = applicant_id);
CREATE POLICY "job_interests_update" ON public.job_interests FOR UPDATE
  USING (auth.uid() = applicant_id);

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
*/

-- Optional: Zusätzliche Tabellen für KI-Features
CREATE TABLE IF NOT EXISTS public.resumes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_url     TEXT DEFAULT '',
  extracted_text TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.job_matches (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_description TEXT NOT NULL,
  match_score     INTEGER,
  analysis        TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "resumes_all" ON public.resumes FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "job_matches_all" ON public.job_matches FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
