import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const cookieStore = cookies()
    const userId = cookieStore.get('glossnails_user_id')?.value

    if (!userId) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, has_claimed_giveaway')
      .eq('id', userId)
      .single()

    if (error || !user) {
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
