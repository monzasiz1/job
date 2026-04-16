export type UserRole = 'jobseeker' | 'employer'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  company_name?: string
  created_at: string
}

export interface Job {
  id: string
  employer_id: string
  title: string
  company: string
  location: string
  type: 'Remote' | 'Hybrid' | 'Vor Ort'
  contract: 'Vollzeit' | 'Teilzeit' | 'Freelance' | 'Praktikum'
  level: 'Junior' | 'Mid' | 'Senior'
  salary_min: number
  salary_max: number
  description: string
  field: string
  is_active: boolean
  lat?: number | null
  lng?: number | null
  created_at: string
  profiles?: Profile
}

export const OFFERING_CATEGORIES = [
  'Handwerk', 'Garten & Haushalt', 'Nachhilfe', 'IT & Technik',
  'Transport', 'Pflege & Betreuung', 'Kreativ & Design',
  'Fitness & Sport', 'Musik & Kunst', 'Kochen & Catering',
  'Reinigung', 'Reparatur', 'Sonstiges',
] as const

export type OfferingCategory = (typeof OFFERING_CATEGORIES)[number]

export interface SkillOffering {
  id: string
  user_id: string
  title: string
  description?: string | null
  category: string
  price_info?: string | null
  location_name: string
  lat: number
  lng: number
  radius_km: number
  is_active: boolean
  created_at: string
  updated_at: string
  // Joined fields from RPC
  distance_km?: number
  user_name?: string
  user_avatar?: string | null
}

// ─── Gesuche / Requests ───
export const REQUEST_URGENCY = ['sofort', 'diese_woche', 'flexibel'] as const
export type RequestUrgency = (typeof REQUEST_URGENCY)[number]

export const URGENCY_META: Record<RequestUrgency, { label: string; emoji: string; color: string }> = {
  sofort:       { label: 'Sofort', emoji: '🔴', color: '#f06090' },
  diese_woche:  { label: 'Diese Woche', emoji: '🟡', color: '#d4a843' },
  flexibel:     { label: 'Flexibel', emoji: '🟢', color: '#3dba7e' },
}

export interface SkillRequest {
  id: string
  user_id: string
  title: string
  description?: string | null
  category: string
  budget?: string | null
  urgency: RequestUrgency
  location_name: string
  lat: number
  lng: number
  radius_km: number
  is_active: boolean
  created_at: string
  updated_at: string
  // Joined fields
  distance_km?: number
  user_name?: string
  user_avatar?: string | null
}
