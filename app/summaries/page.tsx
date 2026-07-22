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
    <div className="container">
      <div className="page">
        <div className="page-head">
          <h1>내 요약 목록</h1>
          <Link href="/summarize" className="btn btn-primary">
            새 요약 만들기
          </Link>
        </div>

        {!summaries || summaries.length === 0 ? (
          <div className="card empty-state">
            <p>저장된 요약이 없습니다.</p>
            <p>
              <Link href="/summarize">첫 번째 요약 만들기</Link>
            </p>
          </div>
        ) : (
          <div className="list">
            {summaries.map((summary) => (
              <div key={summary.id} className="card item">
                <div className="item-info">
                  <div className="item-title">{summary.video_title}</div>
                  <div className="item-url">{summary.youtube_url}</div>
                  <div className="item-date">
                    {new Date(summary.created_at).toLocaleDateString('ko-KR')}
                  </div>
                </div>
                <div className="item-actions">
                  <Link href={`/summaries/${summary.id}`} className="btn btn-ghost">
                    보기
                  </Link>
                  <DeleteButton id={summary.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
