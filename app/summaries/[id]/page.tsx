import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { MarkdownView } from './markdown-view'

export default async function SummaryDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: summary, error } = await supabase
    .from('summaries')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (error || !summary) {
    notFound()
  }

  const createdDate = new Date(summary.created_at).toLocaleDateString('ko-KR')

  return (
    <div className="container">
      <div className="page page-narrow">
        <Link href="/summaries" className="back-link">
          &larr; 목록으로
        </Link>

        <article>
          <h1 className="detail-title">{summary.video_title}</h1>

          <div className="detail-meta">
            <a href={summary.youtube_url} target="_blank" rel="noopener noreferrer">
              Watch on YouTube
            </a>
            <span>{createdDate}</span>
          </div>

          <div className="detail-divider">
            <MarkdownView content={summary.summary_md} />
          </div>
        </article>
      </div>
    </div>
  )
}
