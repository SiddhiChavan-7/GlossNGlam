'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Mail, Instagram, MessageCircle, Clock, MapPin, Send, Sparkles, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    topic: 'Sizing Assistance',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      toast.success('Message sent! Our nail artists will reply shortly ✨')
    }, 700)
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-8 py-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-100 text-brand text-xs font-bold uppercase tracking-wider rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" /> We&apos;d Love to Hear From You
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Contact Gloss & Glam
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Have a custom design request, sizing question, or bridal order? We&apos;re here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Contact Cards */}
          <div className="space-y-4">
            {/* Instagram Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-md">
                <Instagram className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">Instagram Direct Message</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Fastest response for coin-sizing photos, design inspiration, and shape advice.
              </p>
              <a
                href="https://ig.me/m/_glossnglam8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:text-brand-dark transition-colors"
              >
                <span>DM @_glossnglam8 →</span>
              </a>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-pink-50 text-brand flex items-center justify-center border border-pink-100">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">Official Email Support</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                For order invoices, corporate gifting, or formal assistance.
              </p>
              <a
                href="mailto:glossnglam8@gmail.com"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:text-brand-dark transition-colors"
              >
                <span>glossnglam8@gmail.com →</span>
              </a>
            </div>

            {/* Hours & Location Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-gray-100 text-gray-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">Working Hours</h3>
              <div className="text-xs text-gray-500 space-y-1">
                <p><span className="font-semibold text-gray-700">Mon – Sat:</span> 10:00 AM – 7:00 PM IST</p>
                <p><span className="font-semibold text-gray-700">Sundays:</span> Limited emergency order support</p>
                <p><span className="font-semibold text-gray-700">Location:</span> Handcrafted Studio, India</p>
              </div>
            </div>
          </div>

          {/* Interactive Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm">
            {isSubmitted ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Message Received!</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{form.name}</strong>. Our nail artists have received your note and will get back to you at <strong>{form.email}</strong> within 2 to 4 business hours.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false)
                    setForm({ name: '', email: '', phone: '', topic: 'Sizing Assistance', message: '' })
                  }}
                  className="mt-4 px-6 py-2.5 rounded-full text-xs font-semibold bg-gray-900 text-white hover:bg-brand transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Send Us a Direct Message</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Fill in your details and our team will get in touch directly.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Your Full Name <span className="text-brand">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Siddhi Nitin"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Email Address <span className="text-brand">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="you@gmail.com"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Phone / WhatsApp Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Inquiry Topic
                    </label>
                    <select
                      value={form.topic}
                      onChange={e => setForm({ ...form, topic: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 bg-white"
                    >
                      <option value="Sizing Assistance">Nail Sizing & Measurements Help</option>
                      <option value="Custom Nail Inspo">Bespoke / Custom Nail Design Request</option>
                      <option value="Order Tracking">Order Status & Courier Tracking</option>
                      <option value="Bridal & Bulk">Bridal Party or Bulk Order</option>
                      <option value="General Question">General Inquiry / Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Your Message <span className="text-brand">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your nail shape preferences, sizing questions, or custom set ideas..."
                    className="w-full text-xs p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-brand hover:bg-brand-dark text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

