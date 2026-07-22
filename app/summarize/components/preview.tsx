'use client'

import ReactMarkdown from 'react-markdown'

interface PreviewProps {
  content: string | null
}

export function Preview({ content }: PreviewProps) {
  if (!content) {
    return (
      <div className="text-center py-16 text-gray-400 dark:text-gray-600">
        <p className="text-lg">Enter a YouTube URL and click Summarize</p>
        <p className="text-sm mt-1">The markdown summary will appear here</p>
      </div>
    )
  }

  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
