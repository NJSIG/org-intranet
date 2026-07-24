import { anyone, editor } from '@/access'
import type { CollectionConfig } from 'payload'
import { patternField } from '@/fields/Pattern'
import { TURBOPACK_CLIENT_MIDDLEWARE_MANIFEST } from 'next/dist/shared/lib/constants'
//import { createUpdateConsumedRecordHook } from '@/fields/hooks/updateConsumedRecordHook';

export enum EmployeeTypeValues {
  Accounting = 'accounting',
  Claims = 'claims',
  IT = 'information technology',
  Legal = 'legal',
  'Member Services' = 'member services',
  Underwriting = 'underwriting',
}

export const Employees: CollectionConfig<'employees'>= {
    slug: 'employees',
    access: {
      create: editor, 
      delete: editor,
      read: anyone,
      update: editor,
    },
    trash: true,
    folders: true,
    admin: {
      defaultColumns: ['portrait', 'name', 'title', 'department'],
      useAsTitle: 'name',


    defaultPopulate: {
      portrait: true,
      type: true,
      name: true,
      title: true, 
      department: true,
    }
    fields:
    {
      type: 'row',
      fields: [
        {
          type: 'group',
          fields: [
            
          ]

        }
      ]
    }
    }
}