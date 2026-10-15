import { create } from 'zustand';
import type { ChatMessage, SourceMetadata } from '@/types/rag';

interface RagState {
  messages: ChatMessage[];
  topK: number;
  theme: 'light' | 'dark';
  selectedSource: SourceMetadata | null;
  isSidebarOpen: boolean;

  // Actions
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => string;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  clearChat: () => void;
  setTopK: (topK: number) => void;
  setSelectedSource: (source: SourceMetadata | null) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('rag-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
  }
  return 'dark';
};

export const useRagStore = create<RagState>((set, get) => {
  const initialTheme = getInitialTheme();

  // Apply dark class to <html>
  if (typeof document !== 'undefined') {
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  return {
    messages: [],
    topK: 4,
    theme: initialTheme,
    selectedSource: null,
    isSidebarOpen: true,

    addMessage: (msg) => {
      const id = 'msg_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
      const newMessage: ChatMessage = {
        ...msg,
        id,
        timestamp: new Date(),
      };
      set((state) => ({ messages: [...state.messages, newMessage] }));
      return id;
    },

    updateMessage: (id, updates) => {
      set((state) => ({
        messages: state.messages.map((m) => (m.id === id ? { ...m, ...updates } : m)),
      }));
    },

    clearChat: () => set({ messages: [] }),

    setTopK: (topK) => set({ topK }),

    setSelectedSource: (source) => set({ selectedSource: source }),

    toggleTheme: () => {
      const current = get().theme;
      const next = current === 'dark' ? 'light' : 'dark';
      if (typeof document !== 'undefined') {
        if (next === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      localStorage.setItem('rag-theme', next);
      set({ theme: next });
    },

    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  };
});
