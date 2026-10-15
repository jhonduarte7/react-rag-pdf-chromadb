import React, { useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { useRagStore } from '@/store/useRagStore';
import { ChatMessageItem } from './ChatMessageItem';

interface ChatAreaProps {
  onSelectPrompt: (prompt: string) => void;
  hasDocuments: boolean;
}

const STARTER_PROMPTS = [
  {
    title: 'Executive Summary',
    desc: 'Synthesize the key takeaways and main conclusions of the document.',
    prompt: 'Could you provide an executive summary of the main points and conclusions in the document?',
  },
  {
    title: 'Key Metrics & Data',
    desc: 'Extract quantitative figures, key metrics, or statistics found.',
    prompt: 'What are the most relevant quantitative data, metrics, or statistics described in the document?',
  },
  {
    title: 'Terms & Requirements',
    desc: 'Identify important dates, clauses, obligations, or conditions.',
    prompt: 'What are the key dates, requirements, or conditions mentioned in the document?',
  },
  {
    title: 'Detailed Analysis',
    desc: 'Explain core concepts with references to document sections.',
    prompt: 'Explain the central themes of the document in detail, highlighting key sections and references.',
  },
];

export const ChatArea: React.FC<ChatAreaProps> = ({ onSelectPrompt, hasDocuments }) => {
  const { messages } = useRagStore();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <div className="mx-auto max-w-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg">
            <Sparkles className="h-7 w-7" />
          </div>

          <h2 className="mt-4 text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-2xl">
            RAG Assistant with ChromaDB
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Ask smart questions about your PDF documents. Responses are generated in clean
            Markdown with exact citations including <strong>file name</strong>, <strong>page</strong>, and <strong>lines</strong>.
          </p>

          {!hasDocuments && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
              <BookOpen className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>Upload a PDF document from the sidebar to start chatting.</span>
            </div>
          )}

          {/* Starter prompts grid */}
          <div className="mt-8 grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-left">
            {STARTER_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectPrompt(item.prompt)}
                disabled={!hasDocuments}
                className="group relative flex flex-col justify-between rounded-xl border border-neutral-200/90 bg-white p-3.5 shadow-2xs transition-all hover:border-blue-400 hover:shadow-sm disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-850/60 dark:hover:border-blue-500"
              >
                <div>
                  <h3 className="text-xs font-semibold text-neutral-800 group-hover:text-blue-600 dark:text-neutral-200 dark:group-hover:text-blue-400">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400">
                  <span>Ask this</span>
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-4xl py-2">
        {messages.map((message) => (
          <ChatMessageItem key={message.id} message={message} />
        ))}
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
};
