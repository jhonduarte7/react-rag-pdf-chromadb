import React, { useState, useEffect } from 'react';
import { X, Copy, Check, FileText, Layers, Hash, Code2, Database } from 'lucide-react';
import { useRagStore } from '@/store/useRagStore';
import { formatBytes } from '@/lib/utils';

export const SourceInspectorModal: React.FC = () => {
  const { selectedSource, setSelectedSource } = useRagStore();
  const [activeTab, setActiveTab] = useState<'snippet' | 'metadata'>('snippet');
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedMeta, setCopiedMeta] = useState(false);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedSource(null);
      }
    };
    if (selectedSource) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSource, setSelectedSource]);

  if (!selectedSource) return null;

  const lines = selectedSource.snippet.split('\n');
  const baseLineNumber = selectedSource.startLine ?? 1;

  const handleCopySnippet = async () => {
    try {
      await navigator.clipboard.writeText(selectedSource.snippet);
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    } catch (err) {
      console.error('Error copying snippet:', err);
    }
  };

  const handleCopyMeta = async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(selectedSource.metadata ?? selectedSource, null, 2)
      );
      setCopiedMeta(true);
      setTimeout(() => setCopiedMeta(false), 2000);
    } catch (err) {
      console.error('Error copying metadata:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative flex flex-col w-full max-w-3xl max-h-[85vh] rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <FileText className="h-4 w-4" />
              </span>
              <h2 id="modal-headline" className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                {selectedSource.fileName}
              </h2>
            </div>
            {/* Badges for page and line info */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {selectedSource.pageNumber && (
                <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-mono font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                  <Layers className="h-3 w-3 text-neutral-500" />
                  Page: {selectedSource.pageNumber}
                </span>
              )}
              {selectedSource.startLine !== null && (
                <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-mono font-medium text-blue-700 dark:bg-blue-950/80 dark:text-blue-300">
                  <Hash className="h-3 w-3 text-blue-500" />
                  Lines: {selectedSource.startLine} - {selectedSource.endLine ?? selectedSource.startLine}
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-mono font-medium text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
                <Database className="h-3 w-3 text-emerald-500" />
                ChromaDB Vector Store
              </span>
            </div>
          </div>

          <button
            onClick={() => setSelectedSource(null)}
            type="button"
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-neutral-200 px-6 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-950/40">
          <button
            type="button"
            onClick={() => setActiveTab('snippet')}
            className={`flex items-center gap-2 py-3 px-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'snippet'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Text Snippet (Lines {selectedSource.startLine ?? 1}-{selectedSource.endLine ?? lines.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('metadata')}
            className={`flex items-center gap-2 py-3 px-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'metadata'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            <Code2 className="h-4 w-4" />
            <span>Full Metadata (JSON)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'snippet' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Exact text chunk retrieved via semantic similarity:</span>
                <button
                  type="button"
                  onClick={handleCopySnippet}
                  className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
                >
                  {copiedSnippet ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-emerald-500">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy snippet</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-950 p-4 font-mono text-xs text-neutral-200 shadow-inner dark:border-neutral-800 overflow-x-auto">
                <div className="table w-full">
                  {lines.map((line, idx) => {
                    const currentLine = baseLineNumber + idx;
                    return (
                      <div key={idx} className="table-row leading-relaxed hover:bg-neutral-900/60">
                        <span className="table-cell select-none pr-4 text-right text-neutral-500 font-mono text-[11px] w-8">
                          {currentLine}
                        </span>
                        <span className="table-cell whitespace-pre-wrap">{line || ' '}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Properties indexed in ChromaDB:</span>
                <button
                  type="button"
                  onClick={handleCopyMeta}
                  className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
                >
                  {copiedMeta ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-emerald-500">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
              </div>

              {/* Key metadata grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/40">
                  <span className="text-neutral-500 dark:text-neutral-400">Source File</span>
                  <p className="mt-1 font-semibold truncate text-neutral-900 dark:text-neutral-100">
                    {selectedSource.fileName}
                  </p>
                </div>
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/40">
                  <span className="text-neutral-500 dark:text-neutral-400">PDF Page</span>
                  <p className="mt-1 font-semibold font-mono text-neutral-900 dark:text-neutral-100">
                    {selectedSource.pageNumber ?? 'N/A'}
                  </p>
                </div>
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/40">
                  <span className="text-neutral-500 dark:text-neutral-400">Line Range</span>
                  <p className="mt-1 font-semibold font-mono text-neutral-900 dark:text-neutral-100">
                    {selectedSource.startLine ?? 1} - {selectedSource.endLine ?? 1}
                  </p>
                </div>
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/40">
                  <span className="text-neutral-500 dark:text-neutral-400">File Size</span>
                  <p className="mt-1 font-semibold font-mono text-neutral-900 dark:text-neutral-100">
                    {selectedSource.metadata?.file_size
                      ? formatBytes(Number(selectedSource.metadata.file_size))
                      : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-950 p-4 font-mono text-xs text-emerald-400 shadow-inner dark:border-neutral-800 overflow-x-auto">
                <pre>{JSON.stringify(selectedSource.metadata ?? selectedSource, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-neutral-200 px-6 py-3 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-950/40">
          <button
            type="button"
            onClick={() => setSelectedSource(null)}
            className="rounded-lg bg-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
