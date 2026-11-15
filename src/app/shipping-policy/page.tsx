import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Truck, Clock, ShieldCheck, MapPin, PackageCheck, AlertCircle } from 'lucide-react'

export const metadata = {
  title: 'Shipping & Delivery Policy | Gloss n Glam',
  description: 'Pan-India shipping details, delivery timelines, and tracking information for Gloss n Glam press-on nails.'
}

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-100 text-brand text-xs font-bold uppercase tracking-wider rounded-full mb-3">
            <Truck className="w-3.5 h-3.5" /> Fast Pan-India Delivery
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Shipping & Delivery Policy
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Last updated: November 2026 • Verified for safe & timely transit across India
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 space-y-8 text-sm text-gray-700 leading-relaxed">
          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-gray-100 text-center">
            <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100">
              <Clock className="w-5 h-5 text-brand mx-auto mb-2" />
              <p className="font-bold text-gray-900 text-xs uppercase tracking-wider">Processing Time</p>
              <p className="text-xs text-gray-600 mt-1">24 to 48 Hours (Handcrafted)</p>
            </div>
            <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100">
              <MapPin className="w-5 h-5 text-brand mx-auto mb-2" />
              <p className="font-bold text-gray-900 text-xs uppercase tracking-wider">Delivery Time</p>
              <p className="text-xs text-gray-600 mt-1">4 to 7 Business Days</p>
            </div>
            <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100">
              <PackageCheck className="w-5 h-5 text-brand mx-auto mb-2" />
              <p className="font-bold text-gray-900 text-xs uppercase tracking-wider">Free Shipping</p>
              <p className="text-xs text-gray-600 mt-1">On all orders over ₹599</p>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>1. Order Processing & Crafting</span>
            </h2>
            <p>
              Every set at <strong>Gloss n Glam</strong> is hand-sculpted, primed, painted, and finished with salon-grade gel overlays. Because each set is handcrafted to your exact shape and size specifications:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Standard orders take <strong>24 to 48 hours</strong> to prepare and pack securely.</li>
              <li>Custom sizing or intricate 3D chrome/charm designs may take up to <strong>72 hours</strong> prior to dispatch.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>2. Delivery Timelines & Shipping Rates</span>
            </h2>
            <p>
              We partner with India&apos;s leading logistics providers (including BlueDart, Delhivery, DTDC, and India Post Speed Post) to reach every pincode safely.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-gray-100 rounded-xl overflow-hidden">
                <thead className="bg-gray-50 text-gray-700 font-bold">
                  <tr>
                    <th className="p-3 border-b border-gray-100">Destination</th>
                    <th className="p-3 border-b border-gray-100">Estimated Delivery Time</th>
                    <th className="p-3 border-b border-gray-100">Shipping Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600">
                  <tr>
                    <td className="p-3 font-medium">Metro Cities (Mumbai, Delhi, Bengaluru, etc.)</td>
                    <td className="p-3">3 to 5 Business Days</td>
                    <td className="p-3 font-semibold text-brand">FREE on orders ≥ ₹599 (Flat ₹60 below)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Rest of India (Tier 2 & 3 Cities)</td>
                    <td className="p-3">4 to 7 Business Days</td>
                    <td className="p-3 font-semibold text-brand">FREE on orders ≥ ₹599 (Flat ₹60 below)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Remote & North-East Locations</td>
                    <td className="p-3">6 to 9 Business Days</td>
                    <td className="p-3 font-semibold text-brand">FREE on orders ≥ ₹599 (Flat ₹60 below)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>3. Order Tracking</span>
            </h2>
            <p>
              As soon as your parcel is handed over to our courier partner, you will receive an automatic dispatch confirmation email and SMS containing your live Tracking AWB Number and courier link to monitor real-time progress.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>4. Damaged or Lost in Transit</span>
            </h2>
            <p>
              All sets are encased in cushioned packaging to withstand transit. In the rare event that your package is visibly tampered with or damaged upon arrival:
            </p>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900 text-xs">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-1">Transit Protection Guarantee</p>
                <p>
                  Please take a clear photo/video of the outer packaging and damaged contents, and notify us via Instagram DM (<strong>@_glossnglam8</strong>) or email (<strong>glossnglam8@gmail.com</strong>) within <strong>48 hours</strong> of delivery. We will remake and express-ship a fresh replacement set at no cost to you.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>5. Correct Address & Contact Information</span>
            </h2>
            <p>
              Please verify your complete postal address (including flat/house number, street name, landmark, and 6-digit postal pincode) as well as your active phone number. Gloss n Glam is not responsible for delayed deliveries caused by incorrect or incomplete address details provided during checkout.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

