import { User } from '@/payload-types'
import { AccessArgs } from 'payload'

type isEditor = (args: AccessArgs<User>) => boolean

export const editor: isEditor = ({ req: { user } }) => {
  if (user && user.role === 'editor') {
    return true
  }

  return false
}
