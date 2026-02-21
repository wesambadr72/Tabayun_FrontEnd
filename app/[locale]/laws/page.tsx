"use client";
import React, { Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ar from "@/locales/ar/common.json";
import en from "@/locales/en/common.json";
import { MOCK_LAWS } from "@/lib/mock-data";
import { ChevronLeft, ChevronRight, Scale, ArrowRight, ArrowLeft, ArrowDownCircle } from "lucide-react";

const dictionaries = { ar, en };

function LawsListContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = (params.locale as string) || "ar";
  const dict = dictionaries[locale as keyof typeof dictionaries] || ar;
  const dir = locale === "ar" ? "rtl" : "ltr";

  const categoryKey = searchParams.get("category") || "traffic";
  const categoryName = (dict.dashboard.sections as any)[categoryKey] || categoryKey;

  // Assuming user country is Germany for now as per instructions
  const userCountry = "germany";
  const laws = MOCK_LAWS[userCountry]?.[categoryKey] || [];

  return (
    <main className="min-h-screen flex flex-col bg-[#f5f1eb]" dir={dir}>
      <Navbar />

      {/* Header Section */}
      <div className="w-full pt-32 md:pt-44 pb-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="space-y-4 max-w-2xl">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[#3d2e20]/40 hover:text-[#3d2e20] transition-colors font-black text-sm uppercase tracking-widest mb-2"
            >
              {locale === "ar" ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              {locale === "ar" ? "العودة للأقسام" : "Back to Categories"}
            </button>
            <h1 className="text-4xl md:text-7xl font-black text-[#3d2e20] leading-none">
              {categoryName}
            </h1>
            <p className="text-[#3d2e20]/60 text-lg md:text-xl font-medium leading-relaxed">
              {locale === "ar"
                ? `اكتشف وقارن أهم قوانين ${categoryName} المطبقة في دولتك.`
                : `Discover and compare the most important ${categoryName} laws in your country.`}
            </p>
          </div>
          <div className="hidden md:flex flex-col items-center gap-2 text-[#3d2e20]/20">
            <Scale className="w-16 h-16" strokeWidth={1} />
          </div>
        </div>
      </div>

      {/* Laws List Items */}
      <div className="flex-grow w-full max-w-5xl mx-auto px-6 pb-24">
        <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-backwards">
          {laws.length > 0 ? (
            laws.map((law, index) => (
              <button
                key={law.id}
                onClick={() => router.push(`/${locale}/laws/${law.id}`)}
                className="group w-full bg-white rounded-[2rem] p-6 md:p-10 border border-[#3d2e20]/5 shadow-sm hover:shadow-xl hover:border-[#3d2e20]/10 transition-all duration-300 text-start rtl:text-right flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-[#3d2e20]/5 text-[#3d2e20]/40 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#3d2e20]/5">
                      {locale === "ar" ? "قانون" : "LAW"} #{index + 1}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-[#3d2e20] group-hover:text-[#3d2e20] transition-colors">
                    {locale === "ar" ? law.title_ar : law.title_en}
                  </h3>
                  <p className="text-[#3d2e20]/50 text-base md:text-lg font-medium leading-relaxed max-w-2xl line-clamp-2">
                    {locale === "ar" ? law.desc_ar : law.desc_en}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-xs font-black text-[#3d2e20]/20 uppercase tracking-widest">{locale === 'ar' ? 'استعراض وقارن' : 'View & Compare'}</span>
                  </div>
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-[#f5f1eb] text-[#3d2e20]/20 flex items-center justify-center group-hover:bg-[#3d2e20] group-hover:text-white transition-all duration-300 shadow-sm">
                    {locale === "ar" ? <ArrowLeft className="w-6 h-6" /> : <ArrowRight className="w-6 h-6" />}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="py-32 text-center bg-white/40 rounded-[3rem] border-2 border-dashed border-[#3d2e20]/5">
              <p className="text-[#3d2e20]/30 text-xl font-black">
                {locale === "ar" ? "لا توجد قوانين متاحة حالياً" : "No laws available yet"}
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function LawsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f5f1eb] flex items-center justify-center">Loading...</div>}>
      <LawsListContent />
    </Suspense>
  );
}
