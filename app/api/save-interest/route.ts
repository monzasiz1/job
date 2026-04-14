import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = createClient()
 const { data: { user } } = await supabase.auth.getUser() 

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { jobId, action } = await req.json()

  if (!jobId || !['like', 'maybe', 'nope'].includes(action)) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('job_interests')
      .upsert(
        {
          job_id: jobId,
          applicant_id: user.id,
          action: action,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'job_id,applicant_id' }
      )
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Error saving interest:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
