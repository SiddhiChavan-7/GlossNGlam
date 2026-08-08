'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import { supabase } from '@/lib/supabase'
import { Upload, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function AdminCatalogPage() {
  const router = useRouter()
  const [catalogUrl, setCatalogUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!localStorage.getItem('admin-auth')) { router.push('/admin/login'); return }
    // Fetch the current catalog image using a predictable name
    const { data } = supabase.storage.from('product-images').getPublicUrl('giveaway-catalog.jpg')
    // Added a timestamp to bust the browser cache, but only on initial load
    setCatalogUrl(`${data.publicUrl}?t=${Date.now()}`)
  }, [router])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)

    // We overwrite the same file name 'giveaway-catalog.jpg' so we don't need a database table!
    const { error } = await supabase.storage.from('product-images').upload('giveaway-catalog.jpg', file, {
      upsert: true,
      cacheControl: '10' // Keep cache short
    })

    if (error) { 
      toast.error('Catalog upload failed. Note: ensure bucket policy allows upsert.')
      setUploading(false)
      return 
    }
    
    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl('giveaway-catalog.jpg')
    setCatalogUrl(`${urlData.publicUrl}?t=${Date.now()}`) // Cache buster
    setUploading(false)
    toast.success('Catalog updated successfully!')
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Giveaway Settings & Catalog</h1>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 max-w-2xl">
          <h2 className="text-lg font-semibold text-white mb-2">Signature Solids Catalog</h2>
          <p className="text-sm text-gray-400 mb-6">
            Upload the reference image showing the available solid colors for the free gift. 
            Customers will see this image when selecting their custom color.
          </p>

          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-700 rounded-2xl h-80 flex flex-col items-center justify-center cursor-pointer hover:border-brand transition-colors relative overflow-hidden group"
          >
            {catalogUrl && !uploading ? (
              <>
                <Image src={catalogUrl} alt="Catalog Preview" fill className="object-cover group-hover:opacity-40 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-gray-900/80 px-4 py-2 rounded-lg flex items-center gap-2 text-white text-sm font-medium">
                    <Upload className="w-4 h-4" /> Replace Image
                  </div>
                </div>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-500 mb-3" />
                <span className="text-sm text-gray-400">{uploading ? 'Uploading securely to Supabase...' : 'Click to upload catalog image'}</span>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

          <div className="mt-6 bg-brand/10 border border-brand/20 p-4 rounded-xl flex items-start gap-3">
            <div className="text-brand text-xl">✨</div>
            <div>
              <h3 className="text-brand font-medium text-sm">Pro Tip</h3>
              <p className="text-gray-400 text-xs mt-1">
                For best results, upload a 16:9 or square high-resolution image showing the palette clearly with name/number labels. 
                This helps customers select their custom color accurately on the /claim-gift page.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
