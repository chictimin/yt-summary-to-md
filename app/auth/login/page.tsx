'use client'

import { useState } from 'react'
import { login } from '@/app/auth/actions'
import Link from 'next/link'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h1>로그인</h1>
        <form action={handleSubmit}>
          <div className="field">
            <label htmlFor="email">이메일</label>
            <input id="email" name="email" type="email" required />
          </div>
          <div className="field" style={{ marginBottom: 22 }}>
            <label htmlFor="password">비밀번호</label>
            <input id="password" name="password" type="password" required />
          </div>
          {error && (
            <p className="hint" style={{ color: 'var(--danger)', marginBottom: 18 }}>
              {error}
            </p>
          )}
          <button type="submit" disabled={loading} className="btn btn-primary btn-block">
            {loading ? '처리 중...' : '로그인'}
          </button>
        </form>
        <p className="auth-foot">
          계정이 없으신가요? <Link href="/auth/signup">회원가입</Link>
        </p>
      </div>
    </div>
  )
}
