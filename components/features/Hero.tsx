"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, ChevronLeft, Scale, ArrowDown, Sparkles } from "lucide-react";
import ar from "../../locales/ar/common.json";
import en from "../../locales/en/common.json";

const dictionaries = { ar, en };

export default function Hero() {
  const params = useParams();
  const locale = (params.locale as string) || "ar";
  const dict = (dictionaries[locale as keyof typeof dictionaries] || ar).hero;
  const dir = locale === "ar" ? "rtl" : "ltr";

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] md:h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#1a1612]" dir={dir}>

      {/* Background with simple overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/image/saudi.png"
          alt="Saudi Background"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1612]/80 via-transparent to-[#1a1612] z-10" />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 flex flex-col items-center justify-center text-center py-20">

        {/* Simple Badge */}
        <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-white font-bold text-xs tracking-widest uppercase">
              {locale === "ar" ? "المنصة القانونية الأولى" : "The #1 Legal Platform"}
            </span>
          </div>
        </div>

        {/* Clean Headline */}
        <h1 className="max-w-4xl text-4xl sm:text-6xl md:text-8xl font-black text-white mb-6 leading-[1.1] tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          {dict.title}
        </h1>

        {/* Refined Description */}
        <p className="max-w-xl text-lg md:text-xl text-white/70 mb-10 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          {dict.description}
        </p>

        {/* Minimalist CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Link href={`/${locale}/auth/login`}>
            <button className="bg-white text-[#3d2e20] px-10 py-4 rounded-full font-bold text-lg hover:bg-[#f5f1eb] transition-all hover:scale-105 shadow-xl flex items-center justify-center gap-2 active:scale-95">
              <span>{dict.cta}</span>
              {locale === "ar" ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          </Link>

          <button
            onClick={scrollToAbout}
            className="px-10 py-4 rounded-full font-bold text-lg text-white border border-white/30 hover:bg-white/10 transition-all active:scale-95"
          >
            {locale === "ar" ? "تعرف علينا" : "Learn More"}
          </button>
        </div>

        {/* Simple Scroll Indicator */}
        <div className="absolute bottom-8 animate-bounce cursor-pointer opacity-50 hover:opacity-100 transition-opacity hidden md:block" onClick={scrollToAbout}>
          <ArrowDown className="w-6 h-6 text-white" strokeWidth={2} />
        </div>

      </div>
    </section>
  );
}