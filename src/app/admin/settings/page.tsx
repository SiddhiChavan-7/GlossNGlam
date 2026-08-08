'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { Save, Settings } from 'lucide-react'

export default function AdminSettings() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  
  const [offer, setOffer] = useState({
    is_active: false,
    threshold: 600,
    product_id: ''
  })

  useEffect(() => {
    if (!localStorage.getItem('admin-auth')) { router.push('/admin/login'); return }
    
    // Fetch settings and products
    Promise.all([
      fetch('/api/settings').then(res => res.json()),
      supabase.from('products').select('id, name')
    ]).then(([settingsRes, productsRes]) => {
      if (settingsRes.success && settingsRes.settings) {
        const giftOffer = settingsRes.settings.find((s: any) => s.key === 'free_gift_offer')
        if (giftOffer) {
          setOffer({
            is_active: giftOffer.value.is_active || false,
            threshold: giftOffer.value.threshold || 600,
            product_id: giftOffer.value.product_id || ''
          })
        }
      }
      
      if (productsRes.data) {
        setProducts(productsRes.data)
      }
      
      setLoading(false)
    }).catch(err => {
      console.error(err)
      toast.error('Failed to load settings')
      setLoading(false)
    })
  }, [router])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'free_gift_offer',
          value: offer
        })
      })
      
      const data = await res.json()
      if (res.ok && data.success) {
        toast.success('Settings saved successfully')
      } else {
        toast.error(data.error || 'Failed to save settings')
      }
    } catch (err) {
      toast.error('An error occurred')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="w-8 h-8 text-white" />
          <h1 className="text-2xl font-bold text-white">Store Settings</h1>
        </div>

        {loading ? (
          <div className="text-white">Loading...</div>
        ) : (
          <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-xl max-w-2xl">
            <h2 className="text-xl font-semibold text-white mb-6">Threshold Free Gift Offer</h2>
            <p className="text-gray-400 text-sm mb-6">Create a special promotion where users receive a free nail set when their cart total reaches a specific amount.</p>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-950 rounded-xl border border-gray-800">
                <div>
                  <h3 className="text-white font-medium">Enable Offer</h3>
                  <p className="text-xs text-gray-500 mt-1">Turn the threshold free gift on or off</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={offer.is_active}
                    onChange={(e) => setOffer({...offer, is_active: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cart Threshold Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={offer.threshold}
                    onChange={(e) => setOffer({...offer, threshold: parseInt(e.target.value) || 0})}
                    className="w-full pl-8 pr-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white focus:ring-1 focus:ring-brand focus:border-brand transition-all outline-none"
                    placeholder="600"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">The minimum cart subtotal required to get the free gift.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Free Gift Product</label>
                <select
                  value={offer.product_id}
                  onChange={(e) => setOffer({...offer, product_id: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white focus:ring-1 focus:ring-brand focus:border-brand transition-all outline-none"
                >
                  <option value="">-- Select a product --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">This specific product will be added to the cart for ₹0.</p>
              </div>

              <div className="pt-4 border-t border-gray-800">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-full font-semibold hover:bg-brand/90 transition-colors disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
