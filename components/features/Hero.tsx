"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import ar from "../../locales/ar/common.json";
import en from "../../locales/en/common.json";
import { BrandMark } from "@/components/ui/tabayun";

const dictionaries = { ar, en };

export default function Hero() {
  const params = useParams();
  const locale = (params.locale as string) || "ar";
  const dict = (dictionaries[locale as keyof typeof dictionaries] || ar).hero;
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const scrollToAbout = () => {
    document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-tabayun-coffee text-tabayun-paper"
      dir={dir}
    >
      <div className="absolute inset-0">
        <Image
          src="/image/tabayun-hero.png"
          alt={isAr ? "مشهد سعودي يجمع الأصالة والحداثة" : "Saudi scene blending heritage and modernity"}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(44,22,15,0.18)_0%,rgba(44,22,15,0.2)_42%,rgba(44,22,15,0.68)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(44,22,15,0.02),rgba(44,22,15,0.72)_82%)]" />
      </div>

      <div className="pointer-events-none absolute left-1/2 top-[43%] h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-tabayun-coffee/38 blur-[90px] tabayun-hero-glow" />

      <div className="tabayun-container relative z-10 flex min-h-[100svh] items-center pb-6 pt-20 md:pb-8 md:pt-32">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center text-center">
          <div className="tabayun-hero-copy mb-5 hidden md:block">
            <BrandMark locale={locale} inverted />
          </div>

          <div className="tabayun-hero-copy mb-3 inline-flex items-center gap-2 rounded-full border border-white/16 bg-tabayun-coffee/40 px-4 py-2 text-xs font-black text-tabayun-paper/88 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-md md:mb-4">
            <Sparkles className="h-4 w-4 text-tabayun-gold" />
            <span>{isAr ? "دليل قانوني ذكي للسائح في السعودية" : "Smart legal guide for visitors in Saudi Arabia"}</span>
          </div>

          <div className="relative w-full">
            <div className="pointer-events-none absolute -start-2 top-1/2 hidden -translate-y-1/2 rounded-[28px] border border-white/14 bg-tabayun-coffee/44 px-5 py-4 text-start shadow-[0_18px_44px_rgba(0,0,0,0.2)] backdrop-blur-md tabayun-hero-float lg:block">
              <p className="text-3xl font-black">+100</p>
              <p className="mt-1 text-xs font-bold text-tabayun-paper/60">
                {isAr ? "نظام وقانون" : "laws and regulations"}
              </p>
            </div>

            <div className="pointer-events-none absolute -end-2 top-[58%] hidden rounded-[28px] border border-white/14 bg-tabayun-coffee/44 px-5 py-4 text-start shadow-[0_18px_44px_rgba(0,0,0,0.2)] backdrop-blur-md tabayun-hero-float lg:block [animation-delay:1.2s]">
              <p className="text-3xl font-black">24/7</p>
              <p className="mt-1 text-xs font-bold text-tabayun-paper/60">
                {isAr ? "مساعد ذكي" : "AI assistant"}
              </p>
            </div>

            <h1 className="tabayun-hero-word select-none text-[clamp(3.7rem,15vw,17rem)] font-black leading-[0.82] tracking-normal text-tabayun-paper">
              {isAr ? "تبايــــــــن" : "TABAYUN"}
            </h1>
          </div>

          <h2 className="tabayun-hero-copy mt-5 text-balance text-2xl font-black leading-tight text-tabayun-paper sm:text-3xl md:mt-7 md:text-5xl">
            {isAr ? "اعرف حقوقك أينما كنت" : "Know your rights wherever you are"}
          </h2>

          <p className="tabayun-hero-copy mt-3 max-w-3xl text-sm font-semibold leading-relaxed text-tabayun-paper/78 sm:text-base md:mt-4 md:text-xl">
            {dict.description}
          </p>

          <div className="tabayun-hero-actions mt-5 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:justify-center md:mt-7">
            <Link
              href={`/${locale}/auth/login`}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-tabayun-paper px-7 text-base font-black text-tabayun-coffee shadow-[0_18px_48px_rgba(0,0,0,0.18)] transition hover:bg-white active:scale-[0.98]"
            >
              <span>{dict.cta}</span>
              {isAr ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Link>
            <button
              onClick={scrollToAbout}
              className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-white/24 bg-tabayun-coffee/35 px-7 text-base font-black text-tabayun-paper backdrop-blur-md transition hover:bg-tabayun-coffee/52 active:scale-[0.98]"
            >
              {isAr ? "كيف يعمل؟" : "How it works"}
            </button>
          </div>

          <div className="tabayun-hero-actions mt-7 flex flex-wrap items-center justify-center gap-2 text-xs font-black text-tabayun-paper/68 md:gap-3 md:text-sm">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-tabayun-coffee/38 px-4 py-2 backdrop-blur">
              <ShieldCheck className="h-4 w-4 text-tabayun-gold" />
              {isAr ? "خلاصة واضحة" : "Clear summaries"}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-tabayun-coffee/38 px-4 py-2 backdrop-blur">
              {isAr ? "ثنائي اللغة" : "Bilingual"}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={scrollToAbout}
        className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 rounded-full border border-white/16 bg-tabayun-coffee/42 p-3 text-white/72 backdrop-blur transition hover:text-white md:block"
        aria-label={isAr ? "الانتقال للقسم التالي" : "Go to next section"}
      >
        <ArrowDown className="h-5 w-5 animate-bounce" />
      </button>
    </section>
  );
}
