"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, ChevronLeft, Scale, ArrowDown } from "lucide-react";
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
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#1a1612]" dir={dir}>

      {/* Background Image - Full Visibility with Slight Darkening */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/image/saudi.png"
          alt="Saudi Background"
          fill
          className="object-cover"
          priority
        />
        {/* Simple uniform dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/40 z-10" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 container mx-auto px-4 flex flex-col items-center justify-center text-center h-full pt-10">

        {/* Badge */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
            <Scale className="w-4 h-4 text-white" />
            <span className="text-white font-medium text-xs tracking-wider uppercase">
              {locale === "ar" ? "المنصة القانونية الأولى" : "The #1 Legal Platform"}
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="max-w-5xl text-5xl sm:text-6xl md:text-8xl font-black text-white mb-6 leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 drop-shadow-lg">
          {dict.title}
        </h1>

        {/* Description */}
        <p className="max-w-2xl text-lg md:text-2xl text-white/90 mb-10 leading-relaxed font-regular animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 drop-shadow-md">
          {dict.description}
        </p>

        {/* CTA Buttons - Subtle Animations */}
        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Link href={`/${locale}/auth/login`}>
            <button className="bg-white text-[#3d2e20] px-8 md:px-10 py-3 md:py-4 rounded-full font-bold text-lg hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
              <span>{dict.cta}</span>
              {locale === "ar" ? (
                <ChevronLeft className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
          </Link>

          <button
            onClick={scrollToAbout}
            className="px-8 md:px-10 py-3 md:py-4 rounded-full font-bold text-lg text-white border border-white/30 hover:bg-white/10 transition-colors backdrop-blur-sm"
          >
            {locale === "ar" ? "تعرف علينا" : "Learn More"}
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 animate-pulse cursor-pointer opacity-70 hover:opacity-100 transition-opacity" onClick={scrollToAbout}>
          <ArrowDown className="w-6 h-6 text-white" strokeWidth={1.5} />
        </div>

      </div>
    </section>
  );
}