export interface Product {
  id: string
  name: string
  price: number
  description: string
  image_url: string
  category_id: string
  in_stock: boolean
  show_on_home?: boolean
  nail_shapes: string[]
  gallery_urls?: string[]
  created_at: string
  categories?: { name: string; slug: string }
}

export interface Order {
  id: string
  customer_name: string
  phone: string
  email: string
  instagram: string
  address: string
  pincode: string
  city: string
  state: string
  total_amount: number
  payment_status: string
  payment_id: string
  order_note: string
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  price: number
  quantity: number
  nail_shape: string
  nail_size: string
}

export interface CartItem {
  product: Product
  quantity: number
  nail_shape: string
  nail_size: string
  isFreeGift?: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
}

export interface PromoCode {
  id: string
  code: string
  discount_percent: number
  is_active: boolean
}
