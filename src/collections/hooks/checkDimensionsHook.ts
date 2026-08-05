import { Minimatch } from 'minimatch'
import { APIError, CollectionBeforeChangeHook } from 'payload'
/*it is a high speed Node-API module that converts large images in common formats to smaller, web-friendly JPEG, 
NPG, WebP, GIF and AVIF images for varying dimensions*/
import sharp from 'sharp'

export const checkDimensionHook: CollectionBeforeChangeHook = async ({ data, req }) => {
  const mimeTypeMatcher = new Minimatch('image/*')

  if (data.mimeType === null || !mimeTypeMatcher.match(data.mimeType)) {
    return data
  }

  const file = req.file

  if (file === null || file === undefined || !('data' in file)) {
    return data
  }

  const fileData = file.data

  if (!Buffer.isBuffer(fileData)) {
    return data
  }

  const dimensions = await getImageDimensions(fileData)

  return data
}

async function getImageDimensions(fileData: Buffer): Promise<{ width: number; height: number }> {
  const metadata = await sharp(fileData).metadata()

  if (!metadata.width || !metadata.height) {
    throw new APIError('Unable to determine dimensions.', 400)
  }

  return { width: metadata.width, height: metadata.height }
}
