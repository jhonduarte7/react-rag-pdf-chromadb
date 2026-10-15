import React from 'react';
import {
  Menu,
  Moon,
  Sun,
  Trash2,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useRagStore } from '@/store/useRagStore';

export const Header: React.FC = () => {
  const {
    theme,
    toggleTheme,
    clearChat,
    messages,
    toggleSidebar,
    topK,
  } = useRagStore();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-neutral-200/80 bg-white/80 px-4 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-900/80 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          type="button"
          className="rounded-lg p-1.5 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 lg:hidden"
          aria-label="Toggle document sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 text-white shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                RAG PDF ChromaDB
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                ChromaDB vStore
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-neutral-500 dark:text-neutral-400">
              Spring AI • Qwen 1.7B • Chroma Vector DB
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* TopK indicator pill */}
        <div className="hidden sm:flex items-center gap-1 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-800/60 dark:text-neutral-300">
          <Layers className="h-3.5 w-3.5 text-blue-500" />
          <span className="font-mono text-[11px]">topK: {topK} chunks</span>
        </div>

        {/* Clear chat button */}
        {messages.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear the conversation?')) {
                clearChat();
              }
            }}
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-red-950/40 dark:hover:border-red-900/50 dark:hover:text-red-400 transition-colors"
            title="Clear current conversation"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        )}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          type="button"
          className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-neutral-700" />
          )}
        </button>
      </div>
    </header>
  );
};
