'use client'

import { useState, useEffect, useCallback } from 'react'
import { saveSettings, listModels } from './actions'

function detectBrowserLanguage(): string {
  if (typeof navigator === 'undefined') return 'en'
  const lang = navigator.language?.split('-')[0]?.toLowerCase()
  const supported = ['ko', 'en', 'ja', 'zh', 'es']
  return supported.includes(lang) ? lang : 'en'
}

const LANGUAGES = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
  { code: 'es', label: 'Español' },
]

export function SettingsForm({
  currentKey,
  currentModel,
  currentLanguage,
}: {
  currentKey: string
  currentModel: string
  currentLanguage?: string
}) {
  const [apiKey, setApiKey] = useState(currentKey)
  const [selectedModel, setSelectedModel] = useState(currentModel || '')
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage || detectBrowserLanguage())
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [models, setModels] = useState<string[]>([])
  const [loadingModels, setLoadingModels] = useState(false)
  const [modelError, setModelError] = useState<string | null>(null)

  const loadModels = useCallback(async (key: string) => {
    if (!key) {
      setModels([])
      return
    }
    setLoadingModels(true)
    setModelError(null)
    const result = await listModels(key)
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
    <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <input type="hidden" name="model" value={selectedModel} />
      <input type="hidden" name="language" value={selectedLanguage} />

      <div className="card section-card">
        <h2>Gemini API Key</h2>
        <div className="field" style={{ marginBottom: 0 }}>
          <input
            name="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onBlur={(e) => loadModels(e.target.value)}
            placeholder="Gemini API 키를 입력하세요"
          />
          <p className="hint">
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">
              Google AI Studio
            </a>
            에서 구글 계정으로 로그인 후 무료로 발급받을 수 있습니다.
          </p>
        </div>
      </div>

      <div className="card section-card">
        <h2>Gemini 모델</h2>
        {loadingModels && <p className="hint">사용 가능한 모델 로딩 중...</p>}
        {modelError && (
          <p className="hint" style={{ color: 'var(--danger)' }}>
            {modelError}
          </p>
        )}
        {!loadingModels && models.length > 0 && (
          <div className="model-grid">
            {models.map((model, i) => (
              <button
                type="button"
                key={model}
                className={`model-opt${model === selectedModel ? ' selected' : ''}`}
                onClick={() => setSelectedModel(model)}
              >
                <div className="name">{model}</div>
                {i === 0 && <div className="desc">최신 · 추천</div>}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="card section-card">
        <h2>요약 언어</h2>
        <div className="chip-row">
          {LANGUAGES.map((l) => (
            <button
              type="button"
              key={l.code}
              className={`chip${l.code === selectedLanguage ? ' selected' : ''}`}
              onClick={() => setSelectedLanguage(l.code)}
            >
              {l.label}
            </button>
          ))}
        </div>
        <p className="hint">
          요약 결과가 출력될 언어입니다. 저장되지 않은 경우 브라우저 언어를 자동 감지합니다.
        </p>
      </div>

      {message && (
        <p
          className="hint"
          style={{ color: message.type === 'error' ? 'var(--danger)' : 'var(--accent-text)' }}
        >
          {message.text}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn btn-primary btn-block">
        {loading ? '저장 중...' : '저장'}
      </button>
    </form>
  )
}
