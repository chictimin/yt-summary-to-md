import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleGenAI } from '@google/genai'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      )
    }

    // Validate YouTube URL format
    const isValidYoutubeUrl =
      url.match(
        /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)/
      )

    if (!isValidYoutubeUrl) {
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

    // Fetch user's Gemini API key from user_settings
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('gemini_api_key')
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

    const prompt = `Summarize this YouTube video in markdown format. Include key points, timestamps if available, and main takeaways.\n\nVideo URL: ${url}`

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
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
