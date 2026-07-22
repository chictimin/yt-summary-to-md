import { GoogleGenAI } from '@google/genai'

const MODEL_PREFIXES = ['models/gemini']
const MODEL_EXCLUDE = [/lite/i, /preview/i]

export const MODEL_PRIORITY = [
  /flash/i,
  /pro/i,
]

const CACHE_TTL_MS = 5 * 60 * 1000

interface CacheEntry {
  model: string
  expiresAt: number
}

const cache = new Map<string, CacheEntry>()

function supportsGenerateContent(model: {
  supportedGenerationMethods?: string[]
  supportedActions?: string[]
}): boolean {
  return (
    model.supportedGenerationMethods?.includes('generateContent') ??
    model.supportedActions?.includes('generateContent') ??
    false
  )
}

export async function listAvailableModels(apiKey: string): Promise<string[]> {
  const ai = new GoogleGenAI({ apiKey })
  const pager = await ai.models.list()

  const models: string[] = []
  for await (const model of pager) {
    if (
      model.name &&
      MODEL_PREFIXES.some((prefix) => model.name!.startsWith(prefix)) &&
      !MODEL_EXCLUDE.some((pattern) => pattern.test(model.name!)) &&
      supportsGenerateContent(model as { supportedGenerationMethods?: string[]; supportedActions?: string[] })
    ) {
      models.push(model.name)
    }
  }

  return models.reverse()
}

export async function getAvailableModel(
  apiKey: string,
  preferredModel?: string
): Promise<string> {
  const cacheKey = preferredModel ? `${apiKey}:${preferredModel}` : apiKey
  const cached = cache.get(cacheKey)
  if (cached && Date.now() < cached.expiresAt) {
    return cached.model
  }

  try {
    const availableModels = await listAvailableModels(apiKey)

    if (preferredModel && availableModels.includes(preferredModel)) {
      cache.set(cacheKey, {
        model: preferredModel,
        expiresAt: Date.now() + CACHE_TTL_MS,
      })
      return preferredModel
    }

    const flashModel = availableModels.find((m) => /flash/i.test(m))
    const model = flashModel ?? availableModels[availableModels.length - 1]

    cache.set(cacheKey, { model, expiresAt: Date.now() + CACHE_TTL_MS })
    return model
  } catch {
    return preferredModel ?? 'models/gemini-2.0-flash'
  }
}
