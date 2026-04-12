import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const supabase = createClient()

  let query = supabase.from('jobs').select('*, profiles(full_name, company_name)').eq('is_active', true).order('created_at', { ascending: false })

  const q = searchParams.get('q')
  const location = searchParams.get('location')
  const type = searchParams.get('type')
  const level = searchParams.get('level')

  if (q) query = query.ilike('title', `%${q}%`)
  if (location) query = query.ilike('location', `%${location}%`)
  if (type) query = query.eq('type', type)
  if (level) query = query.eq('level', level)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ jobs: data })
}
