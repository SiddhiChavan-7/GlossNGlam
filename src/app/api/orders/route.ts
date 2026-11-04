import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'

export async function GET() {
  try {
    const orders = await query(
      `SELECT o.*,
              COALESCE(
                json_agg(oi.*) FILTER (WHERE oi.id IS NOT NULL),
                '[]'
              ) AS order_items
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       GROUP BY o.id
       ORDER BY o.created_at DESC`
    )
    return NextResponse.json(orders)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, payment_status } = await req.json()
    const order = await queryOne(
      `UPDATE orders SET payment_status = $1 WHERE id = $2 RETURNING *`,
      [payment_status, id]
    )
    return NextResponse.json(order)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
