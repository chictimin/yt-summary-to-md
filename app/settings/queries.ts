import { createClient } from '@/lib/supabase/server'

export async function getApiKey(): Promise<string | null> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from('user_settings')
    .select('gemini_api_key')
    .eq('user_id', user.id)
    .single()

  return data?.gemini_api_key ?? null
}
