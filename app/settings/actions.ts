'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { listAvailableModels } from '@/lib/gemini/models'

export async function updateApiKey(formData: FormData) {
  const apiKey = formData.get('apiKey') as string
  const model = formData.get('model') as string | null
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: '인증이 필요합니다.' }
  }

  const { error } = await supabase.from('user_settings').upsert(
    { user_id: user.id, gemini_api_key: apiKey, gemini_model: model },
    { onConflict: 'user_id' }
  )

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/settings')
  return { success: true }
}

export async function listModels(apiKey: string) {
  try {
    const models = await listAvailableModels(apiKey)
    return { models }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : '모델 목록을 불러오는 중 오류가 발생했습니다.',
    }
  }
}
