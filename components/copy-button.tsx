'use client'

import { useState } from 'react'

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: -8 }}>
      <button
        type="button"
        className="btn btn-ghost"
        aria-label="복사하기"
        style={{ padding: 8 }}
        onClick={handleCopy}
      >
        {copied ? (
          <svg width="15" height="15" viewBox="0 0 16 16">
            <path d="M3 8 L6.5 12 L13 4" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 16 16">
            <rect x="5" y="5" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <rect x="2" y="2" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        )}
      </button>
    </div>
  )
}
