-- ============================================================
-- JOB INTERESTS TABLE — Speichert "Interessiert"-Status
-- Ausführen in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

CREATE TABLE public.job_interests (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id       UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action       TEXT NOT NULL CHECK (action IN ('like', 'maybe', 'nope')),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (job_id, applicant_id)
);

-- RLS für job_interests
ALTER TABLE public.job_interests ENABLE ROW LEVEL SECURITY;

-- Bewerber können eigene Interessiertheit speichern
CREATE POLICY "interests_insert" ON public.job_interests FOR INSERT
  WITH CHECK (auth.uid() = applicant_id);

-- Arbeitgeber können "like" von ihren Jobs sehen, Bewerber sehen eigene
CREATE POLICY "interests_select" ON public.job_interests FOR SELECT
  USING (
    auth.uid() = applicant_id 
    OR 
    (action = 'like' AND auth.uid() = (SELECT employer_id FROM jobs WHERE id = job_id))
  );

-- Bewerber können eigene Einträge updaten
CREATE POLICY "interests_update" ON public.job_interests FOR UPDATE
  USING (auth.uid() = applicant_id);
