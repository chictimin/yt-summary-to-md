import { getSettings } from './queries'
import { SettingsForm } from './settings-form'

export default async function SettingsPage() {
  const { apiKey, model } = await getSettings()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">설정</h1>
        <SettingsForm currentKey={apiKey ?? ''} currentModel={model ?? ''} />
      </div>
    </div>
  )
}
