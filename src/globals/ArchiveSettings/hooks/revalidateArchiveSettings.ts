import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath } from 'next/cache'

export const revalidateArchiveSettings: GlobalAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating products & resources archive pages')
    revalidatePath('/products')
    revalidatePath('/posts')
  }
  return doc
}
