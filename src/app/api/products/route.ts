import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function GET() {
  try {
    const products = await query(
      `SELECT p.*, 
              json_build_object('name', c.name, 'slug', c.slug) AS categories
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       ORDER BY p.created_at DESC`
    )
    return NextResponse.json(products)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.name || !String(body.name).trim()) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 })
    }

    const price = parseInt(String(body.price), 10)
    if (isNaN(price) || price < 0) {
      return NextResponse.json({ error: 'Valid price is required' }, { status: 400 })
    }

    if (body.new_category_name && String(body.new_category_name).trim()) {
      const catName = String(body.new_category_name).trim()
      const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      const cat = await queryOne<{ id: string }>(
        `INSERT INTO categories (name, slug) VALUES ($1, $2)
         ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [catName, slug]
      )
      if (cat) body.category_id = cat.id
    }
    delete body.new_category_name

    // Ensure valid category_id fallback if missing or still 'NEW'
    if (!body.category_id || body.category_id === 'NEW') {
      const defaultCat = await queryOne<{ id: string }>(`SELECT id FROM categories ORDER BY created_at ASC LIMIT 1`)
      if (defaultCat) {
        body.category_id = defaultCat.id
      } else {
        return NextResponse.json({ error: 'A category is required. Please create one.' }, { status: 400 })
      }
    }

    const product = await queryOne(
      `INSERT INTO products (name, price, description, image_url, category_id, in_stock, show_on_home, nail_shapes, gallery_urls)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        String(body.name).trim(),
        price,
        body.description || '',
        body.image_url || '',
        body.category_id,
        body.in_stock ?? true,
        body.show_on_home !== undefined ? Boolean(body.show_on_home) : true,
        Array.isArray(body.nail_shapes) ? body.nail_shapes : ['almond','stiletto','coffin','square'],
        Array.isArray(body.gallery_urls) ? body.gallery_urls : []
      ]
    )

    revalidatePath('/')
    revalidatePath('/catalog')
    return NextResponse.json(product)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, ...body } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    if (body.new_category_name && String(body.new_category_name).trim()) {
      const catName = String(body.new_category_name).trim()
      const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      const cat = await queryOne<{ id: string }>(
        `INSERT INTO categories (name, slug) VALUES ($1, $2)
         ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [catName, slug]
      )
      if (cat) body.category_id = cat.id
    }
    delete body.new_category_name

    if (body.category_id === 'NEW') {
      delete body.category_id
    }

    const price = body.price !== undefined ? parseInt(String(body.price), 10) : undefined

    const product = await queryOne(
      `UPDATE products SET
         name = COALESCE($1, name),
         price = COALESCE($2, price),
         description = COALESCE($3, description),
         image_url = COALESCE($4, image_url),
         category_id = COALESCE($5, category_id),
         in_stock = COALESCE($6, in_stock),
         show_on_home = COALESCE($7, show_on_home),
         nail_shapes = COALESCE($8, nail_shapes),
         gallery_urls = COALESCE($9, gallery_urls)
       WHERE id = $10
       RETURNING *`,
      [
        body.name,
        price,
        body.description,
        body.image_url,
        body.category_id,
        body.in_stock,
        body.show_on_home,
        body.nail_shapes,
        body.gallery_urls,
        id
      ]
    )

    revalidatePath('/')
    revalidatePath('/catalog')
    return NextResponse.json(product)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    await query(`DELETE FROM products WHERE id = $1`, [id])
    revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
