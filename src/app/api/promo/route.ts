import { NextRequest, NextResponse } from 'next/server'
import { queryOne } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json({ error: 'Missing code' }, { status: 400 })
    }

    const promo = await queryOne<{ code: string; discount_percent: number; is_active: boolean }>(
      `SELECT code, discount_percent, is_active FROM promo_codes
       WHERE code = $1 AND is_active = true
       LIMIT 1`,
      [code.toUpperCase()]
    )

    if (!promo) {
      return NextResponse.json({ error: 'Invalid or expired promo code' }, { status: 404 })
    }

    return NextResponse.json(promo)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
