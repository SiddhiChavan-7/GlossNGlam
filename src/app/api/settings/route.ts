import { NextResponse } from 'next/server'
import { supabaseAdmin, supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('key, value')
    
    if (error) throw error

    return NextResponse.json({ success: true, settings: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { key, value } = await req.json()

    if (!key || !value) {
      return NextResponse.json({ error: 'Missing key or value' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('store_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
