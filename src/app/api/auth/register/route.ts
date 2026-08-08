import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Hash the password (simple SHA-256 for basic security)
    const hash = crypto.createHash('sha256').update(password).digest('hex')

    // Insert user
    const { data: user, error } = await supabase
      .from('users')
      .insert([
        { name, email: email.toLowerCase(), password_hash: hash }
      ])
      .select('id, name, email')
      .single()

    if (error) {
      if (error.code === '23505') { // unique violation
        return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const response = NextResponse.json({ success: true, user })
    
    // Set a simple auth cookie
    response.cookies.set('glossnails_user_id', user.id, {
      httpOnly: false, // allowing client access for simplicity
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })

    return response
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
