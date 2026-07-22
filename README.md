# yt2md — YouTube → Markdown 요약

YouTube 영상 URL을 붙여넣으면 Gemini AI가 핵심 포인트를 추출해 마크다운으로 요약해주는 웹 애플리케이션. 각자 자신의 Gemini API 키를 등록해 사용하며 계정별로 데이터가 격리된다.

실제 배포 경로 : [https://yt-summary-to-md.vercel.app/](https://yt-summary-to-md.vercel.app/)

> aiffel 과제물용 바이브코딩으로 구현.

## 스택

| 계층       | 기술                                                                                               |
| ---------- | -------------------------------------------------------------------------------------------------- |
| Framework  | Next.js 14 (App Router)                                                                            |
| Language   | TypeScript                                                                                         |
| Auth / DB  | Supabase (PostgreSQL + Auth + RLS)                                                                 |
| AI         | Google Gemini API (`@google/genai`)                                                                |
| Styling    | Tailwind 디렉티브(베이스) + `globals.css`의 커스텀 다크 테마 CSS (Claude Design 프로젝트에서 이식) |
| Markdown   | react-markdown                                                                                     |
| Deployment | Vercel                                                                                             |

## 핵심 결정 사항

- **백엔드 구조**: Next.js API Routes + Vercel. GitHub Pages는 정적 호스팅이라 자체 백엔드 구동이 불가하여 채택
- **AI 요약**: Gemini API가 YouTube URL을 직접 받아 처리 가능 (video-understanding) → 별도 자막 추출 로직 불필요. 무료 티어 하루 8시간 처리 제한, 공개 영상만 가능
- **요약 방식**: MVP에서는 고정 프롬프트 1개만 사용. 스타일 커스터마이징은 범위 밖
- **저장 제한**: 사용자당 최대 30개 (가드레일)
- **인증**: Supabase Auth(이메일/비밀번호), Confirm email OFF로 바로 로그인 가능
- **API 키 관리**: 사용자별 Gemini API 키를 DB(`user_settings`)에 저장하며, 서버 측에서 조회해 사용 (환경변수 아님)

## 주요 기능 (MVP)

- **인증**: 이메일/비밀번호 회원가입·로그인 (Supabase Auth)
- **설정**: Gemini API 키 저장/수정, 모델 선택, 요약 언어 선택
- **요약 생성**: YouTube URL 입력 → 서버(API Route)가 사용자의 Gemini API 키로 video-understanding 호출 → 마크다운 요약 반환
- **프리뷰**: 반환된 마크다운을 렌더링하여 저장 전 미리보기
- **저장**: 프리뷰 확인 후 저장 버튼 → DB insert (최대 30개 제한)
- **목록 조회**: 저장된 요약을 최신순 리스트로 노출
- **상세 조회**: 목록에서 항목 선택 시 마크다운 본문 조회
- **삭제**: 저장된 항목 삭제

### Out of scope (MVP)

- 요약 방식/스타일 커스터마이징, 편집(Update) 기능
- 소셜 로그인, 비밀번호 재설정 메일
- 비공개/미등록 영상 지원 (Gemini API 제약)

### 확장 후보 (post-launch)

- 요약 텍스트 편집 기능
- 요약 방식 설정 옵션 (상세/간결/포인트 중심 등)
- 반응형·에러 UI 보강

## 시작하기

```bash
npm install
npm run dev
```

위 명령어 입력 후 [http://localhost:3000](http://localhost:3000)에서 확인 가능.

## 환경 변수

`.env.local`:

```bash
# Supabase (필수)
NEXT_PUBLIC_SUPABASE_URL=<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

## 데이터 구조 (Supabase PostgreSQL)

```sql
-- profiles: auth.users 미러
profiles (id uuid PK, email text, created_at timestamptz)

-- user_settings: 사용자별 Gemini 설정
user_settings (user_id uuid PK, gemini_api_key text, gemini_model text, language text)

-- summaries: 저장된 요약
summaries (id uuid PK, user_id uuid, youtube_url text, video_title text, summary_md text, created_at timestamptz)
```

RLS 적용: `auth.uid() = user_id` 정책으로 본인 행만 접근 가능.

## Supabase 설정

1. Supabase 프로젝트 생성 (기존 mood-tracker 프로젝트 재사용)
2. Authentication → Providers → Email → **Confirm email OFF**
3. SQL Editor에서 `supabase/schema.sql` 실행
4. 환경 변수 설정

자세한 설정: `supabase/auth-setup.md`

## 프로젝트 구조

```
app/
  page.tsx               # 랜딩 페이지 (hero + how-it-works)
  layout.tsx             # 루트 레이아웃 (AuthNav)
  api/summarize/route.ts # POST /api/summarize — Gemini 요약 (API Route)
  auth/
    login/               # 로그인 페이지
    signup/              # 회원가입 페이지
    actions.ts           # login/signup/logout Server Actions
  summarize/
    page.tsx             # 요약 페이지 (URL 입력 + 프리뷰 + 저장)
    actions.ts           # saveSummary Server Action
    components/
      url-form.tsx       # YouTube URL 입력 폼
      preview.tsx        # 마크다운 프리뷰 (react-markdown)
  summaries/
    page.tsx             # 저장된 요약 목록
    [id]/page.tsx        # 개별 요약 상세
    actions.ts           # deleteSummary Server Action
    delete-button.tsx    # 삭제 확인 버튼
  settings/
    page.tsx             # 설정 페이지 (서버 컴포넌트 → SettingsForm)
    settings-form.tsx    # API 키 / 모델 / 언어 설정 폼 (클라이언트)
    actions.ts           # saveSettings / listModels Server Actions
    queries.ts           # getSettings DB 조회
lib/
  supabase/
    client.ts            # 브라우저 Supabase 클라이언트
    server.ts            # 서버 Supabase 클라이언트
    middleware.ts         # 미들웨어용 Supabase 클라이언트 (세션 갱신)
  gemini/
    models.ts            # Gemini 모델 목록 조회 / 캐싱 (5분 TTL)
components/
  auth/
    auth-nav.tsx         # 로그인 상태 조회 (서버) → NavClient에 전달
    nav-client.tsx       # 헤더/모바일 햄버거 메뉴 (클라이언트)
    logout-button.tsx    # 로그아웃 버튼
  copy-button.tsx        # 클립보드 복사 버튼
supabase/
  schema.sql             # DB 스키마 (테이블 + RLS + 트리거)
  auth-setup.md          # Supabase Auth 설정 가이드
middleware.ts            # 인증 리다이렉트 (로그인/회원가입 제외 모든 페이지 보호)
next.config.mjs          # Next.js 설정
tailwind.config.ts       # Tailwind 설정 (+ typography 플러그인)
```

## API

### POST /api/summarize

```json
// Request
{ "url": "https://www.youtube.com/watch?v=..." }

// Response (200)
{ "summary": "# 마크다운 요약...", "title": "영상 제목" }

// Response (400)
{ "error": "Invalid YouTube URL format" }

// Response (401)
{ "error": "Unauthorized" }
```

인증 필요. 사용자 설정에 저장된 Gemini API 키와 선택한 모델로 요청 실행.

### Server Actions

| Action                    | 경로                       | 설명                                       |
| ------------------------- | -------------------------- | ------------------------------------------ |
| `saveSummary`             | `app/summarize/actions.ts` | 요약 DB 저장 (30개 제한 체크)              |
| `deleteSummary`           | `app/summaries/actions.ts` | 요약 삭제                                  |
| `saveSettings`            | `app/settings/actions.ts`  | API 키·모델·언어 설정 저장                 |
| `listModels`              | `app/settings/actions.ts`  | Gemini API 키로 사용 가능한 모델 목록 조회 |
| `login`·`signup`·`logout` | `app/auth/actions.ts`      | Supabase Auth                              |

## 현재 상태

- **status**: `active` — MVP 구현 완료, Vercel 프로덕션 배포됨
- 배포 후 Claude Design(claude.ai/design)에서 전체 UI 디자인을 새로 잡아 "yt2md" 다크 테마로 리스킨 완료
- 현재 GitHub push → Vercel 자동 배포는 연결되지 않음 (수동 `vercel --prod`)

## 한계

- Gemini API 키는 각 사용자가 직접 발급해 설정 페이지에 등록해야 함 (서비스에서 제공하지 않음)
- 요약은 최대 30개까지 저장 가능 (무료 티어 DB 용량 고려)
- 비공개/미등록 영상은 Gemini API 제약으로 처리 불가
- 일부 짧은/무음 영상에서 Gemini가 컨텐츠를 생성하지 못할 수 있음
- 무료 티어 Gemini는 하루 8시간 처리 제한
