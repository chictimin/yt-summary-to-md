'use client'

import { useState } from 'react'
import { UrlForm } from './components/url-form'
import { Preview } from './components/preview'
import { saveSummary } from './actions'

export default function SummarizePage() {
  const [markdown, setMarkdown] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')
  const [currentTitle, setCurrentTitle] = useState('')

  const handleSubmit = async (url: string) => {
    setLoading(true)
    setError(null)
    setMarkdown(null)
    setSaveError(null)
    setSaveSuccess(false)
    setCurrentUrl(url)

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error || `Request failed (${res.status})`)
      }

      const data = await res.json()
      setMarkdown(data.markdown ?? data.summary ?? JSON.stringify(data))
      setCurrentTitle(data.title ?? 'YouTube Video Summary')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!markdown || !currentUrl) return

    setSaveLoading(true)
    setSaveError(null)

    try {
      const result = await saveSummary({
        youtubeUrl: currentUrl,
        videoTitle: currentTitle,
        summaryMd: markdown,
      })

      if ('error' in result) {
        setSaveError(result.error ?? 'Failed to save summary')
      } else {
        setSaveSuccess(true)
        window.location.href = '/summaries'
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save summary')
    } finally {
      setSaveLoading(false)
    }
  }

  const showSaveButton = markdown && !loading && !saveSuccess

  return (
    <div className="container">
      <div className="page page-narrow">
        <h1 className="page-title">새 요약 만들기</h1>

        <UrlForm onSubmit={handleSubmit} loading={loading} />

        {error && (
          <p className="hint" style={{ color: 'var(--danger)', marginBottom: 20 }}>
            {error}
          </p>
        )}

        {saveError && (
          <p className="hint" style={{ color: 'var(--danger)', marginBottom: 20 }}>
            {saveError}
          </p>
        )}

        {saveSuccess && (
          <p className="hint" style={{ color: 'var(--accent-text)', marginBottom: 20 }}>
            Summary saved! Redirecting...
          </p>
        )}

        {loading && !markdown && (
          <div style={{ textAlign: 'center', padding: '64px 20px' }}>
            <div className="spinner" style={{ margin: '0 auto 16px' }} />
            <p className="hint">Generating summary...</p>
          </div>
        )}

        <Preview content={markdown} />

        {showSaveButton && (
          <div className="save-row">
            <button onClick={handleSave} disabled={saveLoading} className="btn btn-primary">
              {saveLoading ? 'Saving...' : 'Save Summary'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
