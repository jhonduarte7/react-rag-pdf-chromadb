import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  UploadCloud,
  FileText,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  X,
  Layers,
  HardDrive,
} from 'lucide-react';
import { getDocuments, uploadDocument } from '@/services/ragApi';
import { formatBytes, formatDate } from '@/lib/utils';
import { useRagStore } from '@/store/useRagStore';

export const DocumentSidebar: React.FC = () => {
  const queryClient = useQueryClient();
  const { isSidebarOpen, setSidebarOpen } = useRagStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // TanStack Query for documents
  const {
    data: documents = [],
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['documents'],
    queryFn: getDocuments,
    refetchInterval: 15000,
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => {
      setUploadError(null);
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || 'Error processing the PDF document';
      setUploadError(msg);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Only PDF documents are supported');
      return;
    }
    if (file.size > 30 * 1024 * 1024) {
      setUploadError('File exceeds maximum size limit of 30MB');
      return;
    }
    setUploadError(null);
    uploadMutation.mutate(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex w-80 sm:w-88 flex-col border-r border-neutral-200 bg-white transition-transform duration-300 ease-in-out dark:border-neutral-800 dark:bg-neutral-900 lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3.5 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Database className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                ChromaDB Documents
              </h2>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                {documents.length} {documents.length === 1 ? 'file' : 'files'} indexed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => refetch()}
              type="button"
              className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
              title="Refresh list"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefetching ? 'animate-spin text-blue-500' : ''}`}
              />
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              type="button"
              className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 lg:hidden"
              aria-label="Close panel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Upload Dropzone */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/30">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center transition-all ${
              dragActive
                ? 'border-blue-500 bg-blue-50/50 dark:border-blue-400 dark:bg-blue-950/30'
                : 'border-neutral-300 hover:border-blue-400 hover:bg-neutral-100/50 dark:border-neutral-700 dark:hover:border-blue-500 dark:hover:bg-neutral-800/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100/80 text-blue-600 transition-transform group-hover:scale-110 dark:bg-blue-950 dark:text-blue-400">
              <UploadCloud className="h-5 w-5" />
            </div>

            <p className="mt-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              {uploadMutation.isPending ? 'Indexing into ChromaDB...' : 'Upload PDF Document'}
            </p>
            <p className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
              Drag & drop or click to browse
            </p>

            {uploadMutation.isPending && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium animate-pulse">
                <RefreshCw className="h-3 w-3 animate-spin" />
                <span>Extracting pages and generating embeddings...</span>
              </div>
            )}
          </div>

          {uploadError && (
            <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-red-50 p-2 text-[11px] text-red-700 dark:bg-red-950/50 dark:text-red-300">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {uploadMutation.isSuccess && (
            <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-emerald-50 p-2 text-[11px] text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span>PDF successfully indexed into ChromaDB</span>
            </div>
          )}
        </div>

        {/* Ingested Documents List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="flex items-center justify-between px-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            <span>Available Documents</span>
            <span>{documents.length}</span>
          </div>

          {isLoading ? (
            <div className="space-y-2 py-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 animate-pulse"
                />
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 dark:bg-neutral-800">
                <FileText className="h-6 w-6" />
              </div>
              <p className="mt-3 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                No documents indexed yet
              </p>
              <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                Upload your first PDF to vectorize its pages into ChromaDB.
              </p>
            </div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="group relative rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-3 transition-all hover:border-neutral-300 hover:bg-neutral-100/80 dark:border-neutral-800/80 dark:bg-neutral-850/50 dark:hover:border-neutral-700 dark:hover:bg-neutral-800/80 shadow-2xs"
              >
                <div className="flex items-start gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100/80 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                    <FileCheck className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3
                      className="truncate text-xs font-semibold text-neutral-900 dark:text-neutral-100"
                      title={doc.filename}
                    >
                      {doc.filename}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-neutral-500 dark:text-neutral-400">
                      <span className="inline-flex items-center gap-1 font-mono">
                        <HardDrive className="h-2.5 w-2.5" />
                        {formatBytes(doc.fileSizeBytes)}
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-1 py-0.2 font-mono text-blue-700 dark:bg-blue-950/80 dark:text-blue-300">
                        <Layers className="h-2.5 w-2.5" />
                        {doc.chunkCount} chunks
                      </span>
                    </div>

                    <div className="mt-1 flex items-center justify-between text-[10px] text-neutral-400">
                      <span>{formatDate(doc.createdAt)}</span>
                      <span
                        className={`font-semibold uppercase tracking-wider ${
                          doc.status === 'INDEXED'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
};
