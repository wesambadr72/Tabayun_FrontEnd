"use client";
import React from "react";
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
    <main className="relative min-h-screen w-full flex flex-col items-center bg-[#f5f1eb] pt-32" dir={dir}>
      <Navbar />
      
      <h2 className="text-5xl md:text-7xl font-bold text-[#3d2e20] mb-16 font-bold">
        {dict.dashboard.categories}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-6 pb-20">
        {categories.map((cat, index) => (
          <div 
            key={index} 
            className="relative h-48 md:h-64 rounded-3xl overflow-hidden group cursor-pointer shadow-2xl transition-all hover:-translate-y-2 bg-[#3d2e20]"
          >
            <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/40 to-transparent opacity-90" />
            <div className={`absolute inset-0 flex items-center ${dir === 'rtl' ? 'justify-end pr-10' : 'justify-start pl-10'}`}>
              <span className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl font-bold tracking-wide">
                {cat.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}