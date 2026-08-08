import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      form,
      items,
      finalTotal,
      userId,
      deliveryOption
    } = body

    // 1. Verify Signature
    const secret = process.env.RAZORPAY_KEY_SECRET!
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex')

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // 2. Insert Order
    const { data: order, error: orderError } = await supabaseAdmin.from('orders').insert({
      ...form,
      order_note: `${form.order_note}\n[Delivery: ${deliveryOption === 'local' ? 'Local Pickup / Delivery' : 'Regular Delivery'}]`.trim(),
      user_id: userId || null,
      total_amount: finalTotal,
      payment_status: 'paid',
      payment_id: razorpay_payment_id,
    }).select().single()

    if (orderError) throw orderError

    // 3. Insert Order Items
    const { error: itemsError } = await supabaseAdmin.from('order_items').insert(
      items.map((item: any) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        nail_shape: item.nail_shape,
        nail_size: item.nail_size,
      }))
    )

    if (itemsError) throw itemsError

    return NextResponse.json({ success: true, orderId: order.id })

  } catch (error: any) {
    console.error('Payment Verification Error:', error)
    return NextResponse.json({ error: 'Failed to process order' }, { status: 500 })
  }
}
