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
    const conversationId = searchParams.get('id')

    if (!conversationId) {
      return NextResponse.json({ error: 'Missing conversation id' }, { status: 400 })
    }

    // Überprüfe, dass der Benutzer Teil dieser Konversation ist
    const { data: conversation } = await supabase
      .from('conversations')
      .select('employer_id, applicant_id')
      .eq('id', conversationId)
      .single()

    if (!conversation || (conversation.employer_id !== user.id && conversation.applicant_id !== user.id)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Lösche die Konversation (messages werden automatisch per CASCADE gelöscht)
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete conversation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
