import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

function getRazorpayInstance() {
  const key_id = process.env.RAZORPAY_KEY_ID
  const key_secret = process.env.RAZORPAY_KEY_SECRET

  if (!key_id || !key_secret) {
    const error: any = new Error('Razorpay API keys are missing in environment variables')
    error.statusCode = 401
    throw error
  }

  return {
    razorpay: new Razorpay({ key_id, key_secret }),
    key_id
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    let { amount, currency = 'INR', receipt, in_paise } = body

    if (amount === undefined || amount === null || typeof amount !== 'number' || isNaN(amount)) {
      return NextResponse.json({ error: 'Valid numeric amount is required' }, { status: 400 })
    }

    // In Razorpay standard API, amount can be in paise. If amount is fractional or e-commerce rupees without in_paise:
    const amountInPaise = in_paise ? Math.round(amount) : (Number.isInteger(amount) && amount >= 100 ? amount : Math.round(amount * 100))

    if (amountInPaise < 100) {
      return NextResponse.json(
        { error: 'Amount must be at least 100 paise (₹1)' },
        { status: 400 }
      )
    }

    const { razorpay, key_id } = getRazorpayInstance()
    const orderReceipt = receipt || `rcpt_${Date.now()}`

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: currency.toUpperCase(),
      receipt: orderReceipt
    })

    return NextResponse.json({
      success: true,
      order_id: order.id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || key_id,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || key_id
    })
  } catch (error: any) {
    console.error('Razorpay create-order error:', error)
    const status = error.statusCode || (error.error?.code === 'BAD_REQUEST_ERROR' && error.statusCode === 401 ? 401 : 500)
    return NextResponse.json(
      { error: error?.message || error?.error?.description || 'Failed to create Razorpay order' },
      { status: status === 401 ? 401 : 500 }
    )
  }
}

