"use client";
import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ar from "@/locales/ar/common.json";
import en from "@/locales/en/common.json";
import { CATEGORIES_CONFIG } from "@/lib/categories-config";

const dictionaries = { ar, en };

export default function CategoriesPage() {
  const params = useParams();
  const locale = (params.locale as string) || "ar";
  const dict = dictionaries[locale as keyof typeof dictionaries] || ar;
  const dir = locale === "ar" ? "rtl" : "ltr";

  const categories = CATEGORIES_CONFIG.map(cat => (
      {
      name: (dict.dashboard.sections as any)[cat.key], 
      img: cat.img
      }
    )
  );

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl px-12 md:px-6 pb-20">
          {categories.map((cat, index) => (
            <div 
              key={index} 
             className="relative h-28 md:h-44 rounded-2xl overflow-hidden group cursor-pointer shadow-xl transition-all hover:-translate-y-1 bg-[#1a120b] border border-white/10 flex items-stretch"
            >
              {/* 1. حاوية النص - 30% من العرض */}
              <div className="w-[40%] md:w-[30%] flex items-center justify-center p-2 z-20 bg-[#1a120b]/80 backdrop-blur-md">
                <span className="text-xl md:text-3xl font-black text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] text-center leading-none font-bold tracking-tighter">
                  {cat.name}
                </span>
              </div>

              {/* 2. حاوية الصورة - 70% من العرض */}
             <div className="relative w-[60%] md:w-[70%] h-full">
                <Image 
                  src={cat.img} 
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* التدرج اللوني - يخرج من جهة النص */}
                <div className={`absolute inset-0 ${dir === 'rtl' ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-[#1a120b] via-transparent to-transparent z-10`} />
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