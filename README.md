# Frontend RAG PDF ChromaDB (React 19 + TypeScript + Tailwind CSS)

Modern, high-performance web application designed for interactive chat with a RAG (Retrieval-Augmented Generation) backend powered by Spring AI, ChromaDB, and Ollama.

---

## 🚀 Key Features

- **Rich Markdown Rendering**: Responses are synthesized and rendered with hierarchical headings, clean tables, bulleted lists, blockquotes, and code blocks with quick "Copy" buttons.
- **Precise Provenance & ChromaDB Metadata**:
  - 📄 **Source file name**.
  - 📑 **PDF Page number** (1-based).
  - 📏 **Line numbers range** (`start_line` and `end_line`) dynamically calculated during ingestion.
  - 🔍 **Interactive Inspector Modal**: Line-numbered text snippet view and full ChromaDB JSON metadata viewer.
- **PDF Document Management**:
  - Drag & Drop zone for PDF document uploads.
  - Active ingestion and vector embedding status indicators.
  - Document history with persistence in H2/JPA, showing chunk counts, file sizes, and status (`INDEXED`).
- **Inference & Context Controls**:
  - `topK` context selector (2, 4, 6, or 8 most similar chunks).
  - Quick starter prompts to easily discover document insights.
- **Design & User Experience (UX)**:
  - Dark / Light mode toggle with persistent state.
  - Responsive collapsible sidebar.
  - Typography styled with *Plus Jakarta Sans* and *JetBrains Mono*.

---

## 🛠️ Tech Stack

| Layer | Library / Tool | Version |
| :--- | :--- | :--- |
| **Framework** | React + React DOM | 19.0.0 |
| **Build Tool** | Vite | 6.2.0 |
| **Language** | TypeScript | ~5.7.2 |
| **Styling** | Tailwind CSS with `@tailwindcss/vite` | 4.0.8 |
| **Global UI State** | Zustand | 5.0.3 |
| **Server State & Caching** | TanStack Query (React Query) | 5.66.0 |
| **Forms & Validation** | React Hook Form + Zod | 7.54.2 / 3.24.2 |
| **Markdown** | React-Markdown + Remark-GFM | 9.0.3 / 4.0.0 |
| **Icons** | Lucide React | 0.475.0 |

---

## 🔌 Backend Integration

The frontend connects to the Spring Boot backend (`springia-rag`) running on port `8085`:

- `GET /api/rag/documents`: Fetches indexed document history.
- `POST /api/rag/documents/upload`: Multipart upload and vectorization into ChromaDB.
- `POST /api/rag/chat`: Submits user questions and retrieves synthesized markdown answers with structured provenance `sources` (file name, page, start line, end line, snippet, and metadata).

---

## 🏁 How to Run

### 1. Start the Spring Boot Backend (in `rag-pdf-chromadb`)
Make sure ChromaDB (port 8000) and Ollama (port 11434 with models `qwen3:1.7b` and `nomic-embed-text`) are running:
```bash
cd ../rag-pdf-chromadb
./mvnw spring-boot:run
```

### 2. Start the Frontend (in `react-rag-pdf-chromadb`)
```bash
npm install
npm run dev
```

Open [http://localhost:5175](http://localhost:5175) in your browser. The integrated Vite reverse proxy forwards all `/api` requests directly to the Spring Boot backend on port `8085`.

### 3. Build for Production
```bash
npm run build
```
Generates minified, optimized production assets in `dist/`.
