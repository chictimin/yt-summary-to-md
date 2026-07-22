'use client'

import { FormEvent, useState } from 'react'

interface UrlFormProps {
  onSubmit: (url: string) => void
  loading: boolean
}

export function UrlForm({ onSubmit, loading }: UrlFormProps) {
  const [url, setUrl] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) return
    onSubmit(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="url-form">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://www.youtube.com/watch?v=..."
        disabled={loading}
      />
      <button type="submit" disabled={loading || !url.trim()} className="btn btn-primary">
        {loading ? 'Summarizing...' : 'Summarize'}
      </button>
    </form>
  )
}
