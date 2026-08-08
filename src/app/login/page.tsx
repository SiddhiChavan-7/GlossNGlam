'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useAuth } from '@/components/UserContext'

export default function LoginPage() {
  const router = useRouter()
  const { refreshUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()

      if (res.ok && data.success) {
        toast.success('Welcome back!')
        await refreshUser()
        router.push('/')
      } else {
        toast.error(data.error || 'Failed to log in')
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pt-32 px-4 items-center">
      <div className="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(224,17,95,0.08)] border border-pink-100">
        <h1 className="text-3xl font-serif text-brandtext mb-2 text-center">Welcome Back</h1>
        <p className="text-gray-500 text-sm text-center mb-8">Sign in to your GlossNails account.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 block">Email Address</label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all"
              placeholder="emma@example.com"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 block">Password</label>
            <input
              type="password" required value={password} onChange={e => setPassword(e.target.value)} minLength={6}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-brand text-white py-4 rounded-full font-bold shadow-[0_4px_20px_rgba(224,17,95,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(224,17,95,0.4)] transition-all disabled:opacity-70 mt-4"
          >
            {loading ? 'Logging in...' : 'LOGIN'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          Don't have an account? <Link href="/register" className="text-brand font-semibold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  )
}
