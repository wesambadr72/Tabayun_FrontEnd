"use client";
import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ar from "@/locales/ar/common.json";
import en from "@/locales/en/common.json";

const dictionaries = { ar, en };

export default function CategoriesPage() {
  const params = useParams();
  const locale = (params.locale as string) || "ar";
  const dict = dictionaries[locale as keyof typeof dictionaries] || ar;
  const dir = locale === "ar" ? "rtl" : "ltr";

  const categories = [
    { name: dict.dashboard.sections.traffic },
    { name: dict.dashboard.sections.food },
    { name: dict.dashboard.sections.commerce },
    { name: dict.dashboard.sections.environment },
    { name: dict.dashboard.sections.publicDecency },
    { name: dict.dashboard.sections.health },
  ];

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center overflow-x-hidden" dir={dir}>
      <Navbar />
      
      {/* خلفية الهوم بيج الثابتة */}
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

      <div className="relative z-20 w-full flex flex-col items-center pt-32 md:pt-40">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-12 font-bold drop-shadow-2xl">
          {dict.dashboard.categories}
        </h2>

        {/* شبكة الأقسام بحجم أصغر */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6 w-full max-w-5xl px-6 pb-20">
          {categories.map((cat, index) => (
            <div 
              key={index} 
              className="relative h-32 md:h-44 rounded-2xl overflow-hidden group cursor-pointer shadow-xl transition-all hover:-translate-y-1 bg-[#3d2e20]/80 backdrop-blur-md border border-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <span className="text-xl md:text-3xl font-bold text-white drop-shadow-2xl text-center leading-tight font-bold">
                  {cat.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* أيقونة الشات بوت */}
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