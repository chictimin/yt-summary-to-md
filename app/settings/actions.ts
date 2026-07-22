'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateApiKey(formData: FormData) {
  const apiKey = formData.get('apiKey') as string
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: '인증이 필요합니다.' }
  }

  const { error } = await supabase.from('user_settings').upsert(
    { user_id: user.id, gemini_api_key: apiKey },
    { onConflict: 'user_id' }
  )

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/settings')
  return { success: true }
}
