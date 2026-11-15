'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Order } from '@/lib/types'
import { CheckCircle, Printer } from 'lucide-react'
import InvoiceModal from '@/components/InvoiceModal'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('id')
  const [order, setOrder] = useState<any | null>(null)
  const [copied, setCopied] = useState(false)
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders?id=${orderId}`)
        .then(r => r.json())
        .then(data => {
          const found = Array.isArray(data) ? data.find((o: any) => o.id === orderId) : (data?.id ? data : null)
          if (found) setOrder(found)
        })
        .catch(() => {})
    }
  }, [orderId])

  const copyOrderId = () => {
    if (order?.id) {
      navigator.clipboard.writeText(order.id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-12 md:py-16 text-center">
      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Order Confirmed! 🎉</h1>
      <p className="text-gray-500 mb-8 text-sm md:text-base">
        Thank you <strong className="text-gray-800">{order?.customer_name || 'Gorgeous'}</strong>! Your handcrafted luxury press-on nails are being prepped.
      </p>

      {order && (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 md:p-6 text-left mb-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 text-xs md:text-sm">
            <span className="text-gray-400 font-medium">Order Reference</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold bg-gray-100 px-2.5 py-1 rounded-md text-gray-800">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
              <button
                onClick={copyOrderId}
                className="text-[11px] text-brand hover:underline font-medium"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Payment Status</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Paid • Razorpay
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Amount Paid</span>
            <span className="font-bold text-gray-900 text-base">₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
          </div>

          {/* Purchased Items List */}
          {Array.isArray(order.order_items) && order.order_items.length > 0 && (
            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
                Items In This Order ({order.order_items.length})
              </p>
              <div className="space-y-2">
                {order.order_items.map((item: any, idx: number) => (
                  <div key={item.id || idx} className="flex justify-between items-center text-xs md:text-sm bg-gray-50/70 p-2.5 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">{item.product_name}</p>
                      <p className="text-[11px] text-gray-400 capitalize">
                        {item.nail_shape ? `${item.nail_shape} shape` : ''} 
                        {item.nail_size ? ` • Size: ${item.nail_size}` : ''}
                        {` • Qty: ${item.quantity}`}
                      </p>
                    </div>
                    <span className="font-semibold text-gray-800">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-gray-100 space-y-2 text-xs md:text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery Address</span>
              <span className="text-gray-700 text-right max-w-[65%] font-medium">
                {order.address}, {order.city}, {order.state} - {order.pincode}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Estimated Delivery</span>
              <span className="text-gray-800 font-medium">4–7 business days</span>
            </div>
          </div>

          <button
            onClick={() => setIsInvoiceOpen(true)}
            className="w-full mt-3 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-brand" />
            <span>Download / Print Official Invoice (PDF)</span>
          </button>
        </div>
      )}

      <p className="text-xs md:text-sm text-gray-400 mb-6">
        Have questions or special requests? DM us on Instagram <strong className="text-gray-700">@glossnglam8</strong> or contact support!
      </p>

      <div className="flex gap-3 justify-center">
        <Link href="/catalog" className="btn-primary px-6 py-2.5 text-sm rounded-full">
          Shop More Styles
        </Link>
        <Link href="/" className="btn-outline px-6 py-2.5 text-sm rounded-full">
          Back to Home
        </Link>
      </div>

      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        order={order}
      />
    </main>
  )
}

export default function OrderSuccessPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="max-w-lg mx-auto px-4 py-24 text-center text-sm text-gray-500">Loading order details...</div>}>
        <OrderSuccessContent />
      </Suspense>
    </>
  )
}
