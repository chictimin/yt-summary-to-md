import { getSettings } from './queries'
import { SettingsForm } from './settings-form'

export default async function SettingsPage() {
  const { apiKey, model, language } = await getSettings()

  return (
    <div className="container">
      <div className="page">
        <div className="settings-wrap">
          <div className="page-head">
            <h1>설정</h1>
            <p>요약에 사용할 API와 언어를 관리하세요.</p>
          </div>
          <SettingsForm
            currentKey={apiKey ?? ''}
            currentModel={model ?? ''}
            currentLanguage={language ?? 'ko'}
          />
        </div>
      </div>
    </div>
  )
}
