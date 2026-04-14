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
    const employerId = searchParams.get('employer_id')
    const applicantId = searchParams.get('applicant_id')
    const jobId = searchParams.get('job_id')

    if (!employerId || !applicantId) {
      return NextResponse.json({ error: 'Missing employer_id or applicant_id' }, { status: 400 })
    }

    // Benutzer muss entweder Arbeitgeber oder Bewerber sein
    if (user.id !== employerId && user.id !== applicantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Finde existierende Konversation
    const { data: existing, error: selectError } = await supabase
      .from('conversations')
      .select('id')
      .eq('employer_id', employerId)
      .eq('applicant_id', applicantId)
      .eq('job_id', jobId)
      .maybeSingle()

    if (selectError && selectError.code !== 'PGRST116') {
      throw selectError
    }

    if (existing) {
      return NextResponse.json({ conversation_id: existing.id })
    }

    // Erstelle neue Konversation (wird das Bild überprüfen, Arbeitgeber und Bewerber NICHT RLS-BLOCKED)
    const { data: newConversation, error } = await supabase
      .from('conversations')
      .insert([{
        employer_id: employerId,
        applicant_id: applicantId,
        job_id: jobId || null,
      }])
      .select('id')
      .single()

    if (error) {
      console.error('Insert error:', error)
      throw new Error(`Database error: ${error.message}`)
    }

    return NextResponse.json({ conversation_id: newConversation.id })
  } catch (error: any) {
    console.error('Conversation API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
