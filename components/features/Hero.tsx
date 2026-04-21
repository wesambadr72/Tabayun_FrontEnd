"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, ChevronLeft, ArrowDown, Sparkles, Scale, GitCompare } from "lucide-react";
import ar from "../../locales/ar/common.json";
import en from "../../locales/en/common.json";

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
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#1a1612]"
      dir={dir}
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/image/saudi.png"
          alt="Saudi Background"
          fill
          className="object-cover object-center opacity-50"
          priority
        />
        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1612] via-[#1a1612]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1612]/90 via-transparent to-[#1a1612]/40" style={{ direction: isAr ? "rtl" : "ltr" }} />
      </div>

      {/* Content */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-5 sm:px-8 pt-28 pb-20 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

        {/* — Text block — */}
        <div className={`flex-1 flex flex-col ${isAr ? "items-end text-right" : "items-start text-left"} max-w-xl w-full`}>

          {/* Badge */}
          <div className="mb-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="text-white font-bold text-xs tracking-wide">
                {isAr ? "المنصة القانونية الأولى في السعودية" : "Saudi Arabia's #1 Legal Platform"}
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.1] mb-5 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            {isAr ? (
              <>
                استكشف{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-amber-300">القوانين</span>
                  <span
                    className="absolute -inset-1 -z-0 rounded-lg opacity-20 blur-sm"
                    style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
                  />
                </span>
                <br />
                وافهم الفروقات
              </>
            ) : (
              <>
                Explore{" "}
                <span className="text-amber-300">Legal</span>
                <br />
                Differences
              </>
            )}
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base lg:text-lg text-white/65 leading-relaxed mb-8 max-w-md animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            {dict.description}
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col xs:flex-row gap-3 w-full xs:w-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300`}
          >
            <Link href={`/${locale}/auth/login`} className="w-full xs:w-auto">
              <button className="w-full xs:w-auto group bg-white text-[#3d2e20] px-7 py-3.5 rounded-2xl font-bold text-base hover:bg-amber-50 transition-all hover:scale-[1.03] shadow-xl shadow-black/20 flex items-center justify-center gap-2 active:scale-95">
                <span>{dict.cta}</span>
                {isAr
                  ? <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform flex-shrink-0" />
                  : <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                }
              </button>
            </Link>

            <button
              onClick={scrollToAbout}
              className="w-full xs:w-auto px-7 py-3.5 rounded-2xl font-bold text-base text-white border border-white/25 hover:bg-white/10 hover:border-white/40 transition-all active:scale-95"
            >
              {isAr ? "تعرف علينا" : "Learn More"}
            </button>
          </div>

          {/* Trust row */}
          <div className={`flex items-center gap-4 mt-8 animate-in fade-in duration-700 delay-500`}>
            <div className="flex -space-x-2 rtl:space-x-reverse">
              {["🇸🇦", "🇩🇪", "🇬🇧", "🇫🇷"].map((flag, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-sm backdrop-blur-sm"
                >
                  {flag}
                </div>
              ))}
            </div>
            <p className="text-white/50 text-xs font-medium">
              {isAr ? "+١٠٠ نظام وقانون مقارن" : "100+ laws compared"}
            </p>
          </div>
        </div>

        {/* — UI Mockup Card (desktop only) — */}
        <div className="hidden lg:flex flex-1 justify-center items-center max-w-sm w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400 fill-mode-backwards">
          <div
            className="w-full rounded-3xl overflow-hidden shadow-2xl"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(16px)",
            }}
          >
            {/* Browser chrome */}
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)" }}
            >
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
              </div>
              <div
                className="flex-1 mx-3 px-3 py-1 rounded-md text-xs text-center"
                style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)" }}
              >
                tabayun.sa
              </div>
            </div>

            {/* Mockup body */}
            <div className="p-4 space-y-3" dir={dir}>
              {/* Header row */}
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold"
                style={{ background: "rgba(245,200,100,0.12)", color: "#f5c842" }}
              >
                <GitCompare className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{isAr ? "مقارنة الأنظمة" : "Law Comparison"}</span>
              </div>

              {/* Cards */}
              <div className="grid grid-cols-2 gap-2">
                {/* KSA */}
                <div
                  className="rounded-2xl p-3 space-y-2"
                  style={{ background: "rgba(245,200,100,0.08)", border: "1px solid rgba(245,200,100,0.2)" }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">🇸🇦</span>
                    <span className="text-xs font-bold" style={{ color: "#f5c842" }}>
                      {isAr ? "السعودية" : "KSA"}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 rounded-full w-full" style={{ background: "rgba(245,200,100,0.3)" }} />
                    <div className="h-1.5 rounded-full w-3/4" style={{ background: "rgba(245,200,100,0.15)" }} />
                    <div className="h-1.5 rounded-full w-1/2" style={{ background: "rgba(245,200,100,0.1)" }} />
                  </div>
                </div>
                {/* Foreign */}
                <div
                  className="rounded-2xl p-3 space-y-2"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">🌍</span>
                    <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.4)" }}>
                      {isAr ? "دولتك" : "Country"}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 rounded-full w-full" style={{ background: "rgba(255,255,255,0.1)" }} />
                    <div className="h-1.5 rounded-full w-3/4" style={{ background: "rgba(255,255,255,0.06)" }} />
                    <div className="h-1.5 rounded-full w-1/2" style={{ background: "rgba(255,255,255,0.06)" }} />
                  </div>
                </div>
              </div>

              {/* Result row */}
              <div
                className="rounded-2xl p-3 flex items-center gap-2"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(245,200,100,0.12)" }}
                >
                  <Scale className="w-3.5 h-3.5" style={{ color: "#f5c842" }} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="h-1.5 rounded-full w-full" style={{ background: "rgba(255,255,255,0.08)" }} />
                  <div className="h-1.5 rounded-full w-2/3" style={{ background: "rgba(255,255,255,0.05)" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-1.5 opacity-40 hover:opacity-80 transition-opacity"
      >
        <ArrowDown className="w-5 h-5 text-white animate-bounce" strokeWidth={2} />
      </button>
    </section>
  );
}
