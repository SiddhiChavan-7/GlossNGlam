'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { Product, Category } from '@/lib/types'
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'

const SHAPES = ['almond', 'stiletto', 'coffin', 'square', 'round', 'oval']
const emptyForm = { name: '', price: '', description: '', category_id: '', new_category_name: '', in_stock: true, nail_shapes: ['almond', 'stiletto', 'coffin', 'square'], image_url: '', gallery_urls: [] as string[] }

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!localStorage.getItem('admin-auth')) { router.push('/admin/login'); return }
    loadData()
  }, [router])

  const loadData = async () => {
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from('products').select('*, categories(name, slug)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*'),
    ])
    setProducts(p || [])
    setCategories(c || [])
  }

  const openAdd = () => { setEditProduct(null); setForm(emptyForm); setShowModal(true) }
  const openEdit = (p: Product) => {
    setEditProduct(p)
    setForm({ name: p.name, price: String(p.price), description: p.description || '', category_id: p.category_id || '', new_category_name: '', in_stock: p.in_stock, nail_shapes: p.nail_shapes || [], image_url: p.image_url || '', gallery_urls: p.gallery_urls || [] })
    setShowModal(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    
    try {
      const urls: string[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const ext = file.name.split('.').pop()
        const fileName = `${Date.now()}_${i}.${ext}`
        const { error } = await supabase.storage.from('product-images').upload(fileName, file)
        
        if (error) throw error
        
        const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName)
        urls.push(urlData.publicUrl)
      }

      setForm(prev => {
        const newGallery = [...prev.gallery_urls, ...urls]
        // If image_url is empty, set the first uploaded image as the main one
        return {
          ...prev,
          image_url: prev.image_url || urls[0],
          gallery_urls: newGallery
        }
      })
      toast.success('Images uploaded!')
    } catch {
      toast.error('Image upload failed. Ensure bucket exists and has correct policies.')
    } finally {
      setUploading(false)
    }
  }

  const removeGalleryImage = (index: number) => {
    setForm(prev => {
      const newUrls = [...prev.gallery_urls]
      newUrls.splice(index, 1)
      return { ...prev, gallery_urls: newUrls, image_url: newUrls.length > 0 ? newUrls[0] : '' }
    })
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
    if (!form.name || !form.price) { toast.error('Name and price are required'); return }
    setSaving(true)
    const payload = { ...form, price: parseInt(form.price) }
    const res = await fetch('/api/products', {
      method: editProduct ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editProduct ? { id: editProduct.id, ...payload } : payload),
    })
    if (res.ok) {
      toast.success(editProduct ? 'Product updated!' : 'Product added!')
      setShowModal(false)
      loadData()
    } else toast.error('Something went wrong')
    setSaving(false)
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
            <div key={product.id} className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              <div className="relative h-48 bg-gray-800">
                {product.image_url && (product.image_url.startsWith('http') || product.image_url.startsWith('/')) && (
                  <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                )}
                {!product.in_stock && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">Sold Out</div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-white font-semibold text-sm">{product.name}</h3>
                  <div className="flex gap-2 ml-2 flex-shrink-0">
                    <button onClick={() => openEdit(product)} className="p-1.5 text-gray-400 hover:text-white transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-1.5 text-gray-400 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-brand font-bold">₹{product.price.toLocaleString('en-IN')}</p>
                <p className="text-gray-500 text-xs mt-1">{product.categories?.name}</p>
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
                    <label className="text-xs text-gray-400 block">Product Images</label>
                  </div>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {form.gallery_urls.filter(url => url.startsWith('http') || url.startsWith('/')).map((url, idx) => (
                      <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-700 group">
                        <Image src={url} alt="img" fill className="object-cover" />
                        <button onClick={() => removeGalleryImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <div
                      onClick={() => fileRef.current?.click()}
                      className="w-24 h-24 border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-brand transition-colors relative"
                    >
                      <Upload className="w-5 h-5 text-gray-500 mb-1" />
                      <span className="text-[10px] text-gray-500 text-center px-1">{uploading ? 'Wait...' : 'Add More'}</span>
                    </div>
                  </div>
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

                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" checked={form.in_stock} onChange={e => setForm(prev => ({ ...prev, in_stock: e.target.checked }))} className="sr-only" />
                    <div className={`w-10 h-6 rounded-full transition-colors ${form.in_stock ? 'bg-brand' : 'bg-gray-700'}`} />
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${form.in_stock ? 'translate-x-5' : 'translate-x-1'}`} />
                  </div>
                  <span className="text-sm text-gray-300">In Stock</span>
                </label>

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
