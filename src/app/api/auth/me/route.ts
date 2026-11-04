import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { queryOne } from '@/lib/db'

export async function GET() {
  try {
    const cookieStore = cookies()
    const userId = cookieStore.get('glossnails_user_id')?.value

    if (!userId) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const user = await queryOne<{ id: string; name: string; email: string; has_claimed_giveaway: boolean }>(
      `SELECT id, name, email, has_claimed_giveaway FROM users WHERE id = $1`,
      [userId]
    )

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    return NextResponse.json({ success: true, user })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST() {
  // Logout
  const response = NextResponse.json({ success: true })
  response.cookies.delete('glossnails_user_id')
  return response
}
