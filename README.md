<div align="center">

# NeuralFlow AI

### Intelligent Automation Platform for Developers

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Alaashamel/AI_SASS_DASH)

</div>

---

## Overview

NeuralFlow AI is a production-grade AI developer workspace — a full-featured SaaS dashboard built with **Next.js 15**, **React 19**, and **TypeScript**. It provides a unified interface for AI-powered chat, document analysis, prompt management, and team collaboration, designed to look and feel like software by **OpenAI**, **Vercel**, **Linear**, and **Stripe**.

## Features

### Core
- **AI Chat** — Multi-model chat interface with streaming responses, conversation history, and Markdown + syntax highlighting
- **Prompt Library** — Create, organize, and reuse prompts with categories, favorites, and usage tracking
- **Projects** — Workspace-based project management with real-time collaboration states
- **Documents** — Drag-and-drop file upload with AI-powered analysis, tagging, and search

### Developer Tools
- **Command Palette** — `Cmd+K` navigation with instant search across all features
- **Developer Console** — API playground with live request/response testing and SDK code examples
- **API Keys** — Secure key management with permissions, expiry, and usage tracking

### Platform
- **Offline-First** — IndexedDB persistence with mutation queue and automatic sync on reconnect
- **Analytics Dashboard** — Interactive Recharts visualizations for usage, revenue, and token consumption
- **Help Center** — Searchable FAQ with accordion UI and multi-channel support links

### Design
- **Premium UI** — Custom design system with violet/blue accent gradients, glass morphism, and animated transitions
- **Dark Mode** — System-aware theme switching with `prefers-color-scheme` support
- **Responsive** — Mobile-first layout with collapsible sidebar and adaptive navigation
- **Accessible** — Skip-to-content links, ARIA labels, keyboard navigation, and focus management

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS, shadcn/ui |
| State | Zustand, TanStack Query |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Auth | Clerk (ready for integration) |
| AI | Google Gemini API (ready for integration) |
| Storage | IndexedDB via `idb`, Cloudinary (ready) |
| Payments | Stripe (ready for integration) |

## Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **npm** 9+ (use `--legacy-peer-deps` for React 19 RC compatibility)

### Installation

```bash
git clone https://github.com/Alaashamel/AI_SASS_DASH.git
cd AI_SASS_DASH
npm install --legacy-peer-deps
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Login, register, forgot-password
│   └── (dashboard)/         # All authenticated pages
│       ├── chat/            # AI chat interface
│       ├── dashboard/       # Analytics overview
│       ├── documents/       # File management
│       ├── projects/        # Project workspaces
│       ├── prompts/         # Prompt library
│       ├── billing/         # Plans & usage
│       ├── api-keys/        # API key management
│       ├── developer/       # API playground
│       ├── analytics/       # Detailed analytics
│       ├── settings/        # User settings
│       └── help-center/     # Support & FAQ
├── components/
│   ├── chat/                # 7 composable chat components
│   ├── billing/             # Usage charts
│   ├── command/             # Cmd+K palette
│   ├── documents/           # Upload & detail dialogs
│   ├── layout/              # Sidebar, navbar, layout
│   ├── projects/            # Project CRUD
│   ├── prompts/             # Prompt editor & cards
│   └── ui/                  # shadcn/ui primitives
├── hooks/                   # Custom React hooks
├── lib/                     # DB layer, utilities
├── services/                # API service layer
├── stores/                  # Zustand state stores
└── types/                   # TypeScript interfaces
```

## Architecture

```
UI Components → Feature Components → Custom Hooks → Repository Layer → Service Layer → API Client → External APIs
```

Each layer has a single responsibility:
- **Components** are purely presentational
- **Hooks** manage local UI state
- **Services** handle data fetching and business logic
- **Stores** manage global client state (Zustand)
- **DB layer** provides offline persistence (IndexedDB)

## Performance

| Metric | Value |
|--------|-------|
| Chat bundle | 64 KB (lazy-loaded syntax highlighter) |
| Total routes | 21 |
| TypeScript errors | 0 |
| ESLint warnings | 0 |
| First Load JS (shared) | 99.5 KB |

## Commit History

This project was built milestone-by-milestone, with each milestone as a separate commit:

| # | Milestone | What was built |
|---|-----------|---------------|
| 1 | Foundation | Design system, routing, auth pages, sidebar |
| 2 | Command Palette | Cmd+K navigation, keyboard shortcuts |
| 3 | Prompt Library | Full CRUD, IndexedDB, search & filter |
| 4 | Projects | Workspace CRUD, project cards |
| 5 | Offline Layer | IndexedDB cache, mutation queue, online detection |
| 6 | Chat Overhaul | 7 components, lazy loading (286→64 KB), streaming |
| 7 | Developer Pages | Help Center, API Keys, Developer Console |
| 8 | Polish | Error boundary, loading skeletons, accessibility |
| 9 | Billing & Notifications | Usage charts, invoice history, typed notifications |
| 10 | Documents | Drag-and-drop upload, detail preview, file management |

## Roadmap

- [ ] Clerk authentication integration
- [ ] Google Gemini API for real chat responses
- [ ] Cloudinary file upload pipeline
- [ ] Stripe billing integration
- [ ] Real-time collaboration with WebSockets
- [ ] E2E testing with Playwright
- [ ] CI/CD with GitHub Actions

## License

MIT © [Alaashamel](https://github.com/Alaashamel)
