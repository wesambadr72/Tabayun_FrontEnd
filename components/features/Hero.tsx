"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import ar from "../../locales/ar/common.json";
import en from "../../locales/en/common.json";

const dictionaries = { ar, en };

export default function Hero() {
  const params = useParams();
  const locale = (params.locale as string) || "ar";
  const dict = (dictionaries[locale as keyof typeof dictionaries] || ar).hero;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <section className="relative h-screen w-full flex items-center justify-center text-white overflow-hidden" dir={dir}>
      {/* طبقة الصورة الخلفية */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/50 z-10" /> {/* طبقة تغميق الصورة لتوضيح النص */}
        
        <Image 
          src="/image/saudi.png" 
          alt="Saudi Law Background"
          fill 
          className="object-cover" 
          priority 
        />
      </div>

      <div className="relative z-20 text-center px-4 max-w-5xl mt-20">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-8 leading-tight font-bold">
          {dict.title}
        </h1>
        <p className="text-lg md:text-2xl mb-10 leading-relaxed max-w-3xl mx-auto opacity-90 font-regular">
          {dict.description}
        </p>
        
        {/* رابط التوجيه لصفحة تسجيل الدخول */}
        <Link href={`/${locale}/auth/login`}>
          <button className="bg-white text-black px-8 md:px-12 py-3 md:py-4 rounded-full font-bold text-lg md:text-xl hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg">
            {dict.cta}
          </button>
        </Link>
      </div>
    </section>
  );
}