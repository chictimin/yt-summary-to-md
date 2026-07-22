import { createClient } from '@/lib/supabase/server'
import { NavClient } from './nav-client'

export async function AuthNav() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <NavClient userEmail={user?.email ?? null} />
}
