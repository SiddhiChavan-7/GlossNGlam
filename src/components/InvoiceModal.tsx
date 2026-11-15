'use client'

import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Printer, Download, Sparkles, CheckCircle2 } from 'lucide-react'

interface InvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  order: any
}

export default function InvoiceModal({ isOpen, onClose, order }: InvoiceModalProps) {
  const printRef = useRef<HTMLDivElement>(null)

  if (!order) return null

  const handlePrint = () => {
    window.print()
  }

  const items = Array.isArray(order.order_items) ? order.order_items : []
  const subtotal = items.reduce((acc: number, i: any) => acc + (i.price * i.quantity), 0) || order.total_amount
  const invoiceNumber = `INV-${order.id.slice(0, 8).toUpperCase()}`
  const orderDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : new Date().toLocaleDateString('en-IN')

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[85] flex items-center justify-center p-2 sm:p-4 print:p-0">
          {/* Print-specific style */}
          <style jsx global>{`
            @media print {
              body * {
                visibility: hidden;
              }
              #printable-invoice, #printable-invoice * {
                visibility: visible;
              }
              #printable-invoice {
                position: absolute;
                left: 0;
                top: 0;
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
                padding: 24px !important;
                box-shadow: none !important;
                border: none !important;
              }
              .no-print {
                display: none !important;
              }
            }
          `}</style>

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm no-print"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[95vh] flex flex-col no-print:border border-gray-200"
          >
            {/* Modal Controls Bar */}
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between no-print">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand" />
                <span>Invoice Preview ({invoiceNumber})</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand hover:bg-brand/90 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Download / Print PDF</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Invoice Body */}
            <div
              id="printable-invoice"
              ref={printRef}
              className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white text-gray-800 space-y-6"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-gray-200">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-brand">
                    Gloss<span className="font-light italic text-gray-800">Nails</span>
                  </h1>
                  <p className="text-xs text-gray-500 mt-1 font-medium">Handcrafted Luxury Press-On Nails</p>
                  <p className="text-[11px] text-gray-400">Email: glossnglam8@gmail.com</p>
                  <p className="text-[11px] text-gray-400">Instagram: @_glossnglam8</p>
                </div>

                <div className="sm:text-right">
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 mb-1.5">
                    Official Tax Receipt
                  </span>
                  <p className="font-mono text-sm font-bold text-gray-900">{invoiceNumber}</p>
                  <p className="text-xs text-gray-500">Date: {orderDate}</p>
                  <p className="text-xs text-gray-500">Payment: <strong className="text-emerald-600">PAID (Razorpay)</strong></p>
                  {order.payment_id && (
                    <p className="text-[10px] font-mono text-gray-400">Txn ID: {order.payment_id}</p>
                  )}
                </div>
              </div>

              {/* Billed To / Shipping Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/80 p-4 rounded-2xl border border-gray-100 text-xs">
                <div>
                  <p className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1">
                    Billed & Shipped To:
                  </p>
                  <p className="font-bold text-gray-900 text-sm">{order.customer_name}</p>
                  <p className="text-gray-600 mt-0.5">{order.address}</p>
                  <p className="text-gray-600">
                    {order.city}, {order.state} - {order.pincode}
                  </p>
                  <p className="text-gray-600 mt-1">Phone: +91 {order.phone}</p>
                  {order.email && <p className="text-gray-600">Email: {order.email}</p>}
                </div>

                <div className="sm:text-right">
                  <p className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1">
                    Order Details:
                  </p>
                  <p className="text-gray-600">
                    Order Ref: <strong className="font-mono text-gray-900">{order.id}</strong>
                  </p>
                  {order.order_note && (
                    <p className="text-gray-500 text-[11px] mt-1 italic">
                      Note: &ldquo;{order.order_note}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400 uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 font-bold">Item & Specification</th>
                      <th className="py-2.5 font-bold text-center">Qty</th>
                      <th className="py-2.5 font-bold text-right">Price</th>
                      <th className="py-2.5 font-bold text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.length > 0 ? (
                      items.map((item: any, idx: number) => (
                        <tr key={item.id || idx}>
                          <td className="py-3 pr-2">
                            <p className="font-bold text-gray-900">{item.product_name}</p>
                            <p className="text-[11px] text-gray-500 capitalize">
                              {item.nail_shape ? `${item.nail_shape} Shape` : 'Custom Shape'} 
                              {item.nail_size ? ` • Size: ${item.nail_size}` : ''}
                            </p>
                          </td>
                          <td className="py-3 text-center text-gray-700">{item.quantity}</td>
                          <td className="py-3 text-right text-gray-700">₹{Number(item.price).toLocaleString('en-IN')}</td>
                          <td className="py-3 text-right font-bold text-gray-900">
                            ₹{(Number(item.price) * Number(item.quantity)).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="py-3" colSpan={3}>Handcrafted Press-On Nail Set</td>
                        <td className="py-3 text-right font-bold text-gray-900">
                          ₹{Number(order.total_amount).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Summary Totals */}
              <div className="pt-4 border-t border-gray-200 flex justify-end text-xs">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-800">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping Fee</span>
                    <span className="font-semibold text-emerald-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total Amount Paid</span>
                    <span className="text-brand">₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="pt-6 border-t border-gray-100 text-center space-y-1 text-[11px] text-gray-400">
                <p className="font-semibold text-gray-700">Thank you for your order with Gloss & Glam! ✨</p>
                <p>Each set is handcrafted with high quality multi-layer gel. Need application assistance? DM us @_glossnglam8</p>
                <p className="text-[10px] text-gray-300 pt-1">Computer generated electronic receipt. No physical signature required.</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

