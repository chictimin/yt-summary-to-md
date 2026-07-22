'use client'

import ReactMarkdown from 'react-markdown'
import { CopyButton } from '@/components/copy-button'

export function MarkdownView({ content }: { content: string }) {
  return (
    <div className="prose">
      <CopyButton text={content} />
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
