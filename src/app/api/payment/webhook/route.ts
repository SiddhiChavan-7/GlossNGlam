import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Usually, you should generate a specific webhook secret in Razorpay dashboard,
    // but in development, if you haven't set one, it might use the key secret or a specific webhook secret.
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET!;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error("Invalid webhook signature.");
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    // Handle payment.captured
    if (event.event === 'payment.captured' || event.event === 'payment.authorized') {
      const paymentEntity = event.payload.payment.entity;
      const razorpayPaymentId = paymentEntity.id;
      
      if (razorpayPaymentId) {
        // Find existing order by payment_id and ensure it is marked as paid
        await supabaseAdmin
          .from('orders')
          .update({ payment_status: 'paid' })
          .eq('payment_id', razorpayPaymentId);
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
