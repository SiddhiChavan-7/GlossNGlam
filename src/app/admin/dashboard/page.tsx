'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import { ShoppingBag, Package, TrendingUp, IndianRupee, RefreshCw, Trash2, CheckCircle2, Clock } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({ orders: 0, products: 0, revenue: 0, pending: 0 })
  const [allOrders, setAllOrders] = useState<any[]>([])
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState('')

  const fetchLiveStats = useCallback(async (manual = false) => {
    if (manual) setIsSyncing(true)
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch('/api/orders', { cache: 'no-store' }),
        fetch('/api/products', { cache: 'no-store' })
      ])
      const ordersData = await ordersRes.json()
      const productsData = await productsRes.json()

      const orders = Array.isArray(ordersData) ? ordersData : []
      const products = Array.isArray(productsData) ? productsData : []

      const revenue = orders
        .filter((o: any) => o.payment_status === 'paid')
        .reduce((s: number, o: any) => s + Number(o.total_amount || 0), 0)
      const pending = orders.filter((o: any) => o.payment_status === 'pending' || (o.fulfillment_status && o.fulfillment_status !== 'delivered')).length

      setStats({ orders: orders.length, products: products.length, revenue, pending })
      setAllOrders(orders)
      setRecentOrders(orders.slice(0, 8))
      setLastSyncTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
      if (manual) toast.success('Live data synchronized!')
    } catch {
      // Silently catch background poll errors
    } finally {
      setLoading(false)
      if (manual) setIsSyncing(false)
    }
  }, [])

  // Initial load + Real-time auto-polling every 5 seconds
  useEffect(() => {
    if (!localStorage.getItem('admin-auth')) {
      router.push('/admin/login')
      return
    }

    fetchLiveStats()
    const interval = setInterval(() => {
      fetchLiveStats()
    }, 5000)

    return () => clearInterval(interval)
  }, [router, fetchLiveStats])

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to permanently delete this order?')) return
    try {
      const res = await fetch(`/api/orders?id=${orderId}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        toast.success('Order deleted successfully')
        fetchLiveStats(true)
      } else {
        toast.error(data.error || 'Failed to delete order')
      }
    } catch {
      toast.error('Failed to delete order')
    }
  }

  // Real 7-day revenue chart data
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dateStr = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    const dailyOrders = allOrders.filter(
      o => new Date(o.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) === dateStr
    )
    const revenue = dailyOrders
      .filter(o => o.payment_status === 'paid')
      .reduce((sum, o) => sum + Number(o.total_amount || 0), 0)
    return { date: dateStr, revenue, orders: dailyOrders.length }
  })

  const statCards = [
    { label: 'Real Orders', value: stats.orders, icon: ShoppingBag, color: 'text-blue-400' },
    { label: 'Live Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-emerald-400' },
    { label: 'Active Products', value: stats.products, icon: Package, color: 'text-purple-400' },
    { label: 'Pending Fulfillment', value: stats.pending, icon: Clock, color: 'text-amber-400' },
  ]

  return (
    <div className="flex min-h-screen bg-gray-950 font-sans">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {/* Top Realtime Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin Dashboard</h1>
            <p className="text-xs text-gray-400 mt-1">
              Live database connection • Real-time orders & revenue
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Indicator */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-800/80 text-emerald-400 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Live Sync Active</span>
              {lastSyncTime && <span className="text-[10px] text-emerald-600/90 font-mono">({lastSyncTime})</span>}
            </div>

            {/* Sync Now Button */}
            <button
              onClick={() => fetchLiveStats(true)}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-xs font-medium text-gray-300 hover:text-white hover:border-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-brand' : ''}`} />
              <span>Sync Now</span>
            </button>
          </div>
        </div>

        {/* Real-time Stat Cards */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-gray-900/60 border border-gray-800/60 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statCards.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-gray-900 rounded-2xl p-5 border border-gray-800/80 shadow-md">
                <Icon className={`w-6 h-6 ${color} mb-3`} />
                <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
                <p className="text-xs text-gray-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Real 7-Day Revenue Trend Chart */}
        <div className="mb-8 bg-gray-900 p-6 rounded-2xl border border-gray-800/80 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white font-semibold flex items-center gap-2 text-sm sm:text-base">
                <TrendingUp className="w-4 h-4 text-brand" /> 7-Day Real Revenue Trend
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Computed dynamically from confirmed paid orders</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="date" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={val => `₹${val}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue (₹)"
                  stroke="#ec4899"
                  strokeWidth={2.5}
                  dot={{ fill: '#ec4899', strokeWidth: 2, r: 3.5 }}
                  activeDot={{ r: 6, fill: '#f472b6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Live Orders Table */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800/80 overflow-hidden shadow-xl">
          <div className="p-5 border-b border-gray-800 flex items-center justify-between">
            <div>
              <h2 className="text-white font-semibold text-sm sm:text-base">Real Customer Orders</h2>
              <p className="text-xs text-gray-400 mt-0.5">Streamed live from your Neon PostgreSQL database</p>
            </div>
            <span className="text-xs text-gray-400 font-mono">
              Total {allOrders.length} {allOrders.length === 1 ? 'order' : 'orders'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-xs font-semibold uppercase tracking-wider bg-gray-950/50">
                  <th className="text-left px-5 py-3.5">Order ID</th>
                  <th className="text-left px-5 py-3.5">Customer</th>
                  <th className="text-left px-5 py-3.5">Items Purchased</th>
                  <th className="text-left px-5 py-3.5">Amount</th>
                  <th className="text-left px-5 py-3.5">Payment</th>
                  <th className="text-left px-5 py-3.5">Date</th>
                  <th className="text-right px-5 py-3.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/40">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-3.5 text-gray-300 font-mono text-xs font-semibold">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-white font-medium text-xs sm:text-sm">{order.customer_name}</p>
                      <p className="text-[11px] text-gray-400">{order.phone} • {order.city || 'India'}</p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-300">
                      {Array.isArray(order.order_items) && order.order_items.length > 0 ? (
                        <div className="space-y-0.5">
                          {order.order_items.map((item: any, idx: number) => (
                            <p key={idx} className="truncate max-w-xs">
                              {item.product_name} ({item.nail_shape || 'Custom'} • {item.nail_size || 'M'}) x{item.quantity}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">Custom Press-on Set</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-white font-semibold text-xs sm:text-sm">
                      ₹{Number(order.total_amount).toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          order.payment_status === 'paid'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
                            : 'bg-amber-950 text-amber-400 border border-amber-800/80'
                        }`}
                      >
                        {order.payment_status === 'paid' ? 'PAID' : 'PENDING'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                        title="Delete order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}

                {recentOrders.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="text-center py-16 px-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-800/50 text-gray-500 flex items-center justify-center mx-auto border border-gray-800 mb-3">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <p className="text-white font-semibold text-sm">No Live Customer Orders Yet</p>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 leading-relaxed">
                        All dummy and test data has been cleared. When real customers order and pay on your website, new orders will automatically stream in here in real-time.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
