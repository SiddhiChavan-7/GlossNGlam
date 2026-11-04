import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { queryOne, query } from '@/lib/db'
import { sendOrderNotificationToAdmin } from '@/lib/email'

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
    const orderNote = `${form.order_note || ''}\n[Delivery: ${deliveryOption === 'local' ? 'Local Pickup / Delivery' : 'Regular Delivery'}]`.trim()

    const order = await queryOne<{ id: string }>(
      `INSERT INTO orders
         (customer_name, phone, email, instagram, address, pincode, city, state,
          order_note, user_id, total_amount, payment_status, payment_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'paid', $12)
       RETURNING id`,
      [
        form.customer_name, form.phone, form.email, form.instagram,
        form.address, form.pincode, form.city, form.state,
        orderNote, userId || null, finalTotal, razorpay_payment_id
      ]
    )

    if (!order) throw new Error('Failed to create order')

    // 3. Insert Order Items
    for (const item of items) {
      await query(
        `INSERT INTO order_items
           (order_id, product_id, product_name, price, quantity, nail_shape, nail_size)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [order.id, item.product.id, item.product.name, item.product.price, item.quantity, item.nail_shape, item.nail_size]
      )
    }

    // 4. Send Instant Admin Notification Email to glossnglam8@gmail.com
    sendOrderNotificationToAdmin({
      orderId: order.id,
      customerName: form.customer_name,
      phone: form.phone,
      email: form.email,
      instagram: form.instagram,
      address: form.address,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      orderNote: form.order_note,
      deliveryOption,
      totalAmount: finalTotal,
      paymentId: razorpay_payment_id,
      items: items.map((i: any) => ({
        product_name: i.product?.name || 'Handcrafted Nail Set',
        nail_shape: i.nail_shape,
        nail_size: i.nail_size,
        quantity: i.quantity,
        price: i.product?.price || 0,
      })),
    }).catch(err => {
      console.error('Order notification email error:', err)
    })

    return NextResponse.json({ success: true, orderId: order.id })

  } catch (error: any) {
    console.error('Payment Verification Error:', error)
    return NextResponse.json({ error: 'Failed to process order' }, { status: 500 })
  }
}
