import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { DeleteButton } from './delete-button'

export default async function SummariesPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: summaries } = await supabase
    .from('summaries')
    .select('id, video_title, youtube_url, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          내 요약 목록
        </h1>
        <Link
          href="/summarize"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          새 요약 만들기
        </Link>
      </div>

      {!summaries || summaries.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            저장된 요약이 없습니다.
          </p>
          <Link
            href="/summarize"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            첫 번째 요약 만들기
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {summaries.map((summary) => (
            <div
              key={summary.id}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex-1 min-w-0 mr-4">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {summary.video_title}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                  {summary.youtube_url}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {new Date(summary.created_at).toLocaleDateString('ko-KR')}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/summaries/${summary.id}`}
                  className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50"
                >
                  보기
                </Link>
                <DeleteButton id={summary.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
