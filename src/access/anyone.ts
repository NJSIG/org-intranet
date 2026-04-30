import { Access } from 'payload'

//This allows access to anyone, including unauthenticated users.
//this is useful for public collections or global settings that should be accessible to everyone.
export const anyone: Access = () => true
