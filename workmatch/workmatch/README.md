# WorkMatch — Setup-Anleitung

## Voraussetzungen
- Node.js 18+ installiert → https://nodejs.org
- Kostenloses Konto auf https://supabase.com
- Kostenloses Konto auf https://vercel.com

---

## Schritt 1 — Supabase einrichten (10 Minuten)

1. Gehe zu https://supabase.com → „New Project"
2. Wähle einen Namen (z.B. „workmatch") und ein starkes Passwort
3. Region: „Central EU (Frankfurt)" wählen → „Create new project"
4. Warte bis das Projekt bereit ist (~1 Minute)

### Datenbank-Schema anlegen:
1. Im Supabase-Dashboard: **SQL Editor** → **New query**
2. Öffne die Datei `supabase-schema.sql` aus diesem Ordner
3. Kopiere den gesamten Inhalt in den Editor
4. Klicke auf **„RUN"**

### API-Keys holen:
1. Im Supabase-Dashboard: **Project Settings** → **API**
2. Notiere folgende Werte:
   - **Project URL** (z.B. `https://abcdef.supabase.co`)
   - **anon public** Key
   - **service_role** Key (geheim halten!)

---

## Schritt 2 — Lokale .env.local Datei befüllen

Öffne die Datei `.env.local` und ersetze die Platzhalter:

```
NEXT_PUBLIC_SUPABASE_URL=https://DEIN-PROJEKT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

---

## Schritt 3 — Lokal testen (optional)

```bash
# Im Projektordner:
npm install
npm run dev
# → Öffne http://localhost:3000
```

---

## Schritt 4 — Auf Vercel deployen (5 Minuten)

### Option A: Via GitHub (empfohlen)
1. Lade den Projektordner auf GitHub hoch
2. Gehe zu https://vercel.com → „New Project"
3. Wähle dein GitHub-Repository aus
4. Klicke auf **„Environment Variables"** und füge hinzu:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Klicke **„Deploy"** — fertig!

### Option B: Via Vercel CLI
```bash
npm install -g vercel
vercel
# Folge den Anweisungen → Environment Variables eingeben
```

---

## Supabase Auth konfigurieren

Im Supabase-Dashboard unter **Authentication → URL Configuration**:
- **Site URL**: `https://deine-app.vercel.app`
- **Redirect URLs**: `https://deine-app.vercel.app/**`

---

## Die App nutzen

### Als Arbeitgeber:
1. Registrieren → „Arbeitgeber" wählen
2. Firmenname eingeben
3. Dashboard → „Neuen Job inserieren"
4. Formular ausfüllen → „Job live schalten"

### Als Arbeitnehmer:
1. Registrieren → „Bewerber" wählen
2. Jobs entdecken und filtern
3. Job anklicken → direkt bewerben

---

## Projektstruktur

```
workmatch/
├── app/
│   ├── page.tsx          ← Startseite
│   ├── jobs/
│   │   ├── page.tsx      ← Job-Übersicht mit Suche
│   │   └── [id]/page.tsx ← Job-Detailseite
│   ├── post-job/page.tsx ← Job inserieren (Arbeitgeber)
│   ├── dashboard/page.tsx← Dashboard
│   ├── register/page.tsx ← Registrierung
│   ├── login/page.tsx    ← Login
│   └── api/jobs/route.ts ← REST API
├── components/
│   └── Navbar.tsx        ← Navigation
├── lib/
│   ├── supabase-browser.ts
│   ├── supabase-server.ts
│   └── types.ts
├── supabase-schema.sql   ← Datenbank-Setup
└── .env.local            ← API-Keys (NICHT committen!)
```

---

## Häufige Probleme

**„Column does not exist" Fehler:**
→ Schema nochmal in Supabase SQL Editor ausführen

**Login funktioniert nicht:**
→ Supabase Auth URL prüfen (Site URL muss stimmen)

**Seite zeigt „Laden..." und bleibt hängen:**
→ `.env.local` prüfen — Keys korrekt eingetragen?

---

## Nächste Schritte / Erweiterungen

- [ ] Stripe-Zahlung für Arbeitgeber einbauen
- [ ] Bewerbungs-System (Bewerber → Arbeitgeber)
- [ ] E-Mail-Benachrichtigungen (Supabase Edge Functions)
- [ ] Lebenslauf-Upload (Supabase Storage)
- [ ] KI-Matching (OpenAI API)
- [ ] Job-Alerts per E-Mail

---

Fragen? → Einfach weiterfragen!
