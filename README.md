![Tabayun Banner](./public/Frame_22.png)

# Tabayun — Multilingual Legal Awareness Platform

> Bridging the gap between legal complexity and traveler awareness in Saudi Arabia.

![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?style=flat-square)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square)
![i18n](https://img.shields.io/badge/i18n-EN%20AR%20FR%20ES-green?style=flat-square)

---

## Overview

**Tabayun** is an advanced multilingual digital platform designed to help international tourists navigate and understand local laws and regulations in Saudi Arabia. Powered by AI, the platform delivers accurate, accessible legal guidance tailored specifically to foreign visitors — reducing legal uncertainty and promoting a safe, respectful experience in the Kingdom.

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15+ (React 19) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Internationalization | EN, AR, FR, ES |
| Deployment | Vercel |
| Backend | FastAPI |

---

## Features

### User-Facing
- **Secure authentication** — protected account registration and login
- **Law browser** — categorized browsing of Saudi regulations
- **Legal comparison** — side-by-side view to understand legal distinctions
- **AI chatbot** — 24/7 intelligent assistant for legal queries
- **Bookmarks** — save and revisit important regulations

### Admin Panel
- **Analytics dashboard** — detailed platform usage statistics
- **Content management** — create, edit, and remove legal entries
- **User management** — role and permission control
- **Activity log** — full audit trail of administrative actions
- **Knowledge base updates** — refresh the AI assistant's data directly

---

## Project Structure

```text
tabayun-frontend/
├── app/                # App Router (Next.js 15)
│   └── [locale]/       # Dynamic i18n routes
├── components/         # shadcn/ui & custom components
├── hooks/              # Custom React hooks
├── services/           # FastAPI integrations
├── types/              # TypeScript definitions
├── lib/                # Shared utilities
├── locales/            # JSON translation files
└── public/             # Static assets
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## Mission

Tabayun exists to reduce legal friction for international visitors in Saudi Arabia — promoting compliance, cultural respect, and a smoother overall experience through accessible, AI-assisted legal awareness.
