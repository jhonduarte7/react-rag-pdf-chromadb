/**
 * Audit record of an ingested document in the backend.
 */
export interface DocumentRecord {
  id: number;
  filename: string;
  fileType: string;
  fileSizeBytes: number;
  chunkCount: number;
  status: 'INDEXED' | 'FAILED' | 'PENDING' | string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Detailed provenance metadata for a chunk retrieved from ChromaDB.
 */
export interface SourceMetadata {
  fileName: string;
  pageNumber: number | null;
  startLine: number | null;
  endLine: number | null;
  snippet: string;
  metadata?: Record<string, unknown>;
}

/**
 * Backend response DTO for a chat question.
 */
export interface ChatResponse {
  question: string;
  answer: string;
  sourceFiles: string[];
  sources?: SourceMetadata[];
}

/**
 * Request payload sent to backend /api/rag/chat.
 */
export interface ChatRequest {
  question: string;
  topK?: number;
}

/**
 * Chat message model used in frontend state.
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sourceFiles?: string[];
  sources?: SourceMetadata[];
  isLoading?: boolean;
  error?: string;
}
