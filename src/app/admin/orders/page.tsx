'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import { supabase } from '@/lib/supabase'
import { mockOrders } from '@/lib/mockData'
import { Package, Search, ExternalLink, RefreshCw, Truck } from 'lucide-react'

export default function AdminOrders() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  
  // Details Modal state
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  
  // Updating state
  const [updating, setUpdating] = useState(false)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
      if (error || !data || data.length === 0) {
        setOrders(mockOrders)
      } else {
        setOrders(data)
      }
    } catch {
      setOrders(mockOrders)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!localStorage.getItem('admin-auth')) { router.push('/admin/login'); return }
    fetchOrders()
  }, [router])

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(search.toLowerCase()) || 
    o.customer_name.toLowerCase().includes(search.toLowerCase())
  )

  const handleUpdateStatus = async (orderId: string, status: string, trackingNumber?: string) => {
    setUpdating(true)
    try {
      // If using mock orders (offline mode), just update local state
      if (orders === mockOrders) {
        alert("Cannot update statuses in offline/mock mode.")
      } else {
        const payload: any = { fulfillment_status: status }
        if (trackingNumber !== undefined) payload.tracking_number = trackingNumber
        
        await supabase.from('orders').update(payload).eq('id', orderId)
        await fetchOrders()
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, ...payload })
        }
      }
    } catch (e) {
      console.error(e)
    }
    setUpdating(false)
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto relative">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Package className="w-6 h-6 text-brand" />
            Order Management
          </h1>
          <button 
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm text-gray-300 hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-xl flex flex-col min-h-[500px]">
          <div className="p-5 border-b border-gray-800 flex justify-between items-center">
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text"
                placeholder="Search orders..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 text-white text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-brand"
              />
            </div>
            <div className="text-sm text-gray-400">
              Total {filteredOrders.length} orders
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64 text-brand">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium">Order ID</th>
                    <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium">Date</th>
                    <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium">Customer</th>
                    <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium">Items/Amount</th>
                    <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium">Payment</th>
                    <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium">Fulfillment</th>
                    <th className="text-right px-5 py-3 text-gray-400 text-xs font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="px-5 py-3 text-gray-300 font-mono text-xs">{order.id.slice(0, 8).toUpperCase()}</td>
                      <td className="px-5 py-3 text-gray-400 text-xs">{new Date(order.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric'})}</td>
                      <td className="px-5 py-3 text-white">
                        <p>{order.customer_name}</p>
                        <p className="text-xs text-gray-500">{order.email}</p>
                      </td>
                      <td className="px-5 py-3 text-white font-medium">₹{order.total_amount.toLocaleString('en-IN')}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.payment_status === 'paid' ? 'bg-green-900/50 text-green-400 border border-green-900' : 
                          'bg-orange-900/50 text-orange-400 border border-orange-900'
                        }`}>
                          {order.payment_status || 'pending'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          (order.fulfillment_status || 'pending') === 'delivered' ? 'bg-blue-900/50 text-blue-400 border border-blue-900' : 
                          (order.fulfillment_status || 'pending') === 'shipped' ? 'bg-brand/20 text-brand border border-brand/50' : 
                          'bg-gray-800 text-gray-300 border border-gray-700'
                        }`}>
                          {(order.fulfillment_status || 'pending').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded text-xs transition-colors"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-10 text-gray-500">No orders found.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Details Side Panel */}
      {selectedOrder && (
        <div className="fixed inset-y-0 right-0 w-[450px] bg-gray-900 border-l border-gray-800 shadow-2xl flex flex-col z-50 animate-in slide-in-from-right-full">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <div>
              <h2 className="text-white font-bold text-xl">Order #{selectedOrder.id.slice(0,8).toUpperCase()}</h2>
              <p className="text-xs text-gray-400 mt-1">{new Date(selectedOrder.created_at).toLocaleString('en-IN')}</p>
            </div>
            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white p-2">✕</button>
          </div>
          
          <div className="flex-1 overflow-auto p-6 space-y-8">
            {/* Customer Details */}
            <section>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Customer Details</h3>
              <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-2 text-sm text-gray-300">
                <p><span className="text-gray-500 inline-block w-20">Name:</span> {selectedOrder.customer_name}</p>
                <p><span className="text-gray-500 inline-block w-20">Email:</span> {selectedOrder.email || 'N/A'}</p>
                <p><span className="text-gray-500 inline-block w-20">Phone:</span> {selectedOrder.phone}</p>
                {selectedOrder.instagram && (
                  <p><span className="text-gray-500 inline-block w-20">Instagram:</span> <a href={`https://instagram.com/${selectedOrder.instagram.replace('@', '')}`} target="_blank" className="text-brand hover:underline">{selectedOrder.instagram}</a></p>
                )}
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Shipping Address</h3>
              <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 text-sm text-gray-300 leading-relaxed">
                <p>{selectedOrder.address}</p>
                <p>{selectedOrder.city}, {selectedOrder.state}</p>
                <p>PIN: {selectedOrder.pincode}</p>
              </div>
            </section>

            {/* Note */}
            {selectedOrder.order_note && (
               <section>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Order Note</h3>
                <div className="bg-orange-950/30 p-4 rounded-xl border border-orange-900/50 text-sm text-orange-200">
                  {selectedOrder.order_note}
                </div>
              </section>
            )}

            {/* Fulfillment Management */}
            <section>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2"><Truck className="w-4 h-4"/> Fulfillment</h3>
              <div className="bg-gray-950 p-5 rounded-xl border border-gray-800 space-y-4">
                
                <div>
                  <label className="text-xs text-gray-500 block mb-1.5">Status</label>
                  <select 
                    value={selectedOrder.fulfillment_status || 'pending'}
                    onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                    disabled={updating}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-brand"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-500 block mb-1.5">Tracking Number</label>
                  <div className="flex gap-2">
                    <input 
                      id="tracking-input"
                      type="text" 
                      defaultValue={selectedOrder.tracking_number || ''}
                      placeholder="e.g. DELHIVERY123..."
                      className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand"
                    />
                    <button 
                      onClick={() => {
                        const val = (document.getElementById('tracking-input') as HTMLInputElement).value
                        handleUpdateStatus(selectedOrder.id, selectedOrder.fulfillment_status || 'pending', val)
                      }}
                      disabled={updating}
                      className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand/90 transition"
                    >
                      Save
                    </button>
                  </div>
                </div>

              </div>
            </section>
            
          </div>
        </div>
      )}
      {/* Overlay to close modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
      )}
    </div>
  )
}
