'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function deleteSummary(formData: FormData) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return
  }

  const id = formData.get('id') as string

  if (!id) {
    return
  }

  await supabase.from('summaries').delete().eq('id', id).eq('user_id', user.id)

  revalidatePath('/summaries')
}
