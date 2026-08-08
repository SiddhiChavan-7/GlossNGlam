import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { is_active } = await req.json()
    const id = params.id

    if (is_active === undefined) {
      return NextResponse.json({ error: 'Missing is_active status' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('promo_codes')
      .update({ is_active })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, promo: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const { error } = await supabaseAdmin
      .from('promo_codes')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
