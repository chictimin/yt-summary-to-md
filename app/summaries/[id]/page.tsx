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

  const createdDate = new Date(summary.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/summaries"
        className="inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline mb-6"
      >
        &larr; Back to list
      </Link>

      <article>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {summary.video_title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <a
            href={summary.youtube_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Watch on YouTube
          </a>
          <span>{createdDate}</span>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <MarkdownView content={summary.summary_md} />
        </div>
      </article>
    </main>
  )
}
