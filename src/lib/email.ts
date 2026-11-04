import nodemailer from 'nodemailer'

const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'glossnglam8@gmail.com'

// Create reusable transporter
function getTransporter() {
  const user = process.env.SMTP_USER || process.env.GMAIL_USER || 'glossnglam8@gmail.com'
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD

  if (!pass) {
    return null
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  })
}

export interface OrderEmailItem {
  product_name: string
  nail_shape?: string
  nail_size?: string
  quantity: number
  price: number
}

export interface OrderEmailPayload {
  orderId: string
  customerName: string
  phone: string
  email: string
  instagram?: string
  address: string
  city: string
  state: string
  pincode: string
  orderNote?: string
  deliveryOption?: string
  totalAmount: number
  paymentId: string
  items: OrderEmailItem[]
}

/**
 * Send an email alert to the admin whenever a customer places an order
 */
export async function sendOrderNotificationToAdmin(data: OrderEmailPayload) {
  const transporter = getTransporter()

  const itemsHtml = data.items
    .map(
      item => `
      <tr style="border-bottom: 1px solid #f1f1f1;">
        <td style="padding: 12px 8px; font-weight: 600; color: #111;">
          ${item.product_name}
          <div style="font-size: 11px; color: #777; font-weight: 400; margin-top: 2px;">
            Shape: <strong>${item.nail_shape || 'Default'}</strong> | Size: <strong>${item.nail_size || 'Custom'}</strong>
          </div>
        </td>
        <td style="padding: 12px 8px; text-align: center; color: #555;">${item.quantity}</td>
        <td style="padding: 12px 8px; text-align: right; color: #111; font-weight: 600;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
      </tr>`
    )
    .join('')

  const instagramLink = data.instagram
    ? `<a href="https://instagram.com/${data.instagram.replace('@', '')}" style="color: #c06b72; text-decoration: none; font-weight: 600;">${data.instagram.startsWith('@') ? data.instagram : '@' + data.instagram}</a>`
    : 'Not provided'

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fbf7f7; margin: 0; padding: 24px; color: #222; }
      .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #f5e6e8; }
      .header { background: linear-gradient(135deg, #2b1318 0%, #15090b 100%); color: #fff; padding: 32px 24px; text-align: center; }
      .header h1 { margin: 0; font-size: 22px; letter-spacing: 0.05em; font-weight: 700; color: #fff; }
      .header p { margin: 6px 0 0; font-size: 13px; color: #f5b7bd; }
      .body { padding: 28px 24px; }
      .total-pill { background: #fff1f2; border: 1px solid #fed7da; border-radius: 12px; padding: 14px 18px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
      .total-amount { font-size: 22px; font-weight: 800; color: #c06b72; }
      .section-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin: 20px 0 10px; }
      .info-grid { background: #fdfafa; border-radius: 14px; padding: 16px; border: 1px solid #f3e9ea; font-size: 13px; line-height: 1.6; }
      .info-row { margin-bottom: 6px; }
      .info-label { font-weight: 600; color: #555; }
      table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 10px; }
      th { text-align: left; padding: 10px 8px; border-bottom: 2px solid #f0e6e8; color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
      .footer { text-align: center; font-size: 11px; color: #999; padding: 20px; background: #fbf7f7; border-top: 1px solid #f3e9ea; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <h1>✨ Gloss n Glam</h1>
        <p>New Order Notification</p>
      </div>
      
      <div class="body">
        <div class="total-pill">
          <div>
            <div style="font-size: 11px; color: #888; text-transform: uppercase; font-weight: 600;">Total Paid (Razorpay)</div>
            <div class="total-amount">₹${data.totalAmount.toLocaleString('en-IN')}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 11px; color: #888;">Order ID</div>
            <div style="font-size: 13px; font-weight: 700; font-family: monospace; color: #222;">#${data.orderId.slice(0, 8)}</div>
          </div>
        </div>

        <div class="section-title">Customer Information</div>
        <div class="info-grid">
          <div class="info-row"><span class="info-label">Customer:</span> ${data.customerName}</div>
          <div class="info-row"><span class="info-label">Phone:</span> <a href="tel:${data.phone}" style="color: #222; text-decoration: none; font-weight: 600;">${data.phone}</a> (<a href="https://wa.me/91${data.phone.replace(/[^0-9]/g, '').slice(-10)}" style="color: #25D366; text-decoration: none; font-weight: 600;">WhatsApp Chat</a>)</div>
          <div class="info-row"><span class="info-label">Email:</span> ${data.email}</div>
          <div class="info-row"><span class="info-label">Instagram:</span> ${instagramLink}</div>
          <div class="info-row"><span class="info-label">Shipping Address:</span> ${data.address}, ${data.city}, ${data.state} - ${data.pincode}</div>
          ${data.deliveryOption ? `<div class="info-row"><span class="info-label">Delivery Type:</span> <strong>${data.deliveryOption === 'local' ? 'Local Delivery / Pickup' : 'Regular Shipping'}</strong></div>` : ''}
          ${data.orderNote ? `<div class="info-row" style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed #e8dada;"><span class="info-label">Order Note:</span> <em>${data.orderNote}</em></div>` : ''}
          <div class="info-row" style="font-size: 11px; color: #888; margin-top: 6px;"><span class="info-label">Payment ID:</span> ${data.paymentId}</div>
        </div>

        <div class="section-title">Ordered Items</div>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
      </div>

      <div class="footer">
        This notification was automatically sent to <strong>${ADMIN_EMAIL}</strong> by your Gloss n Glam store system.
      </div>
    </div>
  </body>
  </html>
  `

  if (!transporter) {
    console.log('⚠️ SMTP credentials not configured. Notification details for admin:', {
      to: ADMIN_EMAIL,
      subject: `🛍️ New Order #${data.orderId.slice(0, 8)} — ₹${data.totalAmount} from ${data.customerName}`,
      orderId: data.orderId,
      customerName: data.customerName,
      totalAmount: data.totalAmount,
    })
    return { success: false, reason: 'SMTP credentials not configured in .env.local' }
  }

  try {
    const info = await transporter.sendMail({
      from: `"Gloss n Glam Store" <${process.env.SMTP_USER || process.env.GMAIL_USER || ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `🛍️ New Order #${data.orderId.slice(0, 8)} — ₹${data.totalAmount.toLocaleString('en-IN')} from ${data.customerName}`,
      html,
    })
    return { success: true, messageId: info.messageId }
  } catch (err: any) {
    console.error('Failed to send order email to admin:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Send an email alert to the admin whenever a customer registers or logs in
 */
export async function sendUserActivityNotificationToAdmin(payload: {
  type: 'registration' | 'login'
  name: string
  email: string
}) {
  const transporter = getTransporter()
  const isReg = payload.type === 'registration'
  const actionTitle = isReg ? '✨ New Customer Registration' : '👋 Customer Logged In'
  const actionEmoji = isReg ? '🎉' : '🔑'

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fbf7f7; margin: 0; padding: 24px; color: #222; }
      .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 18px; padding: 24px; border: 1px solid #f5e6e8; box-shadow: 0 4px 16px rgba(0,0,0,0.05); }
      .title { font-size: 18px; font-weight: 700; color: #222; margin: 0 0 16px; }
      .info-box { background: #fdf8f8; border-radius: 12px; padding: 14px 18px; border: 1px solid #f1e4e6; font-size: 14px; line-height: 1.6; }
      .info-row { margin-bottom: 6px; }
      .label { font-weight: 600; color: #666; }
      .footer { margin-top: 20px; font-size: 11px; color: #999; text-align: center; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="title">${actionEmoji} ${actionTitle}</div>
      <div class="info-box">
        <div class="info-row"><span class="label">Customer Name:</span> <strong>${payload.name}</strong></div>
        <div class="info-row"><span class="label">Email:</span> <a href="mailto:${payload.email}" style="color: #c06b72; font-weight: 600; text-decoration: none;">${payload.email}</a></div>
        <div class="info-row"><span class="label">Time:</span> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)</div>
        <div class="info-row"><span class="label">Event:</span> ${isReg ? 'New user created an account on the store' : 'Existing user logged into their account'}</div>
      </div>
      <div class="footer">
        Automated alert delivered to <strong>${ADMIN_EMAIL}</strong>
      </div>
    </div>
  </body>
  </html>
  `

  if (!transporter) {
    console.log(`⚠️ SMTP credentials not configured. Activity notification: ${actionTitle} for ${payload.name} (${payload.email})`)
    return { success: false, reason: 'SMTP credentials not configured in .env.local' }
  }

  try {
    const info = await transporter.sendMail({
      from: `"Gloss n Glam Alerts" <${process.env.SMTP_USER || process.env.GMAIL_USER || ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `${actionEmoji} ${actionTitle}: ${payload.name}`,
      html,
    })
    return { success: true, messageId: info.messageId }
  } catch (err: any) {
    console.error(`Failed to send ${payload.type} notification:`, err)
    return { success: false, error: err.message }
  }
}

