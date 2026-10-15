import React, { useState, useEffect } from 'react';
import { User, Copy, Check, Sparkles, AlertCircle } from 'lucide-react';
import type { ChatMessage } from '@/types/rag';
import { MarkdownRenderer } from './MarkdownRenderer';
import { SourceCitationPills } from './SourceCitationPills';

interface ChatMessageItemProps {
  message: ChatMessage;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!message.isLoading) return;
    setElapsed(0);
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [message.isLoading]);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying message:', err);
    }
  };

  const getLoadingStatus = (sec: number) => {
    if (sec < 4) return 'Searching ChromaDB vector store...';
    if (sec < 12) return 'Retrieving matching chunks & citations...';
    return 'Synthesizing response with local AI (Ollama)...';
  };

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 px-4 py-3 sm:px-6">
        <div className="flex max-w-[85%] sm:max-w-[75%] flex-col items-end">
          <div className="flex items-center gap-1.5 pb-1 text-[11px] text-neutral-400">
            <span>You</span>
            <span>•</span>
            <span>
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          <div className="rounded-2xl rounded-tr-xs bg-blue-600 px-4 py-2.5 text-sm text-white shadow-sm dark:bg-blue-600">
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          </div>
        </div>

        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
          <User className="h-4 w-4" />
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="flex gap-3 px-4 py-4 sm:px-6 bg-neutral-100/40 dark:bg-neutral-900/30 border-y border-neutral-100/80 dark:border-neutral-900/50">
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 text-white shadow-xs">
        <Sparkles className="h-4 w-4" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between pb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
              RAG AI Assistant
            </span>
            <span className="rounded bg-blue-100/70 px-1.5 py-0.2 text-[10px] font-mono text-blue-700 dark:bg-blue-950 dark:text-blue-400">
              ChromaDB + Ollama
            </span>
            <span className="text-[11px] text-neutral-400">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          {!message.isLoading && !message.error && (
            <button
              onClick={handleCopyMessage}
              type="button"
              className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs text-neutral-400 hover:bg-neutral-200/60 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 transition-colors"
              title="Copy full response"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-500" />
                  <span className="text-[11px] text-emerald-500">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span className="text-[11px]">Copy</span>
                </>
              )}
            </button>
          )}
        </div>

        {message.isLoading ? (
          <div className="space-y-3 py-2 animate-pulse">
            <div className="flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>{getLoadingStatus(elapsed)}</span>
              <span className="font-mono text-[11px] text-neutral-400">({elapsed}s)</span>
            </div>
            <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800"></div>
            <div className="h-4 w-5/6 rounded bg-neutral-200 dark:bg-neutral-800"></div>
            <div className="h-4 w-2/3 rounded bg-neutral-200 dark:bg-neutral-800"></div>
          </div>
        ) : message.error ? (
          <div className="rounded-xl border border-red-200 bg-red-50/70 p-3.5 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle className="h-4 w-4" />
              <span>An error occurred while generating the response:</span>
            </div>
            <p className="mt-1">{message.error}</p>
          </div>
        ) : (
          <div className="text-neutral-800 dark:text-neutral-200">
            {/* Markdown Body */}
            <MarkdownRenderer content={message.content} />

            {/* Structured Source Provenance and Metadata */}
            <SourceCitationPills
              sources={message.sources}
              sourceFiles={message.sourceFiles}
            />
          </div>
        )}
      </div>
    </div>
  );
};
