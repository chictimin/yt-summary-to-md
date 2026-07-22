'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

interface SaveSummaryInput {
  youtubeUrl: string
  videoTitle: string
  summaryMd: string
}

export async function saveSummary({
  youtubeUrl,
  videoTitle,
  summaryMd,
}: SaveSummaryInput) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Check current summary count
  const { count, error: countError } = await supabase
    .from('summaries')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  if (countError) {
    console.error('Count check error:', countError)
    return { error: 'Failed to check summary count' }
  }

  if (count !== null && count >= 30) {
    return { error: 'Maximum 30 summaries allowed. Please delete existing summaries to create new ones.' }
  }

  // Insert new summary
  const { data, error: insertError } = await supabase
    .from('summaries')
    .insert({
      user_id: user.id,
      youtube_url: youtubeUrl,
      video_title: videoTitle,
      summary_md: summaryMd,
    })
    .select('id')
    .single()

  if (insertError) {
    console.error('Insert error:', insertError)
    return { error: 'Failed to save summary' }
  }

  revalidatePath('/summaries')

  return { id: data.id }
}
