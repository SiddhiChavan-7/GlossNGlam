import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const hash = crypto.createHash('sha256').update(password).digest('hex')

    // Fetch user
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, password_hash, has_claimed_giveaway')
      .eq('email', email.toLowerCase())

    if (error || !users || users.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const user = users[0]

    if (user.password_hash !== hash) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const { password_hash, ...safeUser } = user

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
