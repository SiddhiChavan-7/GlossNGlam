'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import { supabase } from '@/lib/supabase'
import { mockOrders, mockProducts } from '@/lib/mockData'
import { ShoppingBag, Package, TrendingUp, IndianRupee } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({ orders: 0, products: 0, revenue: 0, pending: 0 })
  const [allOrders, setAllOrders] = useState<any[]>([])
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem('admin-auth')) { router.push('/admin/login'); return }
    Promise.all([
      supabase.from('orders').select('*'),
      supabase.from('products').select('*'),
    ]).then(([ordersRes, productsRes]) => {
      const orders = ordersRes.error ? mockOrders : (ordersRes.data || mockOrders)
      const products = productsRes.error ? mockProducts : (productsRes.data || mockProducts)
      
      const revenue = orders.filter((o: any) => o.payment_status === 'paid').reduce((s: number, o: any) => s + o.total_amount, 0)
      const pending = orders.filter((o: any) => o.payment_status === 'pending').length
      setStats({ orders: orders.length, products: products.length, revenue, pending })
      setAllOrders(orders)
      setRecentOrders(orders.slice(0, 5))
      setLoading(false)
    }).catch(() => {
      const orders = mockOrders;
      const products = mockProducts;
      const revenue = orders.filter((o: any) => o.payment_status === 'paid').reduce((s: number, o: any) => s + o.total_amount, 0)
      const pending = orders.filter((o: any) => o.payment_status === 'pending').length
      setStats({ orders: orders.length, products: products.length, revenue, pending })
      setAllOrders(orders)
      setRecentOrders(orders.slice(0, 5))
      setLoading(false)
    })
  }, [router])

  const chartData = allOrders.length > 0 ? Array.from({length: 7}).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dateStr = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    const dailyOrders = allOrders.filter(o => new Date(o.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) === dateStr)
    const revenue = dailyOrders.reduce((sum, o) => sum + o.total_amount, 0)
    return { date: dateStr, revenue, orders: dailyOrders.length }
  }) : []

  const statCards = [
    { label: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'text-blue-400' },
    { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-green-400' },
    { label: 'Products', value: stats.products, icon: Package, color: 'text-purple-400' },
    { label: 'Pending Orders', value: stats.pending, icon: TrendingUp, color: 'text-orange-400' },
  ]

  return (
    <div className="flex min-h-screen bg-gray-950">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-gray-800 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statCards.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
                <Icon className={`w-6 h-6 ${color} mb-3`} />
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-gray-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <div className="mb-8 bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
            <h2 className="text-white font-semibold mb-6 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-gray-400" /> Revenue & Order Trends (Last 7 Days)</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis dataKey="date" stroke="#9CA3AF" tick={{fill: '#9CA3AF', fontSize: 12}} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9CA3AF" tick={{fill: '#9CA3AF', fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} activeDot={{ r: 8, fill: '#60a5fa' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
          <div className="p-5 border-b border-gray-800">
            <h2 className="text-white font-semibold">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  {['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-gray-400 text-xs font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-3 text-gray-300 font-mono text-xs">{order.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-5 py-3 text-white">{order.customer_name}</td>
                    <td className="px-5 py-3 text-white font-medium">₹{order.total_amount.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.payment_status === 'paid' ? 'bg-green-900 text-green-300' : 'bg-orange-900 text-orange-300'
                      }`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">{new Date(order.created_at).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-10 text-gray-500">No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
