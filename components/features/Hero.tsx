"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowDown,
  Bot,
  ChevronLeft,
  ChevronRight,
  Globe2,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import ar from "../../locales/ar/common.json";
import en from "../../locales/en/common.json";
import { CountUp } from "@/components/ui/motion";

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

  const indicators = [
    {
      icon: ShieldCheck,
      label: isAr ? "خلاصة موثوقة" : "Trusted summaries",
    },
    {
      icon: Globe2,
      label: isAr ? "مقارنة حسب بلدك" : "Country comparison",
    },
    {
      icon: Bot,
      label: isAr ? "مساعد ذكي" : "AI assistant",
    },
  ];

  return (
    <section
      className="relative isolate min-h-[100svh] overflow-hidden bg-[#2C160F] text-[#F7F2EC]"
      dir={dir}
      data-nav-tone="dark"
    >
      <div className="absolute inset-0 -z-30">
        <Image
          src="/image/tabayun-hero.png"
          alt={isAr ? "مشهد سعودي يجمع الأصالة والحداثة" : "Saudi scene blending heritage and modernity"}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(44,22,15,0.92)_0%,rgba(44,22,15,0.66)_34%,rgba(44,22,15,0.42)_58%,rgba(44,22,15,0.84)_100%)]" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_36%,rgba(246,241,231,0.24),transparent_22rem),linear-gradient(180deg,rgba(44,22,15,0.42)_0%,rgba(44,22,15,0.18)_42%,rgba(44,22,15,0.94)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-36 bg-[linear-gradient(180deg,rgba(44,22,15,0.9),transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-56 bg-[linear-gradient(180deg,transparent,rgba(44,22,15,0.96))]" />

      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <div className="tabayun-hero-float absolute left-[8%] top-[48%] rounded-[26px] border border-[#F7F2EC]/20 bg-[#2C160F]/54 px-6 py-5 text-[#F7F2EC] shadow-[0_22px_70px_rgba(0,0,0,0.26)] backdrop-blur-xl">
          <p className="tabayun-display text-4xl font-black leading-none">
            <CountUp end={24} suffix="/7" />
          </p>
          <p className="mt-2 text-sm font-black text-[#F7F2EC]/72">{isAr ? "مساعد ذكي" : "AI assistant"}</p>
        </div>

        <div
          className="tabayun-hero-float absolute right-[8%] top-[48%] rounded-[26px] border border-[#F7F2EC]/20 bg-[#2C160F]/54 px-6 py-5 text-[#F7F2EC] shadow-[0_22px_70px_rgba(0,0,0,0.26)] backdrop-blur-xl"
          style={{ animationDelay: "900ms" }}
        >
          <p className="tabayun-display text-4xl font-black leading-none">
            <CountUp end={100} prefix="+" />
          </p>
          <p className="mt-2 text-sm font-black text-[#F7F2EC]/72">{isAr ? "نظام وقانون" : "laws and rules"}</p>
        </div>
      </div>

      <div className="tabayun-container relative z-10 flex min-h-[100svh] items-center justify-center pb-16 pt-32 sm:pb-20 sm:pt-36 lg:pt-32">
        <div className="mx-auto w-full max-w-6xl text-center">
          <div className="tabayun-hero-copy inline-flex items-center gap-2 rounded-full border border-[#F7F2EC]/24 bg-[#2C160F]/50 px-4 py-2 text-xs font-black text-[#F7F2EC]/86 shadow-[0_16px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:text-sm">
            <Sparkles className="h-4 w-4 text-[#C49A6C]" />
            {isAr ? "دليل قانوني ذكي للسائح في السعودية" : "Smart legal guide for visitors in Saudi Arabia"}
          </div>

          <div className="relative mx-auto mt-5 w-fit">
            <div className="tabayun-hero-glow absolute left-1/2 top-1/2 -z-10 h-[58%] w-[110%] rounded-full bg-[#C49A6C]/18 blur-3xl" />
            <p className="tabayun-hero-word text-[clamp(4.75rem,12vw,13.5rem)] font-black leading-[0.78] text-[#F7F2EC]">
              {isAr ? "تبايــــن" : "TABAYUN"}
            </p>
          </div>

          <h1 className="tabayun-hero-copy mx-auto mt-8 max-w-4xl text-balance text-[clamp(2rem,3.8vw,4.3rem)] font-black leading-[1.16] text-[#F7F2EC] sm:mt-9">
            {isAr ? (
              <>
                <span className="block">افهــم أنظمــة السعوديــة</span>
                <span className="mt-1 block">قبل أن تتحــرك</span>
              </>
            ) : (
              "Understand Saudi rules before you act"
            )}
          </h1>

          <p className="tabayun-hero-copy mx-auto mt-5 max-w-3xl text-balance text-base font-black leading-relaxed text-[#F7F2EC]/80 sm:text-lg md:text-xl">
            {dict.description}
          </p>

          <div className="tabayun-hero-actions mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
            <Link
              href={`/${locale}/auth/login`}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#F7F2EC] px-7 text-base font-black text-[#2C160F] shadow-[0_22px_58px_rgba(0,0,0,0.28)] transition hover:-translate-y-0.5 hover:bg-white active:scale-[0.98]"
            >
              <span>{dict.cta}</span>
              {isAr ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Link>
            <button
              onClick={scrollToAbout}
              className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-[#F7F2EC]/28 bg-[#F7F2EC]/10 px-7 text-base font-black text-[#F7F2EC] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-[#F7F2EC]/16 active:scale-[0.98]"
            >
              {isAr ? "كيف يعمل؟" : "How it works"}
            </button>
          </div>

          <div className="tabayun-hero-actions mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-3">
            {indicators.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#F7F2EC]/18 bg-[#2C160F]/42 px-4 text-sm font-black text-[#F7F2EC]/82 shadow-[0_14px_38px_rgba(0,0,0,0.18)] backdrop-blur-xl"
                >
                  <Icon className="h-4 w-4 text-[#C49A6C]" />
                  {item.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <button
        onClick={scrollToAbout}
        className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 rounded-full border border-[#F7F2EC]/22 bg-[#2C160F]/34 p-3 text-[#F7F2EC]/76 backdrop-blur transition hover:text-[#F7F2EC] md:block"
        aria-label={isAr ? "الانتقال للقسم التالي" : "Go to next section"}
      >
        <ArrowDown className="h-5 w-5 animate-bounce" />
      </button>
    </section>
  );
}
