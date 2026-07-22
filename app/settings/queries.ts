import { createClient } from '@/lib/supabase/server'

export async function getSettings(): Promise<{
  apiKey: string | null
  model: string | null
}> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { apiKey: null, model: null }

  const { data } = await supabase
    .from('user_settings')
    .select('gemini_api_key, gemini_model')
    .eq('user_id', user.id)
    .single()

  return {
    apiKey: data?.gemini_api_key ?? null,
    model: data?.gemini_model ?? null,
  }
}
