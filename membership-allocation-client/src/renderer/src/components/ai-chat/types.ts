export type ChatRole = 'assistant' | 'user'

export interface ChatMessage {
  id: string
  role: ChatRole
  message: string
  timestamp: string
}

export interface AIChatResponse {
  status: string
  data: {
    queryExecuted?: unknown
    resultsCount?: number
    resultsList?: unknown
    summary?: string
  }
}
