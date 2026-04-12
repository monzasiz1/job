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
  created_at: string
  profiles?: Profile
}
