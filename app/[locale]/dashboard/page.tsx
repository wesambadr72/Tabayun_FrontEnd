"use client";
import React from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ar from "@/locales/ar/common.json";
import en from "@/locales/en/common.json";
import { Search, Sparkles, Scale, AlertCircle, Car, Trash2, Store } from "lucide-react";

const dictionaries = { ar, en };

export default function DashboardPage() {
  const params = useParams();
  const locale = (params.locale as string) || "ar";
  const dict = dictionaries[locale as keyof typeof dictionaries] || ar;
  const dir = locale === "ar" ? "rtl" : "ltr";

  const trendingLaws = [
    {
      title: locale === "ar" ? "مخالفة السرعة" : "Speeding Ticket",
      icon: Car,
    },
    {
      title: locale === "ar" ? "شروط فتح السجل التجاري" : "Commercial Register Terms",
      icon: Store,
    },
    {
      title: locale === "ar" ? "مخالفة قطع الإشارة" : "Traffic Signal Violation",
      icon: AlertCircle,
    },
    {
      title: locale === "ar" ? "إلقاء النفايات" : "Littering Fine",
      icon: Trash2,
    },
  ];

  return (
    <main className="relative min-h-screen w-full flex flex-col overflow-x-hidden bg-[#f5f1eb]" dir={dir}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full flex-1 flex flex-col items-center justify-center px-4 md:px-6 pt-40 pb-20 min-h-[80vh]">

        <div className="relative z-20 w-full max-w-4xl flex flex-col items-center">

          {/* Main Title */}
          <div className="text-center mb-10 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3d2e20]/5 border border-[#3d2e20]/10 text-[#3d2e20] text-sm font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-[#3d2e20]" />
              <span className="font-regular">{locale === "ar" ? "محرك البحث القانوني الأول" : "The #1 Legal Search Engine"}</span>
            </div>

            <h1 className="text-4xl md:text-6xl text-[#3d2e20] tracking-tight leading-tight font-bold">
              {locale === "ar" ? "أي قانون حاب تقارنه ؟" : "Which law do you want to compare?"}
            </h1>

            <p className="text-[#3d2e20]/70 text-lg md:text-xl max-w-2xl mx-auto font-regular leading-relaxed">
              {locale === "ar"
                ? "اكتشف وقارن بين القوانين والأنظمة السعودية بكل سهولة ووضوح"
                : "Discover and compare Saudi laws and regulations with ease and clarity"}
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full max-w-2xl mb-16 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-150 fill-mode-backwards">
            <div className="relative flex items-center bg-white border-2 border-[#3d2e20]/10 rounded-2xl shadow-xl shadow-[#3d2e20]/5 hover:shadow-2xl hover:shadow-[#3d2e20]/10 transition-shadow duration-300 p-2 focus-within:border-[#3d2e20]/30">
              <input
                type="text"
                placeholder={locale === "ar" ? "ابحث عن مخالفة، قانون، أو نظام..." : "Search for a violation, law, or regulation..."}
                className="w-full bg-transparent border-none py-4 px-6 text-lg text-[#3d2e20] placeholder-[#3d2e20]/40 focus:outline-none font-bold"
              />
              <button className={`bg-[#3d2e20] hover:bg-[#4d3e30] text-white p-4 rounded-xl transition-colors duration-200 flex-shrink-0 shadow-lg`}>
                <Search className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Trending Section */}
          <div className="w-full animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300 fill-mode-backwards">
            <h2 className="text-xl font-bold text-[#3d2e20] mb-6 text-center opacity-80 font-bold">
              {locale === "ar" ? "الأكثر بحثاً" : "Trending Searches"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {trendingLaws.map((law, index) => (
                <button
                  key={index}
                  className="group flex flex-col items-center justify-center p-6 bg-white border border-[#3d2e20]/10 rounded-2xl hover:border-[#3d2e20]/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`p-4 rounded-xl bg-[#f5f1eb] text-[#3d2e20] mb-4 group-hover:bg-[#3d2e20] group-hover:text-white transition-colors duration-300`}>
                    <law.icon className="w-7 h-7" strokeWidth={1.5} />
                  </div>
                  <span className="text-[#3d2e20] font-bold text-center text-sm md:text-base group-hover:text-[#3d2e20] transition-colors">
                    {law.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Chatbot Icon */}
      <div className={`fixed bottom-8 ${dir === 'rtl' ? 'left-8' : 'right-8'} z-30 animate-in fade-in zoom-in duration-500 delay-500`}>
        <button className="bg-[#3d2e20] hover:bg-[#523e2b] text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center group relative border border-white/10">
          <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className={`absolute bottom-full mb-3 ${dir === 'rtl' ? 'left-0' : 'right-0'} w-max px-3 py-1.5 rounded-lg bg-[#3d2e20] text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg`}>
            {locale === "ar" ? "المساعد" : "Assistant"}
          </span>
        </button>
      </div>
    </main>
  );
}