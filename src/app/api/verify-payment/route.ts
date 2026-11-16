import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const order_id = body.razorpay_order_id || body.order_id
    const payment_id = body.razorpay_payment_id || body.payment_id
    const signature = body.razorpay_signature || body.signature

    if (!order_id || !payment_id || !signature) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required'
      }, { status: 400 })
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || 'BP3bLromOPndqA0sfRm3uzNR'
    if (!secret) {
      return NextResponse.json({
        success: false,
        error: 'Razorpay secret key is not configured'
      }, { status: 500 })
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(order_id + '|' + payment_id)
      .digest('hex')

    if (expectedSignature !== signature) {
      return NextResponse.json({
        success: false,
        error: 'Signature verification failed. Invalid payment signature.'
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      verified: true,
      order_id,
      payment_id,
      message: 'Payment signature verified successfully'
    })
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || 'Payment verification encountered an unexpected error'
    }, { status: 500 })
  }
}

