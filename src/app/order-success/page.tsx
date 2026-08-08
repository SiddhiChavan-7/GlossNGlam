'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'
import { Order } from '@/lib/types'
import { CheckCircle } from 'lucide-react'

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('id')
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (orderId) {
      supabase.from('orders').select('*').eq('id', orderId).single().then(({ data }) => setOrder(data))
    }
    // Clear the cart if we came directly here (though it's usually cleared in the modal)
  }, [orderId])

  return (
    <>
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-16 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed! 🎉</h1>
        <p className="text-gray-500 mb-8">
          Thank you {order?.customer_name || ''}! Your gorgeous nails are on their way.
        </p>

        {order && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-left mb-8 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Order ID</span>
              <span className="font-mono text-xs text-gray-700">{order.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Amount Paid</span>
              <span className="font-bold text-gray-900">₹{order.total_amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Delivery to</span>
              <span className="text-gray-700 text-right max-w-[60%]">{order.city}, {order.state}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Estimated delivery</span>
              <span className="text-gray-700">4-7 business days</span>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-400 mb-6">
          Questions? DM us on Instagram or WhatsApp. We are always happy to help!
        </p>

        <div className="flex gap-3 justify-center">
          <Link href="/shop" className="btn-primary">Shop More</Link>
          <Link href="/" className="btn-outline">Go Home</Link>
        </div>
      </main>
    </>
  )
}
