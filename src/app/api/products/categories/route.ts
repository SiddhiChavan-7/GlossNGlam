import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const categories = await query(`SELECT * FROM categories ORDER BY name ASC`)
    return NextResponse.json(categories)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const name = body?.name
    if (!name || !String(name).trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    }
    const catName = String(name).trim()
    const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const cat = await queryOne(
      `INSERT INTO categories (name, slug) VALUES ($1, $2)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
       RETURNING *`,
      [catName, slug]
    )
    return NextResponse.json(cat)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const idParam = searchParams.get('id')
    const body = await req.json().catch(() => ({}))
    const id = idParam || body.id

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
    }

    // Find a fallback category to reassign any products referencing this category
    const fallbackCat = await queryOne<{ id: string }>(
      `SELECT id FROM categories WHERE id != $1 ORDER BY name ASC LIMIT 1`,
      [id]
    )

    if (fallbackCat) {
      await query(`UPDATE products SET category_id = $1 WHERE category_id = $2`, [fallbackCat.id, id])
    }

    // Delete the category
    await query(`DELETE FROM categories WHERE id = $1`, [id])

    return NextResponse.json({ success: true, message: 'Category deleted successfully' })
  } catch (err: any) {
    console.error('Delete category error:', err)
    return NextResponse.json({ error: err.message || 'Failed to delete category' }, { status: 500 })
  }
}
