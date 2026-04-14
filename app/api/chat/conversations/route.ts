import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const applicantId = searchParams.get('applicant_id')
    const jobId = searchParams.get('job_id')

    if (!applicantId) {
      return NextResponse.json({ error: 'Missing applicant_id' }, { status: 400 })
    }

    // Finde oder erstelle Konversation
    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .eq('employer_id', user.id)
      .eq('applicant_id', applicantId)
      .eq('job_id', jobId || null)
      .single()

    if (existing) {
      return NextResponse.json({ conversation_id: existing.id })
    }

    // Erstelle neue Konversation
    const { data: newConversation, error } = await supabase
      .from('conversations')
      .insert([{
        employer_id: user.id,
        applicant_id: applicantId,
        job_id: jobId,
      }])
      .select('id')
      .single()

    if (error) throw error

    return NextResponse.json({ conversation_id: newConversation.id })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
