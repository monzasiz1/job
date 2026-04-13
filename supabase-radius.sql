-- ============================================================
-- Schritt 1: Koordinaten-Spalten zur jobs Tabelle hinzufügen
-- ============================================================
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION;

-- ============================================================
-- Schritt 2: PostGIS Extension aktivieren (für Umkreissuche)
-- ============================================================
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================================
-- Schritt 3: Funktion für Umkreissuche in km
-- ============================================================
CREATE OR REPLACE FUNCTION jobs_within_radius(
  center_lat DOUBLE PRECISION,
  center_lng DOUBLE PRECISION,
  radius_km  DOUBLE PRECISION
)
RETURNS SETOF jobs
LANGUAGE sql
STABLE
AS $$
  SELECT *
  FROM jobs
  WHERE is_active = true
    AND lat IS NOT NULL
    AND lng IS NOT NULL
    AND (
      6371 * acos(
        cos(radians(center_lat))
        * cos(radians(lat))
        * cos(radians(lng) - radians(center_lng))
        + sin(radians(center_lat))
        * sin(radians(lat))
      )
    ) <= radius_km
  ORDER BY created_at DESC;
$$;
