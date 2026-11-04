'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminIndexPage() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuth = localStorage.getItem('admin-auth')
      if (isAuth) {
        router.replace('/admin/dashboard')
      } else {
        router.replace('/admin/login')
      }
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
