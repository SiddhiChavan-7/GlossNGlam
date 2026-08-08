'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (
      email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
      (email === 'admin@glossnails.com' && password === 'admin123')
    ) {
      localStorage.setItem('admin-auth', 'true')
      router.push('/admin/dashboard')
    } else if (
      email.includes('@') &&
      password.length >= 6
    ) {
      // Check env vars
      fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      }).then(r => r.json()).then(d => {
        if (d.success) {
          localStorage.setItem('admin-auth', 'true')
          router.push('/admin/dashboard')
        } else {
          toast.error('Invalid credentials')
          setLoading(false)
        }
      }).catch(() => {
        toast.error('Invalid email or password')
        setLoading(false)
      })
    } else {
      toast.error('Invalid email or password')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">GlossNails</h1>
          <p className="text-gray-400 text-sm mt-1">Admin Panel</p>
        </div>
        <form onSubmit={handleLogin} className="bg-gray-900 rounded-2xl p-8 space-y-4">
          <div>
            <label className="text-xs text-gray-400 font-medium mb-1.5 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@glossnails.com"
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl text-sm border border-gray-700 focus:outline-none focus:border-brand transition-colors placeholder-gray-600"
              required
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 font-medium mb-1.5 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl text-sm border border-gray-700 focus:outline-none focus:border-brand transition-colors placeholder-gray-600"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 mt-2"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <p className="text-xs text-gray-600 text-center pt-2">
            Default: admin@glossnails.com / admin123
          </p>
        </form>
      </div>
    </div>
  )
}
