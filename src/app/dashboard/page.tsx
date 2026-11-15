'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/UserContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import SizingGuideModal from '@/components/SizingGuideModal'
import { Ruler, Sparkles, Check, Camera, ShoppingBag, LogOut, Package, ArrowRight } from 'lucide-react'

const SIZE_PRESETS: Record<string, { thumb: number; index: number; middle: number; ring: number; pinky: number }> = {
  XS: { thumb: 14, index: 11, middle: 12, ring: 10, pinky: 8 },
  S: { thumb: 15, index: 12, middle: 13, ring: 11, pinky: 8 },
  M: { thumb: 16, index: 12, middle: 13, ring: 11, pinky: 9 },
  L: { thumb: 17, index: 13, middle: 14, ring: 12, pinky: 10 }
}

const SHAPES = ['almond', 'coffin', 'stiletto', 'square', 'oval', 'squoval']
const LENGTHS = ['short', 'medium', 'long']

export default function DashboardPage() {
  const { user, loading: authLoading, logout, refreshUser } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSizingModalOpen, setIsSizingModalOpen] = useState(false)
  const [savingSizing, setSavingSizing] = useState(false)

  // Sizing Profile State
  const [preset, setPreset] = useState<string>('M')
  const [shape, setShape] = useState<string>('almond')
  const [length, setLength] = useState<string>('medium')
  const [measurements, setMeasurements] = useState({
    thumb: 16,
    index: 12,
    middle: 13,
    ring: 11,
    pinky: 9
  })
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Preload saved sizes if present in user profile
  useEffect(() => {
    if (user?.saved_sizes) {
      const s = user.saved_sizes
      if (s.preset) setPreset(s.preset)
      if (s.preferred_shape) setShape(s.preferred_shape)
      if (s.preferred_length) setLength(s.preferred_length)
      if (s.thumb || s.index || s.middle || s.ring || s.pinky) {
        setMeasurements({
          thumb: s.thumb || 16,
          index: s.index || 12,
          middle: s.middle || 13,
          ring: s.ring || 11,
          pinky: s.pinky || 9
        })
      }
      if (s.notes) setNotes(s.notes)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    if (!user) return
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      const userOrders = Array.isArray(data)
        ? data.filter((o: any) => o.user_id === user.id)
        : []
      setOrders(userOrders)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePresetSelect = (p: string) => {
    setPreset(p)
    if (SIZE_PRESETS[p]) {
      setMeasurements(SIZE_PRESETS[p])
    }
  }

  const handleMeasurementChange = (finger: keyof typeof measurements, val: string) => {
    setPreset('Custom')
    const num = val === '' ? 0 : Number(val)
    setMeasurements(prev => ({ ...prev, [finger]: num }))
  }

  const handleSaveSizing = async () => {
    setSavingSizing(true)
    try {
      const res = await fetch('/api/user/sizing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preset,
          preferred_shape: shape,
          preferred_length: length,
          ...measurements,
          notes
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save sizing')
      await refreshUser()
      toast.success('Nail sizing profile saved! 💅 Ready for 1-click checkout.')
    } catch (err: any) {
      toast.error(err.message || 'Failed to save sizing')
    } finally {
      setSavingSizing(false)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center text-sm text-gray-500">
        Loading dashboard...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-10 px-4 md:px-8 max-w-5xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200/80 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-brand/20 text-brand text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 fill-brand" />
            <span>Gloss VIP Member</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm">{user.email}</p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand hover:bg-brand/90 text-white rounded-full text-xs sm:text-sm font-bold shadow-sm transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Shop Nails</span>
          </Link>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-full text-xs sm:text-sm font-medium transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* SIZING PROFILE CARD */}
      <section className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-gray-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200/60 flex items-center justify-center shrink-0">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                My Saved Nail Sizing & Fit Profile
              </h2>
              <p className="text-xs text-gray-500">
                Save your coin measurements once. We auto-apply your size when you add sets to bag!
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSizingModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline self-start sm:self-auto"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>View Coin Sizing Guide</span>
          </button>
        </div>

        <div className="pt-6 space-y-6">
          {/* Preset Buttons */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
              1. Choose Standard Size Preset (or Custom)
            </label>
            <div className="flex flex-wrap gap-2">
              {['XS', 'S', 'M', 'L', 'Custom'].map(p => {
                const isActive = preset === p
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePresetSelect(p)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      isActive
                        ? 'bg-gray-900 text-white border-gray-900 shadow-xs'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {p} {p !== 'Custom' && <span className="opacity-70 font-normal">({SIZE_PRESETS[p]?.thumb}mm...)</span>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Individual Finger Measurements Grid */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
              2. Individual Finger Widths (mm)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {(
                [
                  { key: 'thumb', label: 'Thumb 👍' },
                  { key: 'index', label: 'Index ☝️' },
                  { key: 'middle', label: 'Middle 🖕' },
                  { key: 'ring', label: 'Ring 💍' },
                  { key: 'pinky', label: 'Pinky 🤏' }
                ] as const
              ).map(({ key, label }) => (
                <div key={key} className="bg-gray-50/80 p-3 rounded-2xl border border-gray-200/60">
                  <span className="text-[11px] font-semibold text-gray-600 block mb-1">{label}</span>
                  <div className="flex items-center">
                    <input
                      type="number"
                      min={6}
                      max={25}
                      value={measurements[key] || ''}
                      onChange={e => handleMeasurementChange(key, e.target.value)}
                      className="w-full text-base font-bold text-gray-900 bg-transparent border-none focus:outline-none"
                    />
                    <span className="text-xs text-gray-400 font-medium">mm</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preferred Shape & Length */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                3. Preferred Default Shape
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SHAPES.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setShape(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-all ${
                      shape === s
                        ? 'bg-brand/15 text-brand border-brand font-bold'
                        : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                4. Preferred Length
              </label>
              <div className="flex gap-2">
                {LENGTHS.map(l => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLength(l)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium capitalize border transition-all ${
                      length === l
                        ? 'bg-brand/15 text-brand border-brand font-bold'
                        : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100">
            <p className="text-[11px] text-gray-400">
              Saved profiles auto-fill your size buttons in 1 click across the entire store.
            </p>
            <button
              onClick={handleSaveSizing}
              disabled={savingSizing}
              className="w-full sm:w-auto px-6 py-2.5 bg-gray-900 hover:bg-brand text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              {savingSizing ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Sizing Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ORDER HISTORY SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-brand" />
            <span>My Order History</span>
          </h2>
          <span className="text-xs text-gray-400">{orders.length} orders total</span>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-xs border border-gray-200/80 flex flex-col items-center">
            <div className="w-16 h-16 bg-pink-50 text-brand rounded-2xl flex items-center justify-center text-2xl mb-3">
              🛍️
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No orders yet</h3>
            <p className="text-gray-500 text-xs sm:text-sm mb-5 max-w-xs">
              Explore our handcrafted collections and treat yourself to luxury salon-quality nails!
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 bg-brand text-white px-6 py-2.5 rounded-full font-bold text-xs shadow-sm hover:opacity-90 transition-all"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-3 border-b border-gray-100 gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-gray-900">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Paid
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize bg-gray-100 text-gray-700">
                      {order.fulfillment_status || 'Pending'}
                    </span>
                    <span className="font-bold text-gray-900 text-base sm:ml-2">
                      ₹{Number(order.total_amount).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Items */}
                {Array.isArray(order.order_items) && order.order_items.length > 0 && (
                  <div className="space-y-2">
                    {order.order_items.map((item: any, idx: number) => (
                      <div
                        key={item.id || idx}
                        className="flex justify-between items-center text-xs bg-gray-50/70 p-2.5 rounded-xl"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">{item.product_name}</p>
                          <p className="text-[11px] text-gray-400 capitalize">
                            {item.nail_shape ? `${item.nail_shape} shape` : ''}
                            {item.nail_size ? ` • Size: ${item.nail_size}` : ''}
                            {` • Qty: ${item.quantity}`}
                          </p>
                        </div>
                        <span className="font-bold text-gray-800">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {order.tracking_number && (
                  <div className="text-xs bg-pink-50/50 p-2.5 rounded-xl border border-brand/20 flex items-center justify-between">
                    <span className="text-gray-600">Tracking Number:</span>
                    <span className="font-mono font-bold text-gray-900">{order.tracking_number}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <SizingGuideModal isOpen={isSizingModalOpen} onClose={() => setIsSizingModalOpen(false)} />
    </div>
  )
}
