import { query } from '@/lib/db'
import { Product } from '@/lib/types'
import StoreClientView from '@/components/StoreClientView'

async function getAllProducts(): Promise<Product[]> {
  try {
    const data = await query<any>(
      `SELECT p.*,
              json_build_object('name', c.name, 'slug', c.slug) AS categories
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       ORDER BY p.created_at DESC`
    )
    return data || []
  } catch (err) {
    return []
  }
}

export default async function HomePage() {
  const products = await getAllProducts()
  return <StoreClientView initialProducts={products} />
}
