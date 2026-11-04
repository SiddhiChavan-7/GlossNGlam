'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'

import { Product, Category } from '@/lib/types'
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'

const SHAPES = ['almond', 'stiletto', 'coffin', 'square', 'round', 'oval']
const emptyForm = {
  name: '',
  price: '',
  description: '',
  category_id: '',
  new_category_name: '',
  in_stock: true,
  show_on_home: true,
  nail_shapes: ['almond', 'stiletto', 'coffin', 'square'],
  image_url: '',
  gallery_urls: [] as string[]
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!localStorage.getItem('admin-auth')) { router.push('/admin/login'); return }
    loadData()
  }, [router])

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products').then(r => r.json()).catch(() => []),
        fetch('/api/products/categories').then(r => r.json()).catch(() => [])
      ])
      setProducts(Array.isArray(productsRes) ? productsRes : [])
      setCategories(Array.isArray(categoriesRes) ? categoriesRes : [])
    } catch {
      toast.error('Failed to load products')
    }
  }

  const toggleShowOnHome = async (p: Product) => {
    const nextVal = p.show_on_home === false ? true : false
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id, show_on_home: nextVal })
      })
      if (res.ok) {
        toast.success(nextVal ? `"${p.name}" will show on Main Page` : `"${p.name}" moved to Catalog Only`)
        loadData()
      } else {
        toast.error('Failed to update')
      }
    } catch {
      toast.error('Error updating visibility')
    }
  }

  const openAdd = () => {
    setEditProduct(null)
    setForm(emptyForm)
    setUrlInput('')
    setUploadProgress('')
    setShowModal(true)
  }

  const openEdit = (p: Product) => {
    setEditProduct(p)
    const existingGallery = (p.gallery_urls && p.gallery_urls.length > 0)
      ? p.gallery_urls
      : (p.image_url ? [p.image_url] : [])
    setForm({
      name: p.name,
      price: String(p.price),
      description: p.description || '',
      category_id: p.category_id || '',
      new_category_name: '',
      in_stock: p.in_stock,
      show_on_home: p.show_on_home !== false,
      nail_shapes: p.nail_shapes || [],
      image_url: p.image_url || existingGallery[0] || '',
      gallery_urls: existingGallery
    })
    setUrlInput('')
    setUploadProgress('')
    setShowModal(true)
  }

  const handleAddUrl = () => {
    const url = urlInput.trim()
    if (!url) return
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
      toast.error('Please enter a valid image URL (e.g. https://...)')
      return
    }
    setForm(prev => ({
      ...prev,
      image_url: prev.image_url || url,
      gallery_urls: [...prev.gallery_urls, url]
    }))
    setUrlInput('')
    toast.success('Image URL added!')
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)

    const urls: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        setUploadProgress(`Uploading ${i + 1} of ${files.length}...`)
        const file = files[i]
        const fd = new FormData()
        fd.append('file', file)

        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json()

        if (!res.ok) throw new Error(data.error || 'Upload failed')
        urls.push(data.url)
      }

      if (urls.length > 0) {
        setForm(prev => {
          const newGallery = [...prev.gallery_urls, ...urls]
          return {
            ...prev,
            image_url: prev.image_url || urls[0],
            gallery_urls: newGallery
          }
        })
        toast.success(`${urls.length} image${urls.length > 1 ? 's' : ''} uploaded!`)
      }
    } catch (err: any) {
      toast.error(err.message || 'Image upload failed.')
    } finally {
      setUploading(false)
      setUploadProgress('')
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const removeGalleryImage = (index: number) => {
    setForm(prev => {
      const newUrls = [...prev.gallery_urls]
      const removed = newUrls.splice(index, 1)[0]
      const nextPrimary = prev.image_url === removed
        ? (newUrls[0] || '')
        : (newUrls.includes(prev.image_url) ? prev.image_url : (newUrls[0] || ''))
      return { ...prev, gallery_urls: newUrls, image_url: nextPrimary }
    })
  }

  const setAsCoverImage = (url: string) => {
    setForm(prev => ({
      ...prev,
      image_url: url
    }))
    toast.success('Set as primary cover image')
  }

  const toggleShape = (shape: string) => {
    setForm(prev => ({
      ...prev,
      nail_shapes: prev.nail_shapes.includes(shape)
        ? prev.nail_shapes.filter(s => s !== shape)
        : [...prev.nail_shapes, shape]
    }))
  }

  const handleSave = async () => {
    const name = form.name.trim()
    const price = parseInt(form.price, 10)

    if (!name) { toast.error('Product name is required'); return }
    if (isNaN(price) || price < 0) { toast.error('Valid price is required'); return }
    if (!form.category_id || (form.category_id === 'NEW' && !form.new_category_name.trim())) {
      toast.error('Category is required')
      return
    }

    setSaving(true)
    const primaryImage = form.image_url || form.gallery_urls[0] || ''
    const payload = {
      ...form,
      name,
      price,
      image_url: primaryImage,
      gallery_urls: form.gallery_urls
    }

    try {
      const res = await fetch('/api/products', {
        method: editProduct ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editProduct ? { id: editProduct.id, ...payload } : payload),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(editProduct ? 'Product updated!' : 'Product added!')
        setShowModal(false)
        loadData()
      } else {
        toast.error(data.error || 'Something went wrong')
      }
    } catch (err: any) {
      toast.error(err.message || 'Error saving product')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    const res = await fetch('/api/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    if (res.ok) { toast.success('Deleted!'); loadData() }
    else toast.error('Delete failed')
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <button onClick={openAdd} className="flex items-center gap-2 bg-brand text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product.id} className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden flex flex-col">
              <div className="relative h-48 bg-gray-800 flex items-center justify-center overflow-hidden">
                {product.image_url && (product.image_url.startsWith('http') || product.image_url.startsWith('/')) ? (
                  <Image src={product.image_url} alt={product.name} fill unoptimized className="object-cover" />
                ) : (
                  <div className="text-gray-600 text-xs flex flex-col items-center gap-1">
                    <Upload className="w-6 h-6 text-gray-600" />
                    <span>No image</span>
                  </div>
                )}
                <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                  {!product.in_stock && (
                    <div className="bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow">Sold Out</div>
                  )}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); toggleShowOnHome(product) }}
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shadow transition-all ${
                      product.show_on_home !== false
                        ? 'bg-emerald-600/90 hover:bg-emerald-500 text-white'
                        : 'bg-gray-800/90 hover:bg-gray-700 text-gray-300'
                    }`}
                    title="Click to toggle Main Page visibility"
                  >
                    {product.show_on_home !== false ? '✓ On Main Page' : 'Catalog Only'}
                  </button>
                </div>
                {product.gallery_urls && product.gallery_urls.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[11px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {product.gallery_urls.length} photos
                  </div>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-white font-semibold text-sm">{product.name}</h3>
                    <div className="flex gap-2 ml-2 flex-shrink-0">
                      <button onClick={() => openEdit(product)} className="p-1.5 text-gray-400 hover:text-white transition-colors" title="Edit">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-1.5 text-gray-400 hover:text-red-400 transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-brand font-bold">₹{product.price.toLocaleString('en-IN')}</p>
                </div>
                <p className="text-gray-500 text-xs mt-2">{product.categories?.name || 'Uncategorized'}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <h2 className="text-white font-semibold">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {/* Image upload */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-gray-400 block font-medium">Product Images</label>
                    <span className="text-[11px] text-gray-500">First image or selected cover is main</span>
                  </div>

                  {/* Add by URL option */}
                  <div className="flex gap-2 mb-3">
                    <input
                      type="url"
                      placeholder="Or paste direct image URL (https://...)"
                      value={urlInput}
                      onChange={e => setUrlInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddUrl() } }}
                      className="flex-1 px-3 py-2 bg-gray-800 text-white rounded-xl text-xs border border-gray-700 focus:outline-none focus:border-brand placeholder-gray-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddUrl}
                      className="px-3.5 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-medium border border-gray-700 transition-colors shrink-0"
                    >
                      + Add URL
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-2">
                    {form.gallery_urls.filter(url => url && (url.startsWith('http') || url.startsWith('/'))).map((url, idx) => {
                      const isCover = (form.image_url === url) || (!form.image_url && idx === 0)
                      return (
                        <div key={idx} className={`relative w-24 h-24 rounded-lg overflow-hidden border ${isCover ? 'border-brand ring-2 ring-brand/50' : 'border-gray-700'} group`}>
                          <Image src={url} alt="img" fill unoptimized className="object-cover" />
                          {isCover && (
                            <span className="absolute bottom-1 left-1 bg-brand text-[9px] text-white font-semibold px-1.5 py-0.5 rounded shadow z-10">
                              Cover
                            </span>
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                            {!isCover && (
                              <button
                                type="button"
                                onClick={() => setAsCoverImage(url)}
                                className="bg-brand text-white text-[10px] font-medium px-2 py-0.5 rounded shadow hover:opacity-90"
                              >
                                Set Cover
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(idx)}
                              className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow"
                              title="Delete image"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                    <div
                      onClick={() => !uploading && fileRef.current?.click()}
                      className={`w-24 h-24 border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-brand transition-colors relative ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <Upload className={`w-5 h-5 mb-1 ${uploading ? 'text-brand animate-pulse' : 'text-gray-500'}`} />
                      <span className="text-[10px] text-gray-500 text-center px-1 font-medium">
                        {uploading ? (uploadProgress || 'Uploading...') : '+ Add Photos'}
                      </span>
                    </div>
                  </div>

                  {uploadProgress && (
                    <p className="text-xs text-brand animate-pulse mb-2">{uploadProgress}</p>
                  )}

                  <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>

                {[
                  { label: 'Product Name *', key: 'name', type: 'text' },
                  { label: 'Price (₹) *', key: 'price', type: 'number' },
                  { label: 'Description', key: 'description', type: 'text' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-xs text-gray-400 mb-1.5 block">{field.label}</label>
                    <input
                      type={field.type}
                      value={(form as any)[field.key]}
                      onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-gray-800 text-white rounded-xl text-sm border border-gray-700 focus:outline-none focus:border-brand"
                    />
                  </div>
                ))}

                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Category</label>
                  <select
                    value={form.category_id}
                    onChange={e => setForm(prev => ({ ...prev, category_id: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-gray-800 text-white rounded-xl text-sm border border-gray-700 focus:outline-none focus:border-brand mb-2"
                  >
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    <option value="NEW" className="font-bold text-brand">+ Add New Category</option>
                  </select>
                  
                  {form.category_id === 'NEW' && (
                    <input
                      type="text"
                      placeholder="Type new category name..."
                      value={form.new_category_name}
                      onChange={e => setForm(prev => ({ ...prev, new_category_name: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-gray-800 text-white rounded-xl text-sm border border-brand focus:outline-none shadow-[0_0_15px_rgba(224,17,95,0.2)] placeholder:text-gray-500"
                      autoFocus
                    />
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Nail Shapes Available</label>
                  <div className="flex flex-wrap gap-2">
                    {SHAPES.map(shape => (
                      <button
                        key={shape}
                        type="button"
                        onClick={() => toggleShape(shape)}
                        className={`px-3 py-1.5 rounded-full text-xs capitalize border transition-all ${
                          form.nail_shapes.includes(shape) ? 'bg-brand text-white border-brand' : 'border-gray-700 text-gray-400 hover:border-gray-500'
                        }`}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-800 rounded-xl border border-gray-700">
                    <div className="relative">
                      <input type="checkbox" checked={form.in_stock} onChange={e => setForm(prev => ({ ...prev, in_stock: e.target.checked }))} className="sr-only" />
                      <div className={`w-10 h-6 rounded-full transition-colors ${form.in_stock ? 'bg-brand' : 'bg-gray-700'}`} />
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${form.in_stock ? 'translate-x-5' : 'translate-x-1'}`} />
                    </div>
                    <div>
                      <span className="text-xs text-white font-medium block">In Stock</span>
                      <span className="text-[10px] text-gray-400">Available to order</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-800 rounded-xl border border-gray-700">
                    <div className="relative">
                      <input type="checkbox" checked={form.show_on_home} onChange={e => setForm(prev => ({ ...prev, show_on_home: e.target.checked }))} className="sr-only" />
                      <div className={`w-10 h-6 rounded-full transition-colors ${form.show_on_home ? 'bg-emerald-500' : 'bg-gray-700'}`} />
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${form.show_on_home ? 'translate-x-5' : 'translate-x-1'}`} />
                    </div>
                    <div>
                      <span className="text-xs text-white font-medium block">Show on Main Page</span>
                      <span className="text-[10px] text-gray-400">Featured on Homepage</span>
                    </div>
                  </label>
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full py-3 bg-brand text-white rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-opacity"
                >
                  {saving ? 'Saving...' : editProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
