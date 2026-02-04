"use client";
import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ar from "@/locales/ar/common.json";
import en from "@/locales/en/common.json";

const dictionaries = { ar, en };

export default function DashboardPage() {
  const params = useParams();
  const locale = (params.locale as string) || "ar";
  const dict = dictionaries[locale as keyof typeof dictionaries] || ar;
  const dir = locale === "ar" ? "rtl" : "ltr";

  const trendingLaws = [
    { title: locale === "ar" ? "مخالفة السرعة" : "Speeding Ticket" },
    { title: locale === "ar" ? "شروط فتح السجل التجاري" : "Commercial Register Terms" },
    { title: locale === "ar" ? "مخالفة قطع الإشارة" : "Traffic Signal Violation" },
    { title: locale === "ar" ? "إلقاء النفايات" : "Littering Fine" },
  ];

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center overflow-x-hidden bg-[#f5f1eb]" dir={dir}>
      <Navbar />

      {/* Hero Section with Search */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-6">
        {/* خلفية الهوم بيج */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" /> 
          <Image 
            src="/image/saudi.png" 
            alt="Background" 
            fill 
            className="object-cover" 
            priority 
          />
        </div>

        <div className="relative z-20 w-full max-w-4xl flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-12 text-center leading-tight drop-shadow-2xl font-bold">
            {locale === "ar" ? "أي قانون حاب تقارنه ؟" : "Which law do you want to compare?"}
          </h1>

          {/* شريط البحث */}
          <div className="relative w-full max-w-2xl mb-24">
            <input 
              type="text" 
              placeholder={locale === "ar" ? "مخالفة السرعة" : "Speeding ticket..."}
              className="w-full bg-white/95 backdrop-blur-sm border-2 border-[#3d2e20] rounded-full py-4 px-12 text-xl text-[#3d2e20] focus:outline-none shadow-2xl font-regular"
            />
            <div className={`absolute top-1/2 -translate-y-1/2 ${dir === 'rtl' ? 'right-4' : 'left-4'}`}>
              <svg className="w-7 h-7 text-[#3d2e20]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* الأكثر بحثاً */}
          <div className="w-full">
            <h2 className={`text-2xl md:text-4xl font-bold text-white mb-8 drop-shadow-lg font-bold ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              {locale === "ar" ? "الأكثر بحثاً" : "Trending Searches"}
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trendingLaws.map((law, index) => (
                <button 
                  key={index}
                  className="bg-[#3d2e20]/90 backdrop-blur-md border border-white/10 text-white p-6 rounded-2xl text-lg md:text-xl font-bold hover:bg-[#4d3e30] transition shadow-2xl h-32 flex items-center justify-center text-center transform hover:scale-105 font-bold"
                >
                  {law.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* أيقونة الشات بوت في الزاوية */}
      <div className={`fixed bottom-8 ${dir === 'rtl' ? 'left-8' : 'right-8'} z-30`}>
        <button className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20 shadow-2xl hover:bg-white/20 transition">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      </div>
    </main>
  );
}