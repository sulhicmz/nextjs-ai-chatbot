import type {
  CoreAssistantMessage,
  CoreToolMessage,
  UIMessage,
  UIMessagePart,
} from 'ai';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { DBMessage, Document } from '@/lib/db/schema';
import { ChatSDKError, type ErrorCode } from './errors';
import type { ChatMessage, ChatTools, CustomUIDataTypes } from './types';
import { formatISO } from 'date-fns';
import { debugLog } from './debug';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    const { code, cause } = await response.json();
    throw new ChatSDKError(code as ErrorCode, cause);
  }

  return response.json();
};

export async function fetchWithErrorHandlers(
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  try {
    debugLog('Making fetch request to:', input);

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(input, {
      ...init,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    debugLog('Fetch response status:', response.status);

    if (!response.ok) {
      // Try to parse the error response
      let errorData: any;
      try {
        errorData = await response.json();
        debugLog('Error response data:', errorData);
      } catch (e) {
        // If we can't parse JSON, use text
        errorData = { message: await response.text() };
        debugLog('Error response text:', errorData.message);
      }

      // Check if this is an AI Gateway authentication error
      if (response.status === 401) {
        debugLog('AI Gateway authentication failed');
        throw new ChatSDKError(
          'unauthorized:chat',
          'AI Gateway authentication failed. Please check your API key.',
        );
      }

      // Check if this is a rate limit error
      if (response.status === 429) {
        debugLog('Rate limit exceeded');
        throw new ChatSDKError(
          'rate_limit:chat',
          'Rate limit exceeded. Please try again later.',
        );
      }

      // Pass through any ChatSDKError codes from the server
      if (errorData.code && errorData.message) {
        debugLog('Server error with code:', errorData.code);
        throw new ChatSDKError(errorData.code as ErrorCode, errorData.message);
      }

      debugLog('API request failed with status', response.status);
      throw new ChatSDKError(
        'offline:chat',
        `API request failed with status ${response.status}`,
      );
    }

    return response;
  } catch (error: unknown) {
    // Clear any existing timeout
    if (typeof clearTimeout !== 'undefined' && init?.timeoutId) {
      clearTimeout(init.timeoutId);
    }

    // Check for network connectivity issues
    if (typeof navigator !== 'undefined') {
      if (!navigator.onLine) {
        debugLog('No internet connection detected');
        throw new ChatSDKError(
          'offline:chat',
          'No internet connection detected.',
        );
      }

      // Additional check for network errors
      if (
        error instanceof TypeError &&
        (error.message.includes('fetch') ||
          error.message.includes('Failed to fetch'))
      ) {
        debugLog('Failed to connect to the server:', error.message);
        throw new ChatSDKError(
          'offline:chat',
          'Failed to connect to the server. Please check your internet connection.',
        );
      }
    }

    // Re-throw ChatSDKErrors as they are already properly formatted
    if (error instanceof ChatSDKError) {
      debugLog('ChatSDKError:', error.message);
      throw error;
    }

    // Handle timeout errors
    if (error instanceof Error && error.name === 'AbortError') {
      debugLog('Request timed out');
      throw new ChatSDKError(
        'offline:chat',
        'Request timed out. Please check your internet connection.',
      );
    }

    debugLog('Unhandled fetch error:', error);
    throw error;
  }
}

export function getLocalStorage(key: string) {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
  return [];
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

type ResponseMessageWithoutId = CoreToolMessage | CoreAssistantMessage;
type ResponseMessage = ResponseMessageWithoutId & { id: string };

export function getMostRecentUserMessage(messages: Array<UIMessage>) {
  const userMessages = messages.filter((message) => message.role === 'user');
  return userMessages.at(-1);
}

export function getDocumentTimestampByIndex(
  documents: Array<Document>,
  index: number,
) {
  if (!documents) return new Date();
  if (index > documents.length) return new Date();

  return documents[index].createdAt;
}

export function getTrailingMessageId({
  messages,
}: {
  messages: Array<ResponseMessage>;
}): string | null {
  const trailingMessage = messages.at(-1);

  if (!trailingMessage) return null;

  return trailingMessage.id;
}

export function sanitizeText(text: string) {
  return text.replace('<has_function_call>', '');
}

export function convertToUIMessages(messages: DBMessage[]): ChatMessage[] {
  return messages.map((message) => ({
    id: message.id,
    role: message.role as 'user' | 'assistant' | 'system',
    parts: message.parts as UIMessagePart<CustomUIDataTypes, ChatTools>[],
    metadata: {
      createdAt: formatISO(message.createdAt),
    },
  }));
}

export function getTextFromMessage(message: ChatMessage): string {
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('');
}
