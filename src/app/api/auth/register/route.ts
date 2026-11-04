import { NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'
import crypto from 'crypto'
import { sendUserActivityNotificationToAdmin } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const hash = crypto.createHash('sha256').update(password).digest('hex')

    // Check if email already exists
    const existing = await queryOne<{ id: string }>(
      `SELECT id FROM users WHERE email = $1`,
      [email.toLowerCase()]
    )
    if (existing) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    const user = await queryOne<{ id: string; name: string; email: string }>(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [name, email.toLowerCase(), hash]
    )

    if (!user) {
      return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
    }

    // Send email alert to glossnglam8@gmail.com
    sendUserActivityNotificationToAdmin({
      type: 'registration',
      name: user.name,
      email: user.email,
    }).catch(err => {
      console.error('Registration email notification error:', err)
    })

    const response = NextResponse.json({ success: true, user })
    response.cookies.set('glossnails_user_id', user.id, {
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })

    return response
  } catch (err: any) {
    // pg unique violation code
    if (err.code === '23505') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
