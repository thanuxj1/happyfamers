import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { getServerSideURL } from '../../utilities/getURL'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
    group: 'Advanced',
    description: 'People who can log in and edit this website.',
  },
  auth: {
    forgotPassword: {
      // Point recovery at the manager's own page rather than Payload's admin.
      generateEmailHTML: (args) => {
        const token = (args as { token?: string } | undefined)?.token ?? ''
        const url = `${getServerSideURL()}/reset-password?token=${token}`

        return `
          <p>Hello,</p>
          <p>Someone asked to reset the password for your Happy Farmers account.</p>
          <p><a href="${url}">Choose a new password</a></p>
          <p>If that wasn't you, you can ignore this email and your password will stay as it is.</p>
        `
      },
      generateEmailSubject: () => 'Reset your Happy Farmers password',
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
  timestamps: true,
  versions: false,
}
