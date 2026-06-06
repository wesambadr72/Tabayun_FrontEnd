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

### الواجهة الأمامية (Frontend)
- **الإطار البرمجي:** Next.js 15 (App Router)
- **اللغة:** TypeScript
- **التصميم:** Tailwind CSS + Shadcn/ui
- **إدارة الحالة:** React Hooks (useState, useEffect)
- **تدويل اللغة (i18n):** English, Arabic (دعم كامل للاتجاهات RTL/LTR)
- **التواصل مع الباك اند:** Axios (FastAPI Integration)

---

## Features

### ميزات المستخدمين
- [x] **تسجيل دخول ذكي:** نظام دخول وتسجيل متعدد الخطوات يربط المستخدم ببلده آلياً.
- [x] **محرك بحث معنوي:** بحث متطور يفهم نية المستخدم في القوانين والمقارنات.
- [x] **مقارنة قانونية ثنائية:** عرض Side-by-Side للقوانين السعودية والعالمية مع ملخصات ذكية.
- [x] **مساعد ذكي (RAG Chat):** شات بوت قانوني مدعوم بالذكاء الاصطناعي للإجابة على الاستفسارات.
- [x] **تصفية المحتوى:** عرض القوانين المشتركة بناءً على بلد المستخدم لضمان صلة المعلومات.
- [x] **المصادر الأصلية:** توفير روابط مباشرة للمصادر القانونية الرسمية لضمان الموثوقية.
- [x] **العلامات المرجعية:** حفظ المقارنات المهمة في الملف الشخصي.

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
├── app/                 # App Router (Next.js 15)
│   └── [locale]/        # Dynamic i18n routes
├── components/          # shadcn/ui & custom components
├── hooks/               # Custom React hooks
├── services/            # FastAPI integrations
├── types/               # TypeScript definitions
├── lib/                 # Shared utilities
├── locales/             # JSON translation files
└── public/              # Static assets
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

## 🎯 هدف المشروع
الهدف الأساسي هو مساعدة السياح في فهم القوانين واللوائح السعودية عبر مقارنتها بقوانين بلدانهم الأصلية، مما يعزز الوعي القانوني والامتثال بطريقة ذكية ومبسطة.

---

## 🏁 حالة المشروع الحالية
- **الربط:** متصل بالكامل مع الباك اند (FastAPI).
- **اللغات:** دعم كامل للعربية والإنجليزية.
