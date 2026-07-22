import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleGenAI, createPartFromUri, createUserContent } from '@google/genai'
import { getAvailableModel } from '@/lib/gemini/models'

function extractVideoId(url: string): string | null {
  try {
    const parsed = new URL(url)
    const hostname = parsed.hostname.replace(/^(www\.|m\.)/, '')

    if (hostname === 'youtube.com') {
      if (parsed.pathname === '/watch') {
        return parsed.searchParams.get('v')
      }
      const match = parsed.pathname.match(/^\/(embed|v|shorts)\/([^/]+)/)
      if (match) {
        return match[2]
      }
    }

    if (hostname === 'youtu.be') {
      return parsed.pathname.slice(1) || null
    }

    return null
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      )
    }

    const videoId = extractVideoId(url)
    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL format' },
        { status: 400 }
      )
    }

    // Get authenticated user
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('gemini_api_key, gemini_model, language')
      .eq('user_id', user.id)
      .single()

    if (settingsError || !settings?.gemini_api_key) {
      return NextResponse.json(
        { error: 'Gemini API key not found. Please add your API key in Settings.' },
        { status: 400 }
      )
    }

    // Call Gemini API
    const ai = new GoogleGenAI({ apiKey: settings.gemini_api_key })

    const languageMap: Record<string, string> = {
      ko: '한국어', en: 'English', ja: '日本語', zh: '中文', es: 'Español',
    }
    const lang = settings.language || 'en'
    const langName = languageMap[lang] || 'English'
    const prompt = `You must respond in ${langName}. Watch this YouTube video and summarize it in markdown format. Include key points, timestamps if available, and main takeaways.`

    const model = await getAvailableModel(
      settings.gemini_api_key,
      settings.gemini_model ?? undefined
    )

    const response = await ai.models.generateContent({
      model,
      // mimeType is a required placeholder for the SDK type — Gemini fetches
      // the actual video server-side from a public YouTube URL regardless of it.
      contents: createUserContent([createPartFromUri(url, 'video/mp4'), prompt]),
    })

    const summary = response.text

    if (!summary) {
      return NextResponse.json(
        { error: 'Gemini API returned no content' },
        { status: 500 }
      )
    }

    // Try to extract a title from the summary (first line or heading)
    const titleMatch = summary.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1].trim() : 'YouTube Video Summary'

    return NextResponse.json({ summary, title })
  } catch (error) {
    console.error('Summarize API error:', error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}
