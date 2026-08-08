'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/components/UserContext'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setOrders(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || !user) {
    return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 px-4 md:px-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 mt-8">
        <div>
          <h1 className="text-3xl font-serif text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-500 font-medium text-sm">Welcome back, {user.name} ({user.email})</p>
        </div>
        <button 
          onClick={logout}
          className="text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors uppercase tracking-widest border border-gray-200 px-6 py-2 rounded-full hover:border-red-500 self-start md:self-auto"
        >
          Logout
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 font-medium">Fetching your stylish history...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-pink-50 text-brand rounded-full flex items-center justify-center text-3xl mb-4">🛍️</div>
          <h2 className="text-xl font-serif text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-xs">Looks like you haven't bought anything yet. Go treat yourself!</p>
          <Link href="/shop" className="bg-brand text-white px-8 py-3 rounded-full font-bold shadow-[0_10px_30px_rgba(224,17,95,0.3)] hover:-translate-y-1 transition-all">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl font-medium text-gray-900">Order History</h2>
          
          <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            {orders.map((order, idx) => (
              <div key={order.id} className={`p-6 ${idx !== 0 ? 'border-t border-gray-50' : ''} hover:bg-gray-50/50 transition-colors`}>
                <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
                  <div>
                    <p className="text-brand text-xs font-bold uppercase tracking-widest mb-1">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-gray-500 font-medium">
                      {new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                  <div className="sm:text-right flex flex-col items-start sm:items-end gap-1">
                    <p className="font-bold text-gray-900 text-lg">₹{order.total_amount.toLocaleString('en-IN')}</p>
                    <div className="flex gap-2 mt-1">
                      <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider bg-green-100 inline-block px-2 py-1 rounded-md">
                        {order.payment_status}
                      </p>
                      <p className={`text-[10px] font-bold uppercase tracking-wider inline-block px-2 py-1 rounded-md ${
                        (order.fulfillment_status || 'pending') === 'delivered' ? 'bg-blue-100 text-blue-600' : 
                        (order.fulfillment_status || 'pending') === 'shipped' ? 'bg-brand/10 text-brand' : 
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {order.fulfillment_status || 'pending'}
                      </p>
                    </div>
                    {order.tracking_number && (
                      <p className="text-[11px] text-gray-500 font-medium mt-1">
                        Tracking: <span className="text-gray-900 select-all tracking-wider">{order.tracking_number}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center bg-[#FAFAFA] p-3 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center text-xs text-gray-400 shrink-0">
                          Nails
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm leading-tight">{item.product_name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.nail_shape || 'Almond'} • Size {item.nail_size || 'S'} <span className="mx-1">|</span> Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-700 text-sm whitespace-nowrap">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
