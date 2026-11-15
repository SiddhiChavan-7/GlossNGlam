import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ShieldAlert, RefreshCw, CheckCircle2, AlertOctagon, HeartHandshake, Instagram } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Returns & Hygiene Policy | Gloss n Glam',
  description: 'Learn about our hygiene standards, cancellations, damaged goods replacement guarantee, and refund policy.'
}

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-100 text-brand text-xs font-bold uppercase tracking-wider rounded-full mb-3">
            <HeartHandshake className="w-3.5 h-3.5" /> 100% Quality & Hygiene Standard
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Return, Exchange & Hygiene Policy
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Last updated: November 2026 • Compliant with Consumer Protection (E-Commerce) Rules
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 space-y-8 text-sm text-gray-700 leading-relaxed">
          {/* Important Hygiene Notice Banner */}
          <div className="p-5 bg-pink-50/70 border border-pink-200 rounded-2xl flex items-start gap-3.5 text-gray-800">
            <ShieldAlert className="w-6 h-6 text-brand shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <h3 className="font-bold text-sm text-gray-900">Personal Hygiene & Sanitary Standards</h3>
              <p>
                Due to stringent personal hygiene and safety regulations for cosmetic and wearable nail products, press-on nails that have been dispatched, opened, or tried on <strong>cannot be returned or exchanged</strong> once delivered. Every nail set is handcrafted bespoke to your custom sizing and chosen shape.
              </p>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>1. Order Cancellation Policy</span>
            </h2>
            <p>
              We understand you may change your mind or need to adjust your order details. Because our nail artists begin prepping, sizing, and sculpting sets promptly:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>
                You may request a cancellation within <strong>2 hours of order placement</strong> by sending an email to <strong>glossnglam8@gmail.com</strong> or sending a DM to <strong>@_glossnglam8</strong> with your Order ID.
              </li>
              <li>
                If cancelled within the 2-hour window prior to crafting, a 100% full refund is issued back to your original payment method (processing within 5 to 7 business days).
              </li>
              <li>
                Orders that have already commenced production or have been dispatched cannot be cancelled.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>2. Damaged, Defective, or Incorrect Items (100% Free Remake)</span>
            </h2>
            <p>
              Your satisfaction is our highest priority. If your order arrives in any of the following conditions, we will remake and ship a brand new set immediately at zero charge:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs">Damaged or fractured tips incurred during courier transit.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs">Discrepancy in style or shape compared to your confirmed order.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs">Missing application kit essentials (nail glue, tabs, buffer).</span>
              </div>
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs">Significant manufacturing defect or missing charms/gems.</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 pt-1">
              <strong>How to claim:</strong> Please contact our support team within <strong>48 hours of delivery</strong> with unboxing photos/video showing the issue. We review claims within 4 business hours.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>3. Sizing Guarantee & Complimentary Sizing Support</span>
            </h2>
            <p>
              Because each set is sculpted according to the nail sizes selected at checkout (XS, S, M, L, XL, or custom measurements), Gloss n Glam cannot accept returns or provide refunds for incorrectly measured sizes selected by the customer.
            </p>
            <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-2xl flex items-start gap-3 text-purple-900 text-xs">
              <Instagram className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-1">Unsure About Your Size? Let Us Help Before You Order!</p>
                <p>
                  We offer <strong>Free Coin-Sizing Assistance</strong>. Send us 2 photos of your hand with a ₹1 or ₹5 coin next to your fingers via Instagram DM (<strong>@_glossnglam8</strong>). Our artists will verify your exact millimeter measurements for a guaranteed custom fit!
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>4. Refund Processing Timelines</span>
            </h2>
            <p>
              In cases where an authorized refund is approved:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>
                Refunds are processed automatically via <strong>Razorpay</strong> back to the customer&apos;s original method of payment (UPI, Credit/Debit Card, NetBanking, or Wallet).
              </li>
              <li>
                Funds typically reflect in your bank account within <strong>5 to 7 business days</strong> depending on your issuing bank&apos;s settlement cycle.
              </li>
            </ul>
          </section>

          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <span>Questions? Reach out to <strong>glossnglam8@gmail.com</strong></span>
            <Link href="/catalog" className="text-brand font-semibold hover:underline">
              Explore Our Collection →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

