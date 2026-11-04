import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const categories = await query(`SELECT * FROM categories ORDER BY name ASC`)
    return NextResponse.json(categories)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
