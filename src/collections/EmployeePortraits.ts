import { anyone, editor } from '@/access'
import { checkDimensionHook } from '@/collections/hooks/checkDimensionsHook'
import { computeBlurDataHook } from '@/collections/hooks/computeBlurDataHook'
import { createSnakeCaseUploadsHook } from '@/collections/hooks/snakeCaseUploadsHook'
import { CollectionConfig, ImageUploadFormatOptions } from 'payload'

const webp: ImageUploadFormatOptions = {
  format: 'webp',
  options: {
    quality: 90,
  },
}

export const EmployeePortraits: CollectionConfig<'employee-portraits'> = {
  slug: 'employee-portraits',
  access: {
    create: editor,
    delete: editor,
    read: anyone,
    update: editor,
  },
  trash: true,
  disableDuplicate: true,
  fields: [
    //uiTipField([])
    {
      name: 'name',
      type: 'text',
      admin: {
        description: 'The name of the employee in the portrait photo.',
      },
    },
    {
      name: 'blueData',
      label: 'Blur Data',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Used for image placeholders. Automatically generated from the image.',
      },
    },

    //Usage Tracking documentConsumerTrackingField(),
  ],

  folders: true,
  admin: {
    defaultColumns: ['filename', 'name', 'folder'],
    useAsTitle: 'name',
    group: 'Media',
  },
  upload: {
    pasteURL: false,
    skipSafeFetch: [
      {
        hostname: 'localhost',
      },
      {
        hostname: process.env.SAFE_FETCH_ALLOW!,
      },
    ],
    adminThumbnail: 'original',
    mimeTypes: ['image/*'],
    focalPoint: true,
    formatOptions: {
      ...webp,
      options: {
        quality: 100,
        lossless: true,
      },
    },
  },
  hooks: {
    beforeOperation: [createSnakeCaseUploadsHook('employee-portraits')],
    beforeChange: [checkDimensionHook, computeBlurDataHook],
    //beforeDelete: [preventDeleteWhenConsumedHook],
  },
}
