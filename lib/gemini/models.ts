export const MODEL_PRIORITY = [
  /flash/i,
  /pro/i,
]

const CACHE_TTL_MS = 5 * 60 * 1000

interface GeminiModel {
  name: string
  supportedGenerationMethods?: string[]
}

interface ModelsResponse {
  models?: GeminiModel[]
}

interface CacheEntry {
  model: string
  expiresAt: number
}

const cache = new Map<string, CacheEntry>()

export async function getAvailableModel(apiKey: string): Promise<string> {
  const cached = cache.get(apiKey)
  if (cached && Date.now() < cached.expiresAt) {
    return cached.model
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    )

    if (!response.ok) {
      throw new Error(`Gemini API returned ${response.status}`)
    }

    const data = (await response.json()) as ModelsResponse
    const models = data.models ?? []

    const candidates = models.filter((model) =>
      model.supportedGenerationMethods?.includes('generateContent')
    )

    const selected = candidates.find((model) =>
      MODEL_PRIORITY.some((pattern) => pattern.test(model.name))
    )

    const model = selected?.name ?? 'models/gemini-2.0-flash'

    cache.set(apiKey, { model, expiresAt: Date.now() + CACHE_TTL_MS })
    return model
  } catch {
    return 'models/gemini-2.0-flash'
  }
}
