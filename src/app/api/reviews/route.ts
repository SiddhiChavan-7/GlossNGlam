import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')

    if (productId) {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId)
      if (!isUUID) {
        return NextResponse.json([])
      }
      const reviews = await query(
        `SELECT * FROM product_reviews 
         WHERE product_id = $1 
         ORDER BY created_at DESC`,
        [productId]
      )
      return NextResponse.json(reviews)
    }

    // Default: return recent 10 reviews
    const recent = await query(
      `SELECT r.*, p.name as product_name, p.image_url as product_image
       FROM product_reviews r
       JOIN products p ON p.id = r.product_id
       ORDER BY r.created_at DESC 
       LIMIT 10`
    )
    return NextResponse.json(recent)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { product_id, customer_name, rating, comment, photo_url } = body

    if (!product_id || !customer_name || !comment) {
      return NextResponse.json({ error: 'Please provide all required fields' }, { status: 400 })
    }

    const review = await queryOne(
      `INSERT INTO product_reviews 
         (product_id, customer_name, rating, comment, photo_url, is_verified)
       VALUES ($1, $2, $3, $4, $5, true)
       RETURNING *`,
      [
        product_id,
        String(customer_name).trim(),
        Math.max(1, Math.min(5, Number(rating) || 5)),
        String(comment).trim(),
        photo_url ? String(photo_url).trim() : null
      ]
    )

    return NextResponse.json({ success: true, review })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

