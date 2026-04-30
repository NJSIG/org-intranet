import { admin, editor } from '@/access'
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',

  access: {
    create: admin,
    delete: admin,
    read: editor,
    update: admin,
  },
  admin: {
    useAsTitle: 'email',
    group: 'Administration',
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'User', value: 'user' },
      ],
      required: true,
      defaultValue: 'user',
    },
  ],
}
