import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { Toaster } from 'react-hot-toast'
import CustomCursor from '@/components/CustomCursor'
import { AuthProvider } from '@/components/UserContext'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'GnG',
  description: 'Premium handcrafted press-on nail sets for the modern woman.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans bg-[#FAFAFA] min-h-screen relative`}>
        <CustomCursor />
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster position="top-center" toastOptions={{ style: { borderRadius: '12px', background: '#333', color: '#fff', fontFamily: 'inherit' } }} />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
