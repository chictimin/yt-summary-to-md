'use client'

import { useState } from 'react'
import { updateApiKey } from './actions'

export function SettingsForm({ currentKey }: { currentKey: string }) {
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setMessage(null)
    const result = await updateApiKey(formData)
    if (result?.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: '저장되었습니다.' })
    }
    setLoading(false)
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="apiKey" className="block text-sm font-medium mb-1">
          Gemini API Key
        </label>
        <input
          id="apiKey"
          name="apiKey"
          type="password"
          defaultValue={currentKey || ''}
          placeholder="Gemini API 키를 입력하세요"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {message && (
        <p
          className={`text-sm ${
            message.type === 'error' ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {message.text}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? '저장 중...' : '저장'}
      </button>
    </form>
  )
}
