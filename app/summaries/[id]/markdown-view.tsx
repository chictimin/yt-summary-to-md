'use client'

import ReactMarkdown from 'react-markdown'

export function MarkdownView({ content }: { content: string }) {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
