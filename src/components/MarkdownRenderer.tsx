import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Check, Copy } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

interface CodeBlockProps {
  className?: string;
  children?: React.ReactNode;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ className, children }) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying code to clipboard:', err);
    }
  };

  const isInline = !className && !String(children).includes('\n');

  if (isInline) {
    return (
      <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono font-medium text-blue-600 dark:bg-neutral-800 dark:text-blue-400">
        {children}
      </code>
    );
  }

  return (
    <div className="relative my-3 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-900 text-neutral-100 shadow-sm dark:border-neutral-800">
      <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950/60 px-3.5 py-1.5 text-xs text-neutral-400">
        <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-neutral-400">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          type="button"
          aria-label="Copy code"
          className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] font-medium text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-3.5 text-xs leading-relaxed font-mono">
        <pre>
          <code>{children}</code>
        </pre>
      </div>
    </div>
  );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="markdown-prose break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            return (
              <CodeBlock className={className} {...props}>
                {children}
              </CodeBlock>
            );
          },
          table({ children }) {
            return (
              <div className="my-3 overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
                <table className="min-w-full divide-y divide-neutral-200 text-left text-sm dark:divide-neutral-800">
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="bg-neutral-100 px-4 py-2.5 font-semibold text-neutral-800 dark:bg-neutral-800/80 dark:text-neutral-200">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="px-4 py-2 text-neutral-700 dark:text-neutral-300 border-t border-neutral-200 dark:border-neutral-800">
                {children}
              </td>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="my-2.5 border-l-4 border-blue-500 pl-4 py-1 italic text-neutral-600 dark:text-neutral-400 bg-blue-50/50 dark:bg-blue-950/20 rounded-r">
                {children}
              </blockquote>
            );
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
