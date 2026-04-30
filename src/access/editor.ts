import { User } from '@/payload-types'
import { AccessArgs } from 'payload'

type isEditor = (args: AccessArgs<User>) => boolean

//Allows access to editor users and admin users
export const editor: isEditor = ({ req: { user } }) => {
  if (user && user.role === 'editor') {
    return true
  }

  if (user && user.role === 'admin') {
    return true
  }

  return false
}
