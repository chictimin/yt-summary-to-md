'use client'

import { useState, useEffect, useCallback } from 'react'
import { updateApiKey, listModels } from './actions'

export function SettingsForm({
  currentKey,
  currentModel,
}: {
  currentKey: string
  currentModel: string
}) {
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [models, setModels] = useState<string[]>([])
  const [loadingModels, setLoadingModels] = useState(false)
  const [modelError, setModelError] = useState<string | null>(null)

  const loadModels = useCallback(async (apiKey: string) => {
    if (!apiKey) {
      setModels([])
      return
    }
    setLoadingModels(true)
    setModelError(null)
    const result = await listModels(apiKey)
    if (result.error) {
      setModelError(result.error)
      setModels([])
    } else {
      setModels(result.models ?? [])
    }
    setLoadingModels(false)
  }, [])

  useEffect(() => {
    if (currentKey) {
      loadModels(currentKey)
    }
  }, [currentKey, loadModels])

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
          onBlur={(e) => loadModels(e.target.value)}
          placeholder="Gemini API 키를 입력하세요"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loadingModels && (
        <p className="text-sm text-gray-600">사용 가능한 모델 로딩 중...</p>
      )}

      {modelError && (
        <p className="text-sm text-red-600">{modelError}</p>
      )}

      {!loadingModels && models.length > 0 && (
        <div>
          <label htmlFor="model" className="block text-sm font-medium mb-1">
            Gemini 모델
          </label>
          <select
            id="model"
            name="model"
            defaultValue={currentModel || ''}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">모델을 선택하세요</option>
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
      )}

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
