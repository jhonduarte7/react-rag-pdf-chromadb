import React, { useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, SlidersHorizontal, Loader2 } from 'lucide-react';
import { useRagStore } from '@/store/useRagStore';

const chatSchema = z.object({
  question: z.string().trim().min(1, 'Please enter a question'),
});

type ChatFormData = z.infer<typeof chatSchema>;

interface ChatInputProps {
  onSendMessage: (question: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  disabled = false,
}) => {
  const { topK, setTopK } = useRagStore();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
  } = useForm<ChatFormData>({
    resolver: zodResolver(chatSchema),
    defaultValues: { question: '' },
  });

  const questionValue = watch('question');

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [questionValue]);

  const onSubmit = (data: ChatFormData) => {
    if (isLoading || disabled) return;
    onSendMessage(data.question);
    reset({ question: '' });
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const { ref: formRef, ...registerProps } = register('question');

  return (
    <div className="border-t border-neutral-200/80 bg-white/80 p-3 sm:p-4 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-900/80">
      <div className="mx-auto max-w-4xl">
        {/* Controls row */}
        <div className="flex items-center justify-between gap-2 pb-2 text-xs">
          <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>ChromaDB Context (topK):</span>
            <div className="inline-flex rounded-md bg-neutral-100 p-0.5 dark:bg-neutral-800">
              {[2, 4, 6, 8].map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setTopK(k)}
                  className={`rounded px-2 py-0.5 text-[11px] font-mono transition-colors ${
                    topK === k
                      ? 'bg-blue-600 font-semibold text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                  }`}
                  title={`Retrieve ${k} most similar context chunks`}
                >
                  {k}
                </button>
              ))}
            </div>
            <span className="hidden sm:inline text-[11px] text-neutral-400">chunks</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-neutral-400">
            <span>
              <kbd className="rounded border border-neutral-200 bg-neutral-100 px-1 py-0.2 font-mono text-[10px] dark:border-neutral-700 dark:bg-neutral-800">
                Enter
              </kbd>{' '}
              send
            </span>
            <span>•</span>
            <span>
              <kbd className="rounded border border-neutral-200 bg-neutral-100 px-1 py-0.2 font-mono text-[10px] dark:border-neutral-700 dark:bg-neutral-800">
                Shift + Enter
              </kbd>{' '}
              new line
            </span>
          </div>
        </div>

        {/* Input box */}
        <form onSubmit={handleSubmit(onSubmit)} className="relative flex items-end gap-2">
          <div className="relative flex-1 rounded-2xl border border-neutral-300 bg-neutral-50/70 shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800/60 dark:focus-within:border-blue-400">
            <textarea
              {...registerProps}
              ref={(e) => {
                formRef(e);
                textareaRef.current = e;
              }}
              onKeyDown={handleKeyDown}
              disabled={isLoading || disabled}
              rows={1}
              placeholder={
                disabled
                  ? 'Upload or index a PDF first to begin...'
                  : 'Ask a question about your indexed documents...'
              }
              className="w-full resize-none bg-transparent px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-100 dark:placeholder:text-neutral-500 max-h-[160px] min-h-[44px]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || disabled || !questionValue?.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md transition-all hover:bg-blue-700 active:scale-95 disabled:pointer-events-none disabled:opacity-40 dark:bg-blue-600 dark:hover:bg-blue-500"
            aria-label="Send question"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
