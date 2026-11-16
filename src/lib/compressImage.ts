/**
 * Client-side image compression utility using HTML5 Canvas.
 * Automatically resizes large smartphone camera photos (5-15MB) down to ~200-400KB
 * with high visual fidelity, preventing Vercel 4.5MB payload limit errors and network timeouts.
 */
export async function compressImage(file: File, maxDimension = 1920, quality = 0.85): Promise<File> {
  // Only compress images (exclude GIFs to preserve animation)
  if (!file.type.startsWith('image/') || file.type === 'image/gif') {
    return file
  }

  // If already tiny (< 250 KB), skip compression
  if (file.size < 250 * 1024) {
    return file
  }

  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (readerEvent) => {
      const img = new (window as any).Image()
      img.onload = () => {
        let { width, height } = img

        // Calculate scaled dimensions while preserving aspect ratio
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width)
            width = maxDimension
          } else {
            width = Math.round((width * maxDimension) / height)
            height = maxDimension
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          // If 2d context unavailable, fallback to original file
          resolve(file)
          return
        }

        // Draw image
        ctx.drawImage(img, 0, 0, width, height)

        // Prefer image/jpeg for photos to achieve optimal compression
        const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file)
              return
            }

            // Create a new File object with the compressed blob
            const newFileName = file.name.replace(/\.[^/.]+$/, '') + (outputType === 'image/png' ? '.png' : '.jpg')
            const compressedFile = new File([blob], newFileName, {
              type: outputType,
              lastModified: Date.now(),
            })

            console.log(
              `[Image Compressor] Compressed "${file.name}" (${(file.size / 1024 / 1024).toFixed(2)} MB) -> ` +
              `"${compressedFile.name}" (${(compressedFile.size / 1024).toFixed(1)} KB)`
            )

            resolve(compressedFile)
          },
          outputType,
          quality
        )
      }

      img.onerror = () => {
        // Fallback to original file on load error
        resolve(file)
      }

      img.src = readerEvent.target?.result as string
    }

    reader.onerror = () => {
      // Fallback to original file on read error
      resolve(file)
    }

    reader.readAsDataURL(file)
  })
}

