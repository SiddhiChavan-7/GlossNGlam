import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import crypto from 'crypto'
import { sendUserActivityNotificationToAdmin } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const hash = crypto.createHash('sha256').update(password).digest('hex')

    const users = await query<{ id: string; name: string; email: string; password_hash: string; has_claimed_giveaway: boolean }>(
      `SELECT id, name, email, password_hash, has_claimed_giveaway
       FROM users WHERE email = $1 LIMIT 1`,
      [email.toLowerCase()]
    )

    if (!users || users.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const user = users[0]

    if (user.password_hash !== hash) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const { password_hash, ...safeUser } = user

    // Send login notification to glossnglam8@gmail.com
    sendUserActivityNotificationToAdmin({
      type: 'login',
      name: safeUser.name,
      email: safeUser.email,
    }).catch(err => {
      console.error('Login email notification error:', err)
    })

    const response = NextResponse.json({ success: true, user: safeUser })
    response.cookies.set('glossnails_user_id', user.id, {
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })

    return response
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
