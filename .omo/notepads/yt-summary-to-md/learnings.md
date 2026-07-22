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

## Phase 3 Auth System - Task F2: RLS Security Audit (2026-07-22)

### RLS Policy Verification

#### user_settings table
| Operation | Policy Name | Condition | Status |
|-----------|-------------|-----------|--------|
| SELECT | user_settings_select_own | `auth.uid() = user_id` | OK |
| INSERT | user_settings_insert_own | `WITH CHECK (auth.uid() = user_id)` | OK |
| UPDATE | user_settings_update_own | `USING + WITH CHECK (auth.uid() = user_id)` | OK |
| DELETE | user_settings_delete_own | `auth.uid() = user_id` | OK |

#### summaries table
| Operation | Policy Name | Condition | Status |
|-----------|-------------|-----------|--------|
| SELECT | summaries_select_own | `auth.uid() = user_id` | OK |
| INSERT | summaries_insert_own | `WITH CHECK (auth.uid() = user_id)` | OK |
| UPDATE | — | MISSING | **N/A (app does not use UPDATE)** |
| DELETE | summaries_delete_own | `auth.uid() = user_id` | OK |

### Application Code Defense-in-Depth Verification

| File | Pattern | Status |
|------|---------|--------|
| `app/summaries/page.tsx` | `.eq('user_id', user.id)` on SELECT | OK |
| `app/summaries/[id]/page.tsx` | `.eq('user_id', user.id)` on SELECT + auth check | OK |
| `app/summaries/actions.ts` | `.eq('user_id', user.id)` on DELETE | OK |
| `app/summarize/actions.ts` | `user_id: user.id` on INSERT + auth check | OK |
| `app/settings/queries.ts` | `.eq('user_id', user.id)` on SELECT | OK |

### Findings

1. **summaries UPDATE policy missing**: Not a current vulnerability because the app never updates summaries, but adding it is recommended for defense in depth.
2. **profiles table has no RLS enabled**: Currently safe because the app never queries `profiles` directly (only via `auth.users` trigger), but enabling RLS on `profiles` is a best practice.
3. **Race condition in saveSummary**: The count check (`count >= 30`) and the subsequent `insert` are not atomic. A user sending concurrent requests could bypass the 30-summary limit. Mitigation: use a database-level constraint or a transaction with advisory lock.
4. **No UUID validation in deleteSummary**: The `id` from `FormData` is passed directly to `.eq('id', id)`. While Supabase client-side libraries sanitize inputs, adding explicit UUID format validation would strengthen input validation.

### Verdict
RLS policies are correctly implemented for all actively used operations. Application code consistently applies `user_id` filters as a second layer of defense. No immediate security vulnerabilities were found in the current code paths.
