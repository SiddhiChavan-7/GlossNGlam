import { Product } from './types';

export const mockCategories = [
  { id: '1', name: 'All', slug: 'all' },
  { id: '2', name: 'Solo Sets', slug: 'solo-sets' },
  { id: '3', name: 'Valentine\'s', slug: 'valentines' },
  { id: '4', name: 'Glam', slug: 'glam' },
  { id: '5', name: 'Minimal', slug: 'minimal' },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Bloody Moon',
    price: 1499,
    description: 'Dark red dramatic press-on set. Perfect for bold looks.',
    image_url: '/products/bloody_moon.png',
    category_id: '2',
    categories: mockCategories[1],
    in_stock: true,
    nail_shapes: ['almond', 'stiletto', 'coffin', 'square'],
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Cosmic Aura',
    price: 1999,
    description: 'Teal holographic press-on set. Out of this world.',
    image_url: '/products/cosmic_aura.png',
    category_id: '4',
    categories: mockCategories[3],
    in_stock: true,
    nail_shapes: ['almond', 'stiletto', 'coffin', 'square'],
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Pink Love Spell',
    price: 1499,
    description: 'Soft pink with glitter tips. Romantic and dreamy.',
    image_url: '/products/pink_love.png',
    category_id: '3',
    categories: mockCategories[2],
    in_stock: true,
    nail_shapes: ['almond', 'stiletto', 'coffin', 'square'],
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'V-Day 1',
    price: 1399,
    description: 'Valentine special — nude with heart details.',
    image_url: '/products/v_day.png',
    category_id: '3',
    categories: mockCategories[2],
    in_stock: true,
    nail_shapes: ['almond', 'stiletto', 'coffin', 'square'],
    created_at: new Date().toISOString()
  }
];

export const mockOrders = [
  { id: '1', customer_name: 'Aditi Sharma', phone: '9876543210', email: 'aditi@example.com', instagram: '@aditi.nails', address: '123 Fashion St', pincode: '400001', city: 'Mumbai', state: 'MH', total_amount: 2998, payment_status: 'paid', payment_id: 'pay_ABC123', order_note: 'Size S', created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: '2', customer_name: 'Priya Patel', phone: '9876543211', email: 'priya@example.com', instagram: '', address: '45 Lotus Tower', pincode: '380001', city: 'Ahmedabad', state: 'GJ', total_amount: 1499, payment_status: 'pending', payment_id: '', order_note: 'Custom: 14, 11, 12, 11, 8', created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: '3', customer_name: 'Neha Gupta', phone: '9876543212', email: 'neha@example.com', instagram: '@nehaslays', address: '78 Rose Ave', pincode: '110001', city: 'Delhi', state: 'DL', total_amount: 3398, payment_status: 'paid', payment_id: 'pay_DEF456', order_note: '', created_at: new Date(Date.now() - 86400000 * 10).toISOString() },
  { id: '4', customer_name: 'Anjali Rao', phone: '9876543213', email: 'anjali@example.com', instagram: '', address: '10 HSR Layout', pincode: '560102', city: 'Bangalore', state: 'KA', total_amount: 1999, payment_status: 'paid', payment_id: 'pay_XYZ987', order_note: 'Shape: Coffin', created_at: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: '5', customer_name: 'Sneha Reddy', phone: '9876543214', email: 'sneha@example.com', instagram: '@snehamakeup', address: 'Plot 5 Jubilee Hills', pincode: '500033', city: 'Hyderabad', state: 'TS', total_amount: 1499, payment_status: 'paid', payment_id: 'pay_LMN654', order_note: '', created_at: new Date().toISOString() },
];
