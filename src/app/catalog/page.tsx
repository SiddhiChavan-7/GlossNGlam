import { Suspense } from 'react'
import { query } from '@/lib/db'
import { Product, Category } from '@/lib/types'
import CatalogClientView from '@/components/CatalogClientView'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Collections & Catalog | GlossNails',
  description: 'Browse our complete catalog of bespoke handcrafted press-on nails. Filter by nail shape, category, and find your custom size.',
}

export const revalidate = 0 // Dynamic data

async function getCatalogData(): Promise<{ products: Product[]; categories: Category[] }> {
  try {
    const [products, categories] = await Promise.all([
      query<any>(
        `SELECT p.*,
                json_build_object('name', c.name, 'slug', c.slug) AS categories
         FROM products p
         LEFT JOIN categories c ON c.id = p.category_id
         ORDER BY p.created_at DESC`
      ),
      query<Category>(`SELECT id, name, slug FROM categories ORDER BY name ASC`)
    ])

    return {
      products: products || [],
      categories: categories || []
    }
  } catch (err) {
    console.error('Catalog data load error:', err)
    return { products: [], categories: [] }
  }
}

export default async function CatalogPage() {
  const { products, categories } = await getCatalogData()
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-50 flex items-center justify-center text-sm text-gray-500">Loading catalog...</div>}>
      <CatalogClientView initialProducts={products} categories={categories} />
    </Suspense>
  )
}

