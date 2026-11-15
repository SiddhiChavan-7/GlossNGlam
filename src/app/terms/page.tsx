import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { FileText, Sparkles, Scale, AlertCircle, HelpCircle } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service | Gloss n Glam',
  description: 'Terms and conditions governing the use of the Gloss n Glam online store and press-on nail purchases.'
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-100 text-brand text-xs font-bold uppercase tracking-wider rounded-full mb-3">
            <FileText className="w-3.5 h-3.5" /> Customer Agreement
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Terms & Conditions of Service
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Last updated: November 2026 • Please read carefully before purchasing
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 space-y-8 text-sm text-gray-700 leading-relaxed">
          <p>
            By accessing or shopping from <strong>Gloss n Glam</strong> (&ldquo;Website&rdquo;, &ldquo;Store&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;), you agree to be bound by the following Terms & Conditions. If you do not agree to all terms, please refrain from using our services.
          </p>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand" />
              <span>1. Handcrafted Artisanal Disclaimer</span>
            </h2>
            <p>
              Every set of press-on nails from Gloss n Glam is individually handcrafted by skilled nail artists using professional soft-gel tips, salon gel polishes, and cured UV topcoats. Because every tip is painted and embellished by hand:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li>Minor variations in chrome effects, marble gradients, hand-drawn linework, or crystal placements may occur. These organic nuances reflect genuine handcrafted craftsmanship and do not constitute defects.</li>
              <li>Product photography is captured under controlled studio and natural lighting; display calibrations across various phone and computer screens may slightly alter perceived color tones.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-brand" />
              <span>2. Sizing Accuracy & Fit Responsibility</span>
            </h2>
            <p>
              To ensure the most comfortable, salon-grade wear, each customer is responsible for selecting or submitting accurate nail sizes (XS, S, M, L, XL, or custom millimeter widths):
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li>Gloss n Glam provides a digital millimeter sizing guide and complimentary Coin-Photo sizing verification on Instagram (<strong>@_glossnglam8</strong>).</li>
              <li>We cannot offer refunds, replacements, or exchanges for sets crafted according to sizes incorrectly selected by the customer.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-brand" />
              <span>3. Order Pricing, Payments & Taxes</span>
            </h2>
            <p>
              All prices listed on the website are displayed in <strong>Indian Rupees (INR ₹)</strong>. We reserve the right to revise product prices, promotional discounts, and shipping tariffs at any time without prior notice.
            </p>
            <p>
              All online payments must be completed at checkout via Razorpay (UPI, Cards, NetBanking, or Wallets). Orders are placed into the crafting queue once payment authorization is confirmed.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-brand" />
              <span>4. Application, Care & Safety</span>
            </h2>
            <p>
              Every Gloss n Glam order includes a complimentary prep application kit (salon nail glue, adhesive jelly tabs, mini buffer, alcohol wipe, and cuticle pusher).
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li>Please follow the provided prep instructions closely to achieve 2 to 3 weeks of wear.</li>
              <li>Keep nail glue away from eyes, open wounds, and out of reach of small children. Gloss n Glam is not liable for improper application, allergic reactions to cyanoacrylate glue, or damage caused by forceful removal without proper soaking.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand" />
              <span>5. Intellectual Property & Governing Law</span>
            </h2>
            <p>
              All website content, photography, branding, logo assets, visual nail art designs, and copy are the proprietary intellectual property of Gloss n Glam. Reproduction or unauthorized commercial exploitation is strictly prohibited.
            </p>
            <p>
              These Terms & Conditions are governed by and construed in accordance with the laws of <strong>India</strong>. Any disputes shall be subject to the exclusive jurisdiction of the competent courts in India.
            </p>
          </section>

          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <span>Questions regarding our terms? Email <strong>glossnglam8@gmail.com</strong></span>
            <Link href="/catalog" className="text-brand font-semibold hover:underline">
              Browse All Nail Sets →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

