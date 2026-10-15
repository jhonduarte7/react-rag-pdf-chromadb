import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from './components/Header';
import { DocumentSidebar } from './components/DocumentSidebar';
import { ChatArea } from './components/ChatArea';
import { ChatInput } from './components/ChatInput';
import { SourceInspectorModal } from './components/SourceInspectorModal';
import { useRagStore } from './store/useRagStore';
import { getDocuments, sendChatMessage } from './services/ragApi';

export const App: React.FC = () => {
  const { topK, addMessage, updateMessage } = useRagStore();
  const [isQueryPending, setIsQueryPending] = useState(false);

  // Retrieve ingested documents to know if user can query
  const { data: documents = [] } = useQuery({
    queryKey: ['documents'],
    queryFn: getDocuments,
  });

  const handleSendMessage = async (question: string) => {
    if (!question.trim() || isQueryPending) return;

    // 1. Add User Message
    addMessage({
      role: 'user',
      content: question,
    });

    // 2. Add Loading Assistant Message placeholder
    const assistantMsgId = addMessage({
      role: 'assistant',
      content: '',
      isLoading: true,
    });

    setIsQueryPending(true);

    try {
      // 3. Request RAG Chat from backend
      const response = await sendChatMessage({
        question,
        topK,
      });

      // 4. Update Assistant Message with Answer and Sources
      updateMessage(assistantMsgId, {
        content: response.answer,
        sourceFiles: response.sourceFiles,
        sources: response.sources,
        isLoading: false,
      });
    } catch (error: any) {
      console.error('Error during RAG query:', error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        'Could not connect to the RAG backend service. Please verify that the backend is running on port 8085.';

      updateMessage(assistantMsgId, {
        content: '',
        error: errorMsg,
        isLoading: false,
      });
    } finally {
      setIsQueryPending(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* Left Ingestion & Documents Panel */}
      <DocumentSidebar />

      {/* Main Chat Interface */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        <main className="flex flex-1 flex-col overflow-hidden bg-neutral-50/50 dark:bg-neutral-950/50">
          <ChatArea
            onSelectPrompt={handleSendMessage}
            hasDocuments={documents.length > 0}
          />

          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isQueryPending}
            disabled={documents.length === 0}
          />
        </main>
      </div>

      {/* Provenance & Metadata Inspector Modal */}
      <SourceInspectorModal />
    </div>
  );
};

export default App;
