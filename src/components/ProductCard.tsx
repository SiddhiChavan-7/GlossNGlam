import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/types'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <Image
            src={product.image_url || 'https://placehold.co/400x400/f5e6e8/c06b72?text=GlossNails'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {!product.in_stock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">Sold Out</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-1">{product.name}</h3>
          <p className="text-brand font-bold">₹{product.price.toLocaleString('en-IN')}</p>
        </div>
      </div>
    </Link>
  )
}
