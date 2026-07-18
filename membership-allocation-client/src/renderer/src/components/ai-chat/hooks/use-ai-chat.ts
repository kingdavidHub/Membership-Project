import { useCallback, useEffect, useState } from 'react'
import { apiClient } from '@/api/client'
import { API_ENDPOINTS } from '@/api/endpoints'
import type { AIChatResponse, ChatMessage } from '../types'

const STORAGE_KEY = 'mbhs-admin-ai-chat-history'

const readStoredMessages = (): ChatMessage[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed: unknown = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed.filter(isChatMessage) : []
  } catch {
    return []
  }
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return (
    typeof record.id === 'string' &&
    (record.role === 'assistant' || record.role === 'user') &&
    typeof record.message === 'string' &&
    typeof record.timestamp === 'string'
  )
}

const createMessage = (role: ChatMessage['role'], message: string): ChatMessage => {
  const id =
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`

  return {
    id,
    role,
    message,
    timestamp: new Date().toISOString()
  }
}

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(readStoredMessages)
  const [isLoading, setIsLoading] = useState(false)
  const [rawResponse, setRawResponse] = useState<AIChatResponse | null>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  const clearConversation = useCallback(() => {
    setMessages([])
    setRawResponse(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const sendMessage = useCallback(async (prompt: string) => {
    const trimmedPrompt = prompt.trim()
    if (!trimmedPrompt || isLoading) return

    setMessages((current) => [...current, createMessage('user', trimmedPrompt)])
    setIsLoading(true)
    try {
      const response = (await apiClient.post(API_ENDPOINTS.AI_CHAT.ASK, {
        prompt: trimmedPrompt
      })) as AIChatResponse
      setRawResponse(response)
      setMessages((current) => [
        ...current,
        createMessage('assistant', response.data?.summary || 'I could not find a summary for that request.')
      ])
    } catch {
      setMessages((current) => [
        ...current,
        createMessage('assistant', "Sorry, I couldn't process your request.\n\nPlease try again.")
      ])
    } finally {
      setIsLoading(false)
    }
  }, [isLoading])

  return { messages, isLoading, rawResponse, sendMessage, clearConversation }
}
