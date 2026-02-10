"use client";
import React from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ar from "@/locales/ar/common.json";
import en from "@/locales/en/common.json";
import { CATEGORIES_CONFIG } from "@/lib/categories-config";
import { Car, Utensils, Store, Leaf, ShieldCheck, Stethoscope } from "lucide-react";

const dictionaries = { ar, en };

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  traffic: Car,
  food: Utensils,
  commerce: Store,
  environment: Leaf,
  publicDecency: ShieldCheck,
  health: Stethoscope,
};

export default function CategoriesPage() {
  const params = useParams();
  const locale = (params.locale as string) || "ar";
  const dict = dictionaries[locale as keyof typeof dictionaries] || ar;
  const dir = locale === "ar" ? "rtl" : "ltr";

  const categories = CATEGORIES_CONFIG.map(cat => ({
    name: (dict.dashboard.sections as any)[cat.key],
    description: (dict.dashboard as any).descriptions?.[cat.key],
    icon: CATEGORY_ICONS[cat.key] || Store, // Default icon
    key: cat.key
  }));

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center overflow-x-hidden bg-[#f5f1eb]" dir={dir}>
      <Navbar />

      <div className="relative z-20 w-full flex flex-col items-center pt-40 md:pt-48 pb-20 px-4">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-4xl md:text-6xl text-[#3d2e20] font-bold tracking-tight">
            {dict.dashboard.categories || (locale === "ar" ? "تصفح الأقسام" : "Browse Categories")}
          </h1>
          <p className="text-[#3d2e20]/70 text-lg md:text-xl max-w-2xl mx-auto font-regular leading-relaxed">
            {locale === "ar"
              ? "استعرض جميع الأنظمة واللوائح المصنفة حسب المجال"
              : "Browse all regulations and laws categorized by field"}
          </p>
        </div>

        {/* Categories Grid - Adjusted Spacing and Size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl px-8 md:px-12 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-150 fill-mode-backwards">
          {categories.map((cat, index) => (
            <button
              key={index}
              className="group relative flex flex-col items-center justify-center p-6 bg-white border border-[#3d2e20]/10 rounded-2xl hover:border-[#3d2e20]/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden h-64"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#f5f1eb] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-5 rounded-2xl bg-[#f5f1eb] text-[#3d2e20] mb-5 group-hover:bg-[#3d2e20] group-hover:text-white transition-all duration-300 group-hover:scale-110 shadow-sm">
                <cat.icon className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
              </div>

              <span className="relative text-xl font-bold text-[#3d2e20] text-center group-hover:text-[#3d2e20] transition-colors mb-2">
                {cat.name}
              </span>

              {/* Description */}
              <span className="relative text-sm text-[#3d2e20]/60 text-center font-regular leading-relaxed px-2 line-clamp-2 group-hover:text-[#3d2e20]/80 transition-colors">
                {cat.description}
              </span>

              {/* Optional: Add a subtle arrow or indicator on hover */}
              <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <span className="text-[#3d2e20]/50 text-xs font-bold">
                  {locale === "ar" ? "عرض التفاصيل" : "View Details"}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

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