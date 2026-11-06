import type { CollectionAfterChangeHook } from 'payload'

type SubmissionField = { field?: string | null; value?: string | null }

const LABELS: Record<string, string> = {
  'full-name': 'Name',
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  location: 'Location',
  product: 'Interested in',
  message: 'Message',
}

// Everything here was typed by a visitor and is going into an HTML email.
const escapeHtml = (text: string) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const oneLine = (text: string) => text.replace(/\s+/g, ' ').trim().slice(0, 80)

/**
 * Emails each new contact message to the business.
 *
 * The form's own email setting only sends the visitor an acknowledgement, so
 * without this a message reached the Messages screen and nowhere else. The
 * address is the one on the Home page's contact details, so changing it in the
 * manager changes where messages go. Replying goes straight to the visitor.
 *
 * Never throws: the message is already saved by now, and a mail problem must
 * not show the visitor an error for a message that did arrive.
 */
export const notifyContactMessage: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc

  try {
    const home = await req.payload.findGlobal({ slug: 'home-page', depth: 0 })
    const to = home?.email?.trim()
    if (!to) return doc

    const fields = ((doc.submissionData ?? []) as SubmissionField[]).filter((f) => f.field && f.value)
    const valueOf = (...names: string[]) =>
      fields.find((f) => names.includes(String(f.field)))?.value ?? ''

    const name = oneLine(valueOf('full-name', 'name')) || 'the website'
    const product = oneLine(valueOf('product'))
    const visitorEmail = valueOf('email').trim()

    const rows = fields
      .map((f) => {
        const label = LABELS[String(f.field)] ?? String(f.field)
        const value = escapeHtml(String(f.value)).replace(/\r?\n/g, '<br>')
        return `<tr><td style="padding:6px 16px 6px 0;color:#6b6355;vertical-align:top">${escapeHtml(label)}</td><td style="padding:6px 0">${value}</td></tr>`
      })
      .join('')

    await req.payload.sendEmail({
      to,
      replyTo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(visitorEmail) ? visitorEmail : undefined,
      subject: `New enquiry from ${name}${product ? ` about ${product}` : ''}`,
      html: `<p>You have a new message from the website:</p><table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">${rows}</table>`,
    })
  } catch (err) {
    req.payload.logger.error({ err, msg: 'Could not email a contact message to the business' })
  }

  return doc
}
