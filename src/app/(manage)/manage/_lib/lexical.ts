/**
 * Payload stores rich text as Lexical JSON, but the manager deliberately offers
 * a plain textarea: the people editing this site write paragraphs, not markup.
 * These convert between the two, treating one line as one paragraph.
 */

type LexicalDoc = {
  root: {
    type: 'root'
    children: unknown[]
    direction: 'ltr'
    format: ''
    indent: 0
    version: 1
  }
}

export function lexicalToText(content: unknown): string {
  if (!content || typeof content !== 'object') return ''
  const root = (content as { root?: { children?: unknown[] } }).root
  if (!root?.children) return ''

  return root.children
    .map((node) => {
      const n = node as { children?: { text?: string }[] }
      return n.children?.map((c) => c.text ?? '').join('') ?? ''
    })
    .join('\n')
}

export function textToLexical(text: string): LexicalDoc {
  // Browsers normalise textarea values to CRLF on submit; splitting on \n alone
  // would leave a trailing carriage return on every paragraph.
  const paragraphs = text
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  return {
    root: {
      type: 'root',
      children: paragraphs.map((line) => ({
        type: 'paragraph',
        children: [{ type: 'text', text: line, version: 1 }],
        version: 1,
      })),
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}
