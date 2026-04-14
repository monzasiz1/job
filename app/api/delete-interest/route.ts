import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const interestId = searchParams.get('id')

    if (!interestId) {
      return NextResponse.json({ error: 'Missing interest id' }, { status: 400 })
    }

    // Überprüfe, dass der Benutzer Eigentümer dieses Interesses ist
    const { data: interest } = await supabase
      .from('job_interests')
      .select('applicant_id')
      .eq('id', interestId)
      .single()

    if (!interest || interest.applicant_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Lösche das Interest
    const { error } = await supabase
      .from('job_interests')
      .delete()
      .eq('id', interestId)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete interest error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
