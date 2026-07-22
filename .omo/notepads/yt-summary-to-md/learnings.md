# yt-summary-to-md Learnings

## Phase 3 Auth System - Tasks 8 & 9 (2026-07-22)

### Created Files
- `lib/supabase/client.ts` - Browser client setup using `@supabase/ssr` `createBrowserClient`
- `lib/supabase/server.ts` - Server client setup using `@supabase/ssr` `createServerClient` with Next.js `cookies()`
- `app/auth/actions.ts` - Server Actions (`'use server'`) for signup, login, and logout using Supabase Auth
- `app/auth/signup/page.tsx` - 회원가입 페이지 with email/password form, loading state, error handling
- `app/auth/login/page.tsx` - 로그인 페이지 with email/password form, loading state, error handling

### Key Implementation Details
- Server Actions pattern used for all auth operations (no API routes)
- `signup`: calls `supabase.auth.signUp({ email, password })`, then redirects to `/summarize`
- `login`: calls `supabase.auth.signInWithPassword({ email, password })`, then redirects to `/summarize`
- `logout`: calls `supabase.auth.signOut()`, then redirects to `/auth/login`
- Supabase schema has `public.profiles` trigger on `auth.users` insert, so profile creation is automatic
- Forms use `action` prop with async handler for progressive enhancement
- Minimal Tailwind styling only, no external UI libraries
- Accessible forms with proper `<label>` elements

### Build Verification
- `npm run build` passed with zero TypeScript errors
- All routes generated successfully: `/`, `/auth/login`, `/auth/signup`

### Notes
- Next.js 14 Client Components importing Server Actions from `app/auth/actions.ts` require absolute path imports (`@/app/auth/actions`) to be recognized as Server Actions by the compiler
- `.next` cache may need clearing (`rm -rf .next node_modules/.cache`) if build artifacts are corrupted
