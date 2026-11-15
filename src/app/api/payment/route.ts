import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID
  const key_secret = process.env.RAZORPAY_KEY_SECRET
  if (!key_id || !key_secret) {
    throw new Error('Razorpay credentials are not configured')
  }
  return new Razorpay({ key_id, key_secret })
}

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json()
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 })
    }

    const razorpay = getRazorpay()
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    })
    return NextResponse.json({
      orderId: order.id,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID
    })
  } catch (error: any) {
    console.error('Razorpay order creation error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to create payment order' }, { status: 500 })
  }
}
