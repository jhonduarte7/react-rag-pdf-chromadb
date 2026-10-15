import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, ExternalLink, FileText, Hash, Layers } from 'lucide-react';
import type { SourceMetadata } from '@/types/rag';
import { useRagStore } from '@/store/useRagStore';

interface SourceCitationPillsProps {
  sources?: SourceMetadata[];
  sourceFiles?: string[];
}

export const SourceCitationPills: React.FC<SourceCitationPillsProps> = ({
  sources = [],
  sourceFiles = [],
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const setSelectedSource = useRagStore((state) => state.setSelectedSource);

  const hasStructuredSources = sources && sources.length > 0;
  const hasFiles = sourceFiles && sourceFiles.length > 0;

  if (!hasStructuredSources && !hasFiles) {
    return null;
  }

  return (
    <div className="mt-3.5 border-t border-neutral-200/80 pt-3 text-xs dark:border-neutral-800/80">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 font-medium text-neutral-600 dark:text-neutral-400">
          <BookOpen className="h-3.5 w-3.5 text-blue-500" />
          <span>
            Context Sources & Metadata (ChromaDB) ({hasStructuredSources ? sources.length : sourceFiles.length})
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          {isExpanded ? (
            <>
              <span>Hide details</span>
              <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              <span>Show details</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Pill summary view */}
      <div className="flex flex-wrap gap-1.5">
        {hasStructuredSources ? (
          sources.map((src, idx) => {
            const pageText = src.pageNumber ? `Page ${src.pageNumber}` : null;
            const lineText =
              src.startLine !== null && src.endLine !== null
                ? src.startLine === src.endLine
                  ? `Line ${src.startLine}`
                  : `Lines ${src.startLine}-${src.endLine}`
                : null;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedSource(src)}
                className="group inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-100/80 px-2.5 py-1 text-left text-xs font-medium text-neutral-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-neutral-800 dark:bg-neutral-800/80 dark:text-neutral-300 dark:hover:border-blue-700/60 dark:hover:bg-blue-950/40 dark:hover:text-blue-300"
                title="Click to inspect snippet and detailed metadata"
              >
                <FileText className="h-3 w-3 text-neutral-400 group-hover:text-blue-500" />
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate max-w-[140px]">
                  {src.fileName}
                </span>

                {pageText && (
                  <span className="rounded bg-neutral-200/80 px-1 py-0.2 text-[10px] font-mono text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
                    {pageText}
                  </span>
                )}

                {lineText && (
                  <span className="rounded bg-blue-100/80 px-1 py-0.2 text-[10px] font-mono text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                    {lineText}
                  </span>
                )}

                <ExternalLink className="h-2.5 w-2.5 opacity-60 group-hover:opacity-100" />
              </button>
            );
          })
        ) : (
          sourceFiles.map((file, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300"
            >
              <FileText className="h-3 w-3 text-neutral-400" />
              <span className="font-medium">{file}</span>
            </span>
          ))
        )}
      </div>

      {/* Expanded detailed preview cards */}
      {isExpanded && hasStructuredSources && (
        <div className="mt-3 space-y-2">
          {sources.map((src, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-neutral-200 bg-white/70 p-3 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/60"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-neutral-100 dark:border-neutral-800/60">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {src.fileName}
                  </span>
                  {src.pageNumber && (
                    <span className="inline-flex items-center gap-1 rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-mono text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                      <Layers className="h-2.5 w-2.5" />
                      Page {src.pageNumber}
                    </span>
                  )}
                  {src.startLine !== null && (
                    <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-mono text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                      <Hash className="h-2.5 w-2.5" />
                      Lines {src.startLine} - {src.endLine ?? src.startLine}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedSource(src)}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Inspect snippet &rarr;
                </button>
              </div>

              {src.snippet && (
                <p className="mt-2 text-xs text-neutral-600 line-clamp-2 dark:text-neutral-400 italic">
                  "{src.snippet.trim()}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
