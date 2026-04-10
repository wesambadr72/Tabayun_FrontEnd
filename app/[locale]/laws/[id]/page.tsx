"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { lawService } from "@/services/lawService";
import { Comparison } from "@/types/law";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Scale, Info, CheckCircle2, AlertCircle, Quote, Bookmark, Loader2 } from "lucide-react";
import ar from "@/locales/ar/common.json";
import en from "@/locales/en/common.json";

const dictionaries = { ar, en };

export default function LawDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "ar";
  const id = params.id as string;
  const dict = dictionaries[locale as keyof typeof dictionaries] || ar;
  const dir = locale === "ar" ? "rtl" : "ltr";

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [comparison, setComparison] = useState<Comparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComparison = async () => {
      try {
        setLoading(true);
        const data = await lawService.getComparisonById(Number(id));
        setComparison(data);
      } catch (err: any) {
        console.error("Failed to fetch comparison", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchComparison();
    }
  }, [id]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem("bookmarks");
      const ids: string[] = stored ? JSON.parse(stored) : [];
      setIsBookmarked(ids.includes(id));
    } catch {
      setIsBookmarked(false);
    }
  }, [id]);

  const toggleBookmark = () => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem("bookmarks");
      let ids: string[] = stored ? JSON.parse(stored) : [];

      if (ids.includes(id)) {
        ids = ids.filter((i) => i !== id);
        setIsBookmarked(false);
      } else {
        ids.push(id);
        setIsBookmarked(true);
      }
      localStorage.setItem("bookmarks", JSON.stringify(ids));
    } catch (error) {
      console.error("Failed to toggle bookmark", error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f1eb] flex flex-col items-center justify-center p-4">
        <Navbar />
        <Loader2 className="w-12 h-12 text-[#3d2e20] animate-spin" />
      </main>
    );
  }

  if (error || !comparison) {
    return (
      <main className="min-h-screen bg-[#f5f1eb] flex flex-col items-center justify-center p-4">
        <Navbar />
        <h1 className="text-2xl font-bold text-[#3d2e20]">
          {locale === "ar" ? "لا توجد بيانات لهذا القانون" : "No data for this law"}
        </h1>
        <button
          onClick={() => router.back()}
          className="mt-4 px-6 py-2 bg-[#3d2e20] text-white rounded-full font-bold"
        >
          {locale === "ar" ? "العودة" : "Go Back"}
        </button>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center overflow-x-hidden bg-[#f5f1eb]" dir={dir}>
      <Navbar />

      <div className="relative z-20 w-full flex flex-col items-center pt-32 md:pt-40 pb-20 px-4">

        {/* Breadcrumb & Simple Header */}
        <div className="w-full max-w-5xl px-4 md:px-8 mb-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#3d2e20]/40 hover:text-[#3d2e20] transition-colors font-bold group mb-6"
          >
            {locale === "ar" ? <ChevronRight className="w-4 h-4 group-hover:translate-x-1" /> : <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1" />}
            {locale === "ar" ? "العودة للقائمة" : "Back to List"}
          </button>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl md:text-5xl font-black text-[#3d2e20] leading-tight">
                {comparison.foreign_law?.title || (locale === "ar" ? "قانون غير متوفر" : "Unavailable Law")}
              </h1>
              <button
                onClick={toggleBookmark}
                className={`p-3 rounded-full transition-all ${isBookmarked ? "bg-[#3d2e20] text-white" : "bg-white text-[#3d2e20] border border-[#3d2e20]/10 hover:bg-[#3d2e20]/5"}`}
              >
                <Bookmark className={`w-6 h-6 ${isBookmarked ? "fill-current" : ""}`} />
              </button>
            </div>
            <div className="h-1 w-20 bg-[#3d2e20] rounded-full" />
          </div>
        </div>

        {/* Improved Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl px-4 md:px-8 mb-12 relative animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-backwards">

          {/* Country Card 1: Foreign Law */}
          <div className="relative group bg-white rounded-3xl p-8 md:p-10 border border-[#3d2e20]/5 shadow-sm hover:shadow-xl transition-all duration-500">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="text-3xl shadow-sm">🌍</span>
                <span className="text-sm font-black text-[#3d2e20]/40 uppercase tracking-widest">
                  {comparison.foreign_law?.country || (locale === "ar" ? "دولة أجنبية" : "Foreign Country")}
                </span>
              </div>
              <div className="p-2 rounded-full bg-[#f5f1eb] text-[#3d2e20]/20">
                <Info className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-black text-[#3d2e20]">
                {comparison.foreign_law?.title || (locale === "ar" ? "لا يوجد عنوان" : "No Title")}
              </h3>
              <p className="text-[#3d2e20]/60 text-lg leading-relaxed font-medium">
                {comparison.foreign_law?.simplified_text || (locale === "ar" ? "لا يوجد نص" : "No Text")}
              </p>
            </div>
          </div>

          {/* Country Card 2: Saudi Arabia */}
          <div className="relative group bg-[#3d2e20] text-white rounded-3xl p-8 md:p-10 shadow-2xl overflow-hidden transition-all duration-500">
            {/* Subtle Gradient Overly */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />

            <div className="relative z-10 flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="text-3xl shadow-sm">🇸🇦</span>
                <span className="text-sm font-black text-white/40 uppercase tracking-widest">
                  {locale === "ar" ? "المملكة العربية السعودية" : "Saudi Arabia"}
                </span>
              </div>
              <div className="p-2 rounded-full bg-white/10 text-white/40">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
            </div>

            <div className="relative z-10 space-y-4">
              <h3 className="text-2xl font-black">
                {comparison.saudi_law?.title || (locale === "ar" ? "لا يوجد عنوان" : "No Title")}
              </h3>
              <p className="text-white/80 text-lg leading-relaxed font-medium">
                {comparison.saudi_law?.simplified_text || (locale === "ar" ? "لا يوجد نص" : "No Text")}
              </p>
            </div>
          </div>
        </div>

        {/* Difference Brief - More Clean & Modern */}
        <div className="w-full max-w-5xl px-4 md:px-8 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300 fill-mode-backwards">
          <div className="bg-white border-2 border-[#3d2e20] rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden">
            {/* Decorative Icon */}
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] scale-[4] rotate-12">
              <Scale className="text-[#3d2e20]" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="flex-shrink-0 w-16 h-16 bg-[#3d2e20] rounded-2xl flex items-center justify-center text-white shadow-xl">
                <AlertCircle className="w-8 h-8" />
              </div>

              <div className="space-y-6 text-center md:text-start">
                <h2 className="text-2xl md:text-3xl font-black text-[#3d2e20]">
                  {locale === "ar" ? "ما هو التباين؟" : "What is the difference?"}
                </h2>

                <div className="relative">
                  <Quote className="absolute -top-4 -right-6 w-12 h-12 text-[#3d2e20]/5 rtl:block hidden" />
                  <Quote className="absolute -top-4 -left-6 w-12 h-12 text-[#3d2e20]/5 ltr:block hidden" />
                  <p className="text-[#3d2e20] text-xl md:text-2xl leading-relaxed font-bold italic">
                    {comparison.comparison_text || (locale === "ar" ? "لا يوجد نص تباين" : "No comparison text")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-16">
          <button
            onClick={() => router.push(`/${locale}/chat`)}
            className="px-12 py-5 bg-[#3d2e20] text-white rounded-full font-black text-lg shadow-[0_20px_50px_-15px_rgba(61,46,32,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group"
          >
            <span>{locale === "ar" ? "استفسر أكثر من المساعد الذكي" : "Ask for more details"}</span>
            {dir === "rtl" ? <ArrowLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform" /> : <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />}
          </button>
        </div>
      </div>
    </main>
  );
}
