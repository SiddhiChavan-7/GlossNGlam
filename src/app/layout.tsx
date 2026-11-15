import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'
import { Toaster } from 'react-hot-toast'
import CustomCursor from '@/components/CustomCursor'
import { AuthProvider } from '@/components/UserContext'
import AuthPromptModal from '@/components/AuthPromptModal'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'GnG',
  description: 'Premium handcrafted press-on nail sets for the modern woman.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans bg-[#FAFAFA] min-h-screen relative`}>
        <CustomCursor />
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              {children}
              <AuthPromptModal />
              <Toaster position="top-center" toastOptions={{ style: { borderRadius: '12px', background: '#333', color: '#fff', fontFamily: 'inherit' } }} />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
