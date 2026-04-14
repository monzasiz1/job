import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const conversationId = searchParams.get('conversation_id')

    if (!conversationId) {
      return NextResponse.json({ error: 'Missing conversation_id' }, { status: 400 })
    }

    const supabase = createClient()
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) throw error

    return NextResponse.json(messages)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { conversation_id, sender_id, content } = body

    if (!conversation_id || !sender_id || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createClient()

    // Speichere Nachricht
    const { data: message, error: msgError } = await supabase
      .from('messages')
      .insert([{ conversation_id, sender_id, content }])
      .select()
      .single()

    if (msgError) throw msgError

    // Aktualisiere last_message in conversations
    await supabase
      .from('conversations')
      .update({ last_message: content, last_message_at: new Date().toISOString() })
      .eq('id', conversation_id)

    return NextResponse.json(message)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
