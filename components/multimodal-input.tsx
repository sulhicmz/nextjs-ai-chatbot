'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Button } from './button';
import { FileUploader } from './file-uploader';
import { Textarea } from './textarea';
import { useEnterSubmit } from '@/hooks/use-enter-submit';
import { SendIcon } from './icons';
import type { Attachment, ChatMessage } from '@/lib/types';
import { useChatVisibility } from '@/hooks/use-chat-visibility';
import { VisibilitySelector } from './visibility-selector';
import type { VisibilityType } from './visibility-selector';
import { toast } from './toast';
import { RotateCwIcon } from 'lucide-react';
import type { LanguageModelUsage } from 'ai';
import type { ChatModel } from '@/lib/ai/models';

interface MultimodalInputProps {
  chatId: string;
  input: string;
  setInput: (input: string) => void;
  status: string;
  stop: () => void;
  attachments: Array<Attachment>;
  setAttachments: (attachments: Array<Attachment>) => void;
  messages: Array<ChatMessage>;
  setMessages: (messages: Array<ChatMessage>) => void;
  sendMessage: (message: ChatMessage) => void;
  selectedVisibilityType: VisibilityType;
  selectedModelId: ChatModel['id'];
  usage?: LanguageModelUsage;
}

export function MultimodalInput({
  chatId,
  input,
  setInput,
  status,
  stop,
  attachments,
  setAttachments,
  messages,
  setMessages,
  sendMessage,
  selectedVisibilityType,
  selectedModelId,
  usage,
}: MultimodalInputProps) {
  const [lastMessage, setLastMessage] = useState<ChatMessage | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const { formRef, onKeyDown: onKeyDownProp } = useEnterSubmit();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { visibilityType } = useChatVisibility({
    chatId,
    initialVisibilityType: selectedVisibilityType,
  });
  const [_, setStoredValue] = useLocalStorage('chat-model', selectedModelId);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setStoredValue(selectedModelId);
  }, [selectedModelId, setStoredValue]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDownProp(e);
  };

  const handleSend = () => {
    if (status === 'in_progress' || input.trim() === '') {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      parts: [{ type: 'text', text: input }],
    };

    // Store the last message for potential retry
    setLastMessage(userMessage);
    sendMessage(userMessage);
    setInput('');
    setAttachments([]);
  };

  const handleRetry = () => {
    if (lastMessage && !isRetrying) {
      setIsRetrying(true);
      toast({
        type: 'error',
        description: 'Retrying your message...',
      });

      // Remove the failed assistant message if it exists
      const updatedMessages = [...messages];
      if (
        updatedMessages.length > 0 &&
        updatedMessages[updatedMessages.length - 1].role === 'assistant'
      ) {
        updatedMessages.pop();
        setMessages(updatedMessages);
      }

      // Resend the last user message
      sendMessage(lastMessage);

      setTimeout(() => setIsRetrying(false), 2000);
    }
  };

  return (
    <div className="relative w-full flex flex-col gap-4">
      <div className="flex flex-col gap-2 w-full">
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex flex-col gap-4 w-full"
        >
          <div className="flex flex-col gap-2 w-full border-t border-t-border/20 pt-4 md:pt-4">
            <div className="flex gap-3 w-full items-end">
              <div className="flex-1 flex flex-col gap-2">
                <Textarea
                  ref={inputRef}
                  className="min-h-[60px]"
                  placeholder="Type your message here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  disabled={status === 'in_progress'}
                />
                <div className="flex gap-3 items-center justify-between">
                  <FileUploader
                    chatId={chatId}
                    attachments={attachments}
                    setAttachments={setAttachments}
                    disabled={status === 'in_progress'}
                  />
                  <div className="flex gap-2">
                    {status === 'in_progress' ? (
                      <Button
                        className="rounded-full"
                        type="button"
                        variant="outline"
                        onClick={(e) => {
                          e.preventDefault();
                          stop();
                        }}
                      >
                        Stop
                      </Button>
                    ) : null}
                    <Button
                      className="rounded-full"
                      type="submit"
                      disabled={status === 'in_progress' || input.trim() === ''}
                    >
                      <SendIcon />
                      <span className="sr-only">Send</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
        {usage ? (
          <div className="text-xs text-zinc-500 dark:text-zinc-400 flex flex-row gap-1 w-full justify-end">
            <span>
              {usage.promptTokens} prompt tokens, {usage.completionTokens}{' '}
              completion tokens
            </span>
          </div>
        ) : null}
      </div>
      <div className="flex flex-row gap-2 justify-between">
        <VisibilitySelector
          chatId={chatId}
          initialVisibilityType={visibilityType}
        />
        {lastMessage && messages.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            disabled={isRetrying || status === 'in_progress'}
            className="text-xs"
          >
            <RotateCwIcon className="size-3 mr-1" />
            Retry Last Message
          </Button>
        )}
      </div>
    </div>
  );
}
