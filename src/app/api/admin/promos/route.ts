import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, promos: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { code, discount_percent } = body

    if (!code || discount_percent === undefined) {
      return NextResponse.json({ error: 'Missing code or discount_percent' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('promo_codes')
      .insert({
        code: code.toUpperCase(),
        discount_percent: parseInt(discount_percent),
        is_active: true
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') { // Unique violation
        return NextResponse.json({ error: 'Promo code already exists' }, { status: 400 })
      }
      throw error
    }

    return NextResponse.json({ success: true, promo: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
