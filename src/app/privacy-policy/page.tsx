import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ShieldCheck, Lock, EyeOff, Database, BellRing, Mail } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | Gloss n Glam',
  description: 'How Gloss n Glam collects, safeguards, and respects your personal information and online payment security.'
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-100 text-brand text-xs font-bold uppercase tracking-wider rounded-full mb-3">
            <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Secured
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Last updated: November 2026 • Compliant with Information Technology Act & Digital Personal Data Protection Act
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 space-y-8 text-sm text-gray-700 leading-relaxed">
          <p>
            Welcome to <strong>Gloss n Glam</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). We are committed to safeguarding the privacy and security of your personal data. This Privacy Policy outlines how your personal information is collected, used, and protected when you visit or make a purchase from our website.
          </p>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-brand" />
              <span>1. Information We Collect</span>
            </h2>
            <p>
              When you interact with our website or place an order, we collect information necessary to fulfill your purchase and provide a tailored customer experience:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li>
                <strong>Personal Identifiers:</strong> Name, phone number, email address, and optional Instagram username.
              </li>
              <li>
                <strong>Shipping Information:</strong> Physical delivery address, landmark, city, state, and postal pincode.
              </li>
              <li>
                <strong>Sizing Preferences:</strong> Millimeter measurements, preset nail sizes, and preferred nail shapes (saved to your private user dashboard).
              </li>
              <li>
                <strong>Technical & Device Data:</strong> IP address, device type, browser specifications, and anonymous browsing interactions via standard session cookies.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-brand" />
              <span>2. Payment Security & Financial Data</span>
            </h2>
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-950 text-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-1">PCI-DSS Level 1 Encrypted Processing</p>
                <p>
                  All online payments on Gloss n Glam are processed via <strong>Razorpay</strong>, India&apos;s leading RBI-authorized payment aggregator. We <strong>never store, log, or have access to your sensitive financial details</strong>, such as credit/debit card numbers, CVV codes, or UPI security PINs. All payment transactions occur over encrypted TLS/SSL channels.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-brand" />
              <span>3. How We Use & Share Your Information</span>
            </h2>
            <p>
              We treat your personal data with utmost discretion. Your information is used solely for:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li>Processing, handcrafting, and fulfilling your custom press-on nail orders.</li>
              <li>Sharing essential delivery details (Name, Address, Phone Number) with our contracted courier partners (e.g. BlueDart, Delhivery) strictly for parcel delivery.</li>
              <li>Transmitting order updates, tracking links, and digital PDF invoices.</li>
              <li>Providing sizing assistance and personalized customer support.</li>
            </ul>
            <p className="text-xs font-semibold text-gray-800 pt-1">
              🔒 We never sell, rent, monetize, or trade your personal information with third-party advertising networks.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <BellRing className="w-5 h-5 text-brand" />
              <span>4. Cookies & Local Storage</span>
            </h2>
            <p>
              We utilize browser cookies and local storage (such as your shopping bag and wishlist items) to preserve your preferences and enable seamless checkout without requiring repeated logins. You may disable cookies in your browser settings at any time; however, some interactive features (such as real-time bag updates) may require cookies to function optimally.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-brand" />
              <span>5. Your Data Rights & Grievance Contact</span>
            </h2>
            <p>
              You have the right to request access to the personal data we hold about you, request corrections, or request complete account deletion. For any privacy queries or data requests, please contact our Data Grievance Officer:
            </p>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs text-gray-600 space-y-1">
              <p><strong className="text-gray-900">Brand Name:</strong> Gloss n Glam</p>
              <p><strong className="text-gray-900">Email:</strong> glossnglam8@gmail.com</p>
              <p><strong className="text-gray-900">Instagram Support:</strong> @_glossnglam8</p>
              <p><strong className="text-gray-900">Operating Country:</strong> India</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

