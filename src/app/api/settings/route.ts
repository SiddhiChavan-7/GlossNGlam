import { NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'

export async function GET() {
  try {
    const settings = await query(`SELECT key, value FROM store_settings`)
    return NextResponse.json({ success: true, settings })
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

    await queryOne(
      `INSERT INTO store_settings (key, value, updated_at)
       VALUES ($1, $2, now())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
      [key, JSON.stringify(value)]
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
