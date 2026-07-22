'use client'

import ReactMarkdown from 'react-markdown'
import { CopyButton } from '@/components/copy-button'

interface PreviewProps {
  content: string | null
}

export function Preview({ content }: PreviewProps) {
  if (!content) {
    return (
      <div className="empty-state">
        <p>Enter a YouTube URL and click Summarize</p>
        <p>The markdown summary will appear here</p>
      </div>
    )
  }

  return (
    <div className="card prose" style={{ padding: 24 }}>
      <CopyButton text={content} />
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
