import axios from 'axios';
import type { ChatRequest, ChatResponse, DocumentRecord } from '@/types/rag';

const api = axios.create({
  baseURL: '/api/rag',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 180000, // 180s (3 minutes) timeout for local Ollama CPU inference
});

/**
 * Fetch all ingested document records.
 */
export async function getDocuments(): Promise<DocumentRecord[]> {
  const response = await api.get<DocumentRecord[]>('/documents');
  return response.data;
}

/**
 * Ingest and vectorize a PDF document into ChromaDB.
 */
export async function uploadDocument(file: File): Promise<DocumentRecord> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<DocumentRecord>('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

/**
 * Query the RAG system with a question and topK context chunks.
 */
export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  const response = await api.post<ChatResponse>('/chat', request);
  return response.data;
}
