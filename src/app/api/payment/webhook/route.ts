import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { query } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET!

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex')

    if (expectedSignature !== signature) {
      console.error('Invalid webhook signature.')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(rawBody)

    if (event.event === 'payment.captured' || event.event === 'payment.authorized') {
      const paymentEntity = event.payload.payment.entity
      const razorpayPaymentId = paymentEntity.id

      if (razorpayPaymentId) {
        await query(
          `UPDATE orders SET payment_status = 'paid' WHERE payment_id = $1`,
          [razorpayPaymentId]
        )
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
