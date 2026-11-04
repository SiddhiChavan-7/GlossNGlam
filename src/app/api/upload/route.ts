import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import dns from 'dns'

try {
  dns.setDefaultResultOrder('ipv4first')
} catch {}

// Server-side Cloudinary upload endpoint
// Accepts multipart/form-data with a 'file' field
export async function POST(req: NextRequest) {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Missing Cloudinary creds:', { cloudName: !!cloudName, apiKey: !!apiKey, apiSecret: !!apiSecret })
      return NextResponse.json(
        { error: `Cloudinary credentials not configured. Missing: ${!cloudName ? 'CLOUD_NAME ' : ''}${!apiKey ? 'API_KEY ' : ''}${!apiSecret ? 'API_SECRET' : ''}` },
        { status: 500 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Create signature for signed upload
    const timestamp = Math.round(Date.now() / 1000)
    const folder = 'glossnails'

    // Build signature string (parameters sorted alphabetically: folder, timestamp)
    const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`
    const signature = crypto
      .createHash('sha1')
      .update(signatureString)
      .digest('hex')

    // Upload directly using multipart/form-data with FormData
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    uploadFormData.append('api_key', apiKey)
    uploadFormData.append('timestamp', String(timestamp))
    uploadFormData.append('signature', signature)
    uploadFormData.append('folder', folder)

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: uploadFormData,
      }
    )

    const uploadData = await uploadRes.json()

    if (!uploadRes.ok) {
      console.error('Cloudinary upload error:', uploadData)
      return NextResponse.json(
        { error: uploadData.error?.message || 'Upload to Cloudinary failed' },
        { status: uploadRes.status || 500 }
      )
    }

    return NextResponse.json({
      url: uploadData.secure_url,
      public_id: uploadData.public_id
    })
  } catch (err: any) {
    console.error('Upload route error:', err)
    return NextResponse.json({ error: err.message || 'Server error during upload' }, { status: 500 })
  }
}
