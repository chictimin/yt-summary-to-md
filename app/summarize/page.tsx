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
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Summarize YouTube Video
      </h1>

      <div className="mb-8">
        <UrlForm onSubmit={handleSubmit} loading={loading} />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {saveError && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {saveError}
        </div>
      )}

      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm">
          Summary saved! Redirecting...
        </div>
      )}

      {loading && !markdown && (
        <div className="text-center py-16">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Generating summary...</p>
        </div>
      )}

      <Preview content={markdown} />

      {showSaveButton && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saveLoading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {saveLoading ? 'Saving...' : 'Save Summary'}
          </button>
        </div>
      )}
    </main>
  )
}
