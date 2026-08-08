'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/components/UserContext'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

declare global { interface Window { Razorpay: any } }

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [deliveryOption, setDeliveryOption] = useState<'regular' | 'local'>('regular')
  const [form, setForm] = useState({
    customer_name: '', phone: '', email: '', instagram: '',
    address: '', pincode: '', city: '', state: '', order_note: ''
  })

  // Fixed shipping logic as per previous version
  const shippingFee = deliveryOption === 'local' ? 0 : (totalPrice >= 599 ? 0 : 99) 
  const discountAmount = Math.round(totalPrice * discount / 100)
  const finalTotal = totalPrice + shippingFee - discountAmount

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const applyPromo = async () => {
    try {
      const { data, error } = await supabase.from('promo_codes').select('*').eq('code', promoCode.toUpperCase()).eq('is_active', true).single()
      if (error || !data) throw error
      setDiscount(data.discount_percent); toast.success(`${data.discount_percent}% discount applied! 🎉`)
    } catch {
      if (promoCode.toUpperCase() === 'GLOSS10') {
        setDiscount(10); toast.success(`10% discount applied! 🎉`)
      } else {
        toast.error('Invalid or expired promo code')
      }
    }
  }

  const handlePayment = async () => {
    if (!form.customer_name || !form.phone || !form.address || !form.pincode || !form.city || !form.state) {
      toast.error('Please fill all required fields'); return
    }
    if (items.length === 0) { toast.error('Your cart is empty'); return }
    setLoading(true)

    try {
      // Create Razorpay order
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalTotal })
      })
      const { orderId } = await res.json()

      // Load Razorpay script
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      document.body.appendChild(script)
      script.onload = () => {
        const rzp = new window.Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: finalTotal * 100,
          currency: 'INR',
          name: 'GlossNails',
          description: 'Press-On Nail Set',
          order_id: orderId,
          handler: async (response: any) => {
            try {
              const verifyRes = await fetch('/api/payment/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  form,
                  items,
                  finalTotal,
                  userId: user?.id,
                  deliveryOption
                })
              })
              
              if (!verifyRes.ok) throw new Error('Payment verification failed')
              const { orderId: newOrderId } = await verifyRes.json()

              clearCart()
              window.location.href = `/order-success?id=${newOrderId}`
            } catch (err) {
              toast.error('Payment verification failed. If money was deducted, please contact support.')
              setLoading(false)
            }
          },
          prefill: { name: form.customer_name, contact: `+91${form.phone}`, email: form.email },
          theme: { color: '#FF66A3' },
          modal: { ondismiss: () => setLoading(false) }
        })
        rzp.open()
      }
    } catch {
      toast.error('Payment failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-50/90 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full h-[95vh] md:h-[85vh] md:max-w-2xl bg-white shadow-2xl rounded-t-3xl md:rounded-3xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                  <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>
                <div className="font-bold text-xl text-gray-900 tracking-tight flex items-center gap-2">
                  <span className="text-brand text-2xl">❤️</span> Thank you
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50 w-full">
              <div className="p-4 md:p-6 space-y-4 max-w-full">
                
                {/* Contact Form */}
                <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 space-y-3">
                  <input name="customer_name" placeholder="Full Name *" value={form.customer_name} onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-gray-50 hover:bg-gray-100/50 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-1 ring-brand/30 transition-all text-gray-900 placeholder:text-gray-400 font-medium" />
                  
                  <div className="flex items-center bg-gray-50 hover:bg-gray-100/50 rounded-xl border-none focus-within:bg-white focus-within:ring-1 ring-brand/30 transition-all px-4 overflow-hidden text-gray-900">
                    <span className="text-gray-400 font-medium whitespace-nowrap border-r border-gray-200 pr-3 mr-3 text-sm">@ Instagram</span>
                    <input name="instagram" placeholder="" value={form.instagram} onChange={handleChange}
                      className="w-full py-3.5 bg-transparent border-none focus:outline-none text-sm font-medium" />
                  </div>

                  <div className="flex items-center bg-gray-50 hover:bg-gray-100/50 rounded-xl border-none focus-within:bg-white focus-within:ring-1 ring-brand/30 transition-all px-4 overflow-hidden text-gray-900">
                    <span className="flex items-center gap-2 whitespace-nowrap text-gray-500 font-medium text-sm border-r border-gray-200 pr-3 mr-3">
                      🇮🇳 +91 <span>▾</span>
                    </span>
                    <input name="phone" placeholder="Phone *" type="tel" value={form.phone} onChange={handleChange}
                      className="w-full py-3.5 bg-transparent border-none focus:outline-none text-sm font-medium" />
                  </div>

                  <input name="email" placeholder="Email ID" type="email" value={form.email} onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-gray-50 hover:bg-gray-100/50 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-1 ring-brand/30 transition-all text-gray-900 placeholder:text-gray-400 font-medium" />
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2 text-sm">🏠 Shipping Address</h3>
                  <input name="address" placeholder="Address with Landmark *" value={form.address} onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-gray-50 hover:bg-gray-100/50 rounded-xl text-sm focus:bg-white focus:outline-none transition-all text-gray-900 font-medium" />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <input name="pincode" placeholder="Pincode *" value={form.pincode} onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-gray-50 hover:bg-gray-100/50 rounded-xl text-sm focus:bg-white focus:outline-none transition-all text-gray-900 font-medium" />
                    <input name="city" placeholder="City *" value={form.city} onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-gray-50 hover:bg-gray-100/50 rounded-xl text-sm focus:bg-white focus:outline-none transition-all text-gray-900 font-medium" />
                    <input name="state" placeholder="State *" value={form.state} onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-gray-50 hover:bg-gray-100/50 rounded-xl text-sm focus:bg-white focus:outline-none transition-all text-gray-900 font-medium" />
                    <input value="India" readOnly
                      className="w-full px-4 py-3.5 bg-gray-50 rounded-xl text-sm text-gray-400 font-medium cursor-not-allowed" />
                  </div>
                </div>

                {/* Order Note */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                   <div className="p-4 md:p-5">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">📝 Order Note</h3>
                    <textarea name="order_note" placeholder="Got any special requests or notes for your order? Let us know here!" value={form.order_note} onChange={handleChange} rows={2}
                      className="w-full px-4 py-3.5 bg-gray-50 hover:bg-gray-100/50 rounded-xl text-sm focus:bg-white focus:outline-none transition-all resize-none text-gray-900 font-medium" />
                   </div>
                </div>

                {/* Delivery Options */}
                <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">🚚 Delivery Options</h3>
                  
                  {/* Option 1: Regular */}
                  <div 
                    onClick={() => setDeliveryOption('regular')}
                    className={`flex items-center justify-between p-4 rounded-xl cursor-pointer border-2 transition-all ${deliveryOption === 'regular' ? 'border-brand bg-pink-50/30' : 'border-transparent bg-gray-50 hover:bg-gray-100'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${deliveryOption === 'regular' ? 'bg-brand' : 'border-2 border-gray-300'}`}>
                        {deliveryOption === 'regular' && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Regular Delivery</p>
                        <p className="text-xs text-gray-400">Ships within 4-7 days</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 text-sm">{totalPrice >= 599 ? 'Free' : '₹99'}</span>
                  </div>

                  {/* Option 2: Local */}
                  <div 
                    onClick={() => setDeliveryOption('local')}
                    className={`flex items-center justify-between p-4 rounded-xl cursor-pointer border-2 transition-all ${deliveryOption === 'local' ? 'border-brand bg-pink-50/30' : 'border-transparent bg-gray-50 hover:bg-gray-100'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${deliveryOption === 'local' ? 'bg-brand' : 'border-2 border-gray-300'}`}>
                        {deliveryOption === 'local' && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Local Delivery / Pickup</p>
                        <p className="text-xs text-gray-400">For local customers only</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 text-sm">Free</span>
                  </div>
                </div>
                
                {/* Promo Code */}
                 <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <div className="flex gap-2">
                      <input
                        value={promoCode}
                        onChange={e => setPromoCode(e.target.value)}
                        placeholder="Have a Promo code?"
                        className="flex-1 text-sm bg-transparent border-none focus:outline-none font-medium placeholder:text-gray-400 px-2"
                      />
                      <button onClick={applyPromo} className="text-brand font-bold text-sm px-4">
                        APPLY
                      </button>
                    </div>
                 </div>

                {/* Order Summary */}
                <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 pb-28 text-sm font-medium">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">📦 Your Order</h3>
                  <div className="space-y-3 mb-4">
                    {items.map(item => (
                      <div key={item.product.id} className="flex justify-between items-center text-gray-600">
                        <div className="flex items-center gap-3">
                          <Image src={item.product.image_url} alt="" width={32} height={32} className="rounded object-cover" />
                          <span>{item.product.name} <span className="text-gray-400 ml-1">x {item.quantity}</span></span>
                        </div>
                        <span className="text-gray-900 font-bold">
                          {item.isFreeGift ? (
                            <span className="text-brand uppercase">Free</span>
                          ) : (
                            `₹${(item.product.price * item.quantity).toLocaleString('en-IN')}`
                          )}
                        </span>
                      </div>
                    ))}
                    
                    <div className="flex justify-between pt-3 border-t border-gray-50 text-gray-500">
                      <span>Shipping Fee</span>
                      <span className="text-gray-900 font-bold">₹{shippingFee}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-brand text-sm">
                        <span>Discount ({discount}%)</span>
                        <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Bottom Bar */}
            <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 z-20 md:rounded-b-3xl shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
              <div className="flex items-center justify-center gap-2 mb-3 text-[11px] sm:text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1 text-gray-700 font-semibold"><ShieldCheck className="w-4 h-4 text-brand" /> 100% Secure</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span>GPay, FamPay, PhonePe, Paytm, Cards</span>
              </div>
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full relative overflow-hidden group bg-brand hover:bg-brand/90 transition-all text-white font-bold text-sm h-14 rounded-2xl flex items-center justify-between px-6 shadow-lg shadow-brand/25"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
                <span className="flex items-center gap-2 relative z-10 text-base">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'Complete Payment'
                  )}
                </span>
                <span className="relative z-10 text-lg">₹{finalTotal.toLocaleString('en-IN')}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
