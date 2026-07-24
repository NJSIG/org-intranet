import {
  APIError,
  BasePayload,
  CollectionSlug,
  FieldHook,
  FieldHookArgs,
  UploadField,
} from 'payload'
//import { RecordTrackingConsumer } from '../RecordUsageTracking/types';

function isNotFoundError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false
  }
  const typedError = error as {
    status?: number
    statusCode?: number
    data?: { status?: number }
    message?: string
  }

  const status = typedError.status ?? typedError.statusCode ?? typedError.data?.status
  if (status === 404) {
    return true
  }

  const message = typedError.message?.toLowerCase() ?? ''
  return message.includes('not found') || message.includes('no document')
}

export const createUpdateConsumedRecordHook = (useAsTitle: string): FieldHook => {
  const titleField = useAsTitle || 'title'

  return async ({ req, operation, collection, originalDoc, field, path, value, previousValue }) => {
    if (operation === 'read') {
      return value
    }

    const { payload } = req
    const collectionSlug = collection?.slug
    const docId = originalDoc.id
    const docTitle = originalDoc[titleField] || `Document ${docId}`
    const relatedCollectionSlug = (field as UploadField).relationTo
    const pathString = path.join('.')
  }
}
