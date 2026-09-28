// Small helpers for hand-writing Lexical richText JSON in seed data without
// repeating the full node boilerplate for every heading/paragraph.

type TextNode = {
  type: 'text'
  detail: 0
  format: number
  mode: 'normal'
  style: ''
  text: string
  version: 1
}

const text = (value: string, format = 0): TextNode => ({
  type: 'text',
  detail: 0,
  format,
  mode: 'normal',
  style: '',
  text: value,
  version: 1,
})

export const heading = (value: string, tag: 'h1' | 'h2' | 'h3' | 'h4' = 'h2') => ({
  type: 'heading',
  children: [text(value)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  tag,
  version: 1,
})

export const paragraph = (value: string) => ({
  type: 'paragraph',
  children: [text(value)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  textStyle: '',
  version: 1,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const richText = (nodes: any[]) => ({
  root: {
    type: 'root',
    children: nodes,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})
