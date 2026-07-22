# Supabase Auth Setup Guide

> Project: `yt-summary-to-md`  
> Reuses existing **mood-tracker** Supabase project.

---

## 1. Confirm email 비활성화 (필수)

이메일 인증 없이 바로 로그인할 수 있도록 **Confirm email**을 끕니다.

1. [Supabase Dashboard](https://supabase.com/dashboard) 에 접속
2. 해당 프로젝트 선택
3. 왼쪽 메뉴: **Authentication** → **Providers** → **Email**
4. **"Confirm email"** 토글 → **OFF**
5. (선택) **"Secure email change"** 도 OFF 로 설정하면 이메일 변경 시에도 인증 메일 없이 즉시 반영됨

> 참고: Confirm email OFF 상태에서는 `auth.signUp()` 후 사용자가 즉시 `authenticated` 상태가 됩니다.

---

## 2. Site URL 설정

Supabase Auth 리디렉션 및 매직링크의 기준 도메인을 설정합니다.

1. 왼쪽 메뉴: **Authentication** → **URL Configuration**
2. **Site URL** 필드에 배포 도메인 입력:
   - 로컬 개발: `http://localhost:3000`
   - Vercel 배포 후: `https://<your-project>.vercel.app`
3. **Additional Redirect URLs** (선택):
   - `http://localhost:3000/**`
   - `https://<your-project>.vercel.app/**`

> Vercel 배포가 완료되면 반드시 Site URL을 실제 도메인으로 업데이트하세요.

---

## 3. 환경 변수 (`.env.local` 예시)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

- `URL`과 `Anon Key`는 프로젝트 대시보드 **Project Settings** → **API** 탭에서 확인 가능

---

## 4. 스키마 적용

1. 대시보드 왼쪽 메뉴: **SQL Editor**
2. **New query** 클릭
3. `supabase/schema.sql` 전체 내용을 붙여넣기
4. **Run** 실행

> `profiles`, `user_settings`, `summaries` 테이블 및 RLS 정책이 생성됩니다.

---

## 5. 빠른 체크리스트

- [x] Confirm email OFF
- [ ] Site URL = Vercel 도메인 (배포 후 업데이트)
- [x] `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` 환경변수 설정
- [x] SQL Editor로 `schema.sql` 실행 완료
