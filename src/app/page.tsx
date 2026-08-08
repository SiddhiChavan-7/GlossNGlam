import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/types'
import { mockProducts } from '@/lib/mockData'
import StoreClientView from '@/components/StoreClientView'

async function getAllProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name, slug)')
      .order('created_at', { ascending: false })
      
    if (error || !data || data.length === 0) throw new Error("Fallback to mock")
    return data
  } catch (err) {
    return mockProducts
  }
}

export default async function HomePage() {
  const products = await getAllProducts()
  return <StoreClientView initialProducts={products} />
}
