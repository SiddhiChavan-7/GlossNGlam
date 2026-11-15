import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { queryOne } from '@/lib/db'

export async function GET() {
  try {
    const cookieStore = cookies()
    const userId = cookieStore.get('glossnails_user_id')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await queryOne<{ saved_sizes: any }>(
      `SELECT saved_sizes FROM users WHERE id = $1`,
      [userId]
    )

    return NextResponse.json({ saved_sizes: user?.saved_sizes || null })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies()
    const userId = cookieStore.get('glossnails_user_id')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Please log in to save your sizing' }, { status: 401 })
    }

    const body = await req.json()
    const { preset, preferred_shape, preferred_length, thumb, index, middle, ring, pinky, notes } = body

    const sizingProfile = {
      preset: preset || 'Custom',
      preferred_shape: preferred_shape || 'almond',
      preferred_length: preferred_length || 'medium',
      thumb: Number(thumb) || null,
      index: Number(index) || null,
      middle: Number(middle) || null,
      ring: Number(ring) || null,
      pinky: Number(pinky) || null,
      notes: notes ? String(notes).slice(0, 300) : ''
    }

    const updated = await queryOne<{ saved_sizes: any }>(
      `UPDATE users 
       SET saved_sizes = $1::jsonb 
       WHERE id = $2 
       RETURNING saved_sizes`,
      [JSON.stringify(sizingProfile), userId]
    )

    return NextResponse.json({ success: true, saved_sizes: updated?.saved_sizes })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

