import { NextRequest, NextResponse } from 'next/server'
import { queryOne } from '@/lib/db'

// PUT /api/orders/fulfillment  — update fulfillment_status and/or tracking_number
export async function PUT(req: NextRequest) {
  try {
    const { id, fulfillment_status, tracking_number } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'Missing order id' }, { status: 400 })
    }

    const order = await queryOne(
      `UPDATE orders
       SET fulfillment_status = COALESCE($1, fulfillment_status),
           tracking_number    = COALESCE($2, tracking_number)
       WHERE id = $3
       RETURNING *`,
      [fulfillment_status ?? null, tracking_number ?? null, id]
    )

    return NextResponse.json(order)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
