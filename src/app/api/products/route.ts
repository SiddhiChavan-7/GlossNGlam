import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function GET() {
  const { data, error } = await supabaseAdmin.from('products').select('*, categories(name, slug)').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  
  if (body.new_category_name) {
    const slug = body.new_category_name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const { data: cat } = await supabaseAdmin.from('categories').insert({ name: body.new_category_name, slug }).select().single()
    if (cat) body.category_id = cat.id
  }
  delete body.new_category_name

  const { data, error } = await supabaseAdmin.from('products').insert(body).select().single()
  if (error) return NextResponse.json({ error }, { status: 500 })
  
  revalidatePath('/')
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
  const { id, ...body } = await req.json()

  if (body.new_category_name) {
    const slug = body.new_category_name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const { data: cat } = await supabaseAdmin.from('categories').insert({ name: body.new_category_name, slug }).select().single()
    if (cat) body.category_id = cat.id
  }
  delete body.new_category_name

  const { data, error } = await supabaseAdmin.from('products').update(body).eq('id', id).select().single()
  if (error) return NextResponse.json({ error }, { status: 500 })
  
  revalidatePath('/')
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  const { error } = await supabaseAdmin.from('products').delete().eq('id', id)
  if (error) return NextResponse.json({ error }, { status: 500 })
  
  revalidatePath('/')
  return NextResponse.json({ success: true })
}
