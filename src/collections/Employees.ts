import { anyone, editor } from '@/access'
import type { CollectionConfig } from 'payload'
import { patternField } from '@/fields/Pattern'
//import { createUpdateConsumedRecordHook } from '@/fields/hooks/updateConsumedRecordHook';

export enum EmployeeTypeValues {
  Accounting = 'accounting',
  Claims = 'claims',
  IT = 'information technology',
  Legal = 'legal',
  'Member Services' = 'member services',
  Underwriting = 'underwriting',
}

export const Employees: CollectionConfig<'employees'> = {
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
    defaultColumns: [
      'portrait',
      'first name',
      'last name',
      'title',
      'department',
      'desk letter',
      'alpha-split',
    ],
    useAsTitle: 'name',

    defaultPopulate: {
      portrait: true,
      type: true,
      name: true,
      title: true,
      department: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            type: 'group',
            fields: [
              //portrait field
              {
                name: 'portrait',
                type: 'upload',
                relationTo: 'employee-portraits',
                admin: {
                  description: '',
                },
                /*    hooks: {
                afterChange: [createUpdateConsumedRecordHook('name')],
              }, */
              },
              //type of employee
              {
                name: 'type',
                type: 'select',
                required: true,
                options: [
                  { label: 'Accounting', value: EmployeeTypeValues.Accounting },
                  { label: 'Claims', value: EmployeeTypeValues.Claims },
                  { label: 'IT', value: EmployeeTypeValues.IT },
                  { label: 'Legal', value: EmployeeTypeValues.Legal },
                  { label: 'Member Services', values: EmployeeTypeValues['Member Services'] },
                  { label: 'Underwriting', values: EmployeeTypeValues.Underwriting },
                ],
                admin: {
                  isClearable: false, //disallows admin to clear a field within the admin UI
                  description: 'This employee type helps differentiate staff across NJSIG.',
                },
              },
            ],
            admin: {
              width: '30%',
            },
          },
          {
            type: 'group',
            required: true,
            //all fields that are grouped together in the 70% side of the width
            fields: [
              {
                type: 'row',
                required: true,
                fields: [
                  {
                    //first name field
                    name: 'first name',
                    type: 'text',
                    required: true,
                    admin: {
                      descriptIon: "The employee's first name.",
                    },
                  },
                  {
                    //last name field
                    name: 'last name',
                    type: 'text',
                    required: true,
                    admin: {
                      descriptIon: "The employee's last name.",
                    },
                  },
                ],
              },
              {
                //title field
                name: 'title',
                type: 'text',
                localized: true,
                required: true,
                admin: {
                  description: "The employee's job title.",
                },
              },
              //department
              {
                name: 'department',
                type: 'select',
                options: [
                  { label: 'Accounting', value: EmployeeTypeValues.Accounting },
                  { label: 'Claims', value: EmployeeTypeValues.Claims },
                  { label: 'IT', value: EmployeeTypeValues.IT },
                  { label: 'Legal', value: EmployeeTypeValues.Legal },
                  { label: 'Member Services', values: EmployeeTypeValues['Member Services'] },
                  { label: 'Underwriting', values: EmployeeTypeValues.Underwriting },
                ],
                required: true,
                admin: {
                  description: 'The department the employee works in.',
                },
              },
              //this field will only show up if type of employee is Claims
              {
                name: 'desk letter',
                type: 'text',
                required: true,
                admin: {
                  condition: (_, siblingData) => siblingData?.type === EmployeeTypeValues.Claims,
                },
              },
              //this field will only show up if type of employee is Underwriting
              {
                name: 'alpha-split',
                type: 'text',
                required: true,
                admin: {
                  condition: (_, siblingData) =>
                    siblingData?.type === EmployeeTypeValues.Underwriting,
                },
              },
              {
                name: 'email',
                type: 'email',
                required: true,
                unique: true,
                access: {
                  create: editor,
                  read: editor,
                  update: editor,
                },
              },
              {
                type: 'row',
                fields: [
                  patternField({
                    overrides: {
                      name: 'phone',
                      type: 'text',
                      access: {
                        create: editor,
                        read: editor,
                        update: editor,
                      },
                      admin: {
                        placeholder: '% 20',
                      },
                    },
                    pattern: {
                      format: '+1 (###) ### ####',
                      prefix: '% ',
                      allowEmptyFormatting: true,
                      mask: '_',
                    },
                  }),
                  patternField({
                    overrides: {
                      name: 'extension',
                      type: 'text',
                      access: {
                        create: editor,
                        read: editor,
                        update: editor,
                      },
                    },
                    pattern: {
                      format: '####',
                      prefix: '',
                      allowEmptyFormatting: true,
                      mask: '_',
                    },
                  }),
                ],
              },
            ],
          },
        ],
      },
    ],
  },
}
