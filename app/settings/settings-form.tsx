'use client'

import { useState, useEffect, useCallback } from 'react'
import { saveSettings, listModels } from './actions'

function detectBrowserLanguage(): string {
  if (typeof navigator === 'undefined') return 'auto'
  const lang = navigator.language?.split('-')[0]?.toLowerCase()
  const supported = ['ko', 'en', 'ja', 'zh', 'es']
  return supported.includes(lang) ? lang : 'en'
}

export function SettingsForm({
  currentKey,
  currentModel,
  currentLanguage,
}: {
  currentKey: string
  currentModel: string
  currentLanguage?: string
}) {
  const [language] = useState(currentLanguage || detectBrowserLanguage())
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
    const result = await saveSettings(formData)
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
        <p className="text-xs text-gray-500 mt-1">
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-700"
          >
            Google AI Studio
          </a>
          에서 구글 계정으로 로그인 후 무료로 발급받을 수 있습니다.
        </p>
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

      <div>
        <label htmlFor="language" className="block text-sm font-medium mb-1">
          요약 언어
        </label>
        <select
          id="language"
          name="language"
          defaultValue={language}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ko">한국어</option>
          <option value="en">English</option>
          <option value="ja">日本語</option>
          <option value="zh">中文</option>
          <option value="es">Español</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          요약 결과가 출력될 언어입니다. 저장되지 않은 경우 브라우저 언어를 자동 감지합니다.
        </p>
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
