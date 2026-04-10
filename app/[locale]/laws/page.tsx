"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { lawService } from "@/services/lawService";
import { Comparison } from "@/types/law";
import { LawCard } from "@/components/LawCard";
import ar from "@/locales/ar/common.json";
import en from "@/locales/en/common.json";
import { ChevronLeft, ChevronRight, Scale, Loader2 } from "lucide-react";

const dictionaries = { ar, en };

function LawsListContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = (params.locale as string) || "ar";
  const dict = dictionaries[locale as keyof typeof dictionaries] || ar;
  const dir = locale === "ar" ? "rtl" : "ltr";

  const categoryId = searchParams.get("category");
  const categoryName = searchParams.get("name") || (locale === 'ar' ? 'القسم' : 'Category');

  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComparisons = async () => {
      if (!categoryId) return;
      try {
        setLoading(true);
        const data = await lawService.getLawsByCategory(Number(categoryId));
        setComparisons(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComparisons();
  }, [categoryId]);

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
            <h1 className="text-4xl md:text-7xl font-black text-[#3d2e20] leading-none text-balance">
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

      {/* Comparisons List Items */}
      <div className="flex-grow w-full max-w-5xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#3d2e20] animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-bold">
            {locale === 'ar' ? 'فشل تحميل المقارنات: ' : 'Failed to load comparisons: '} {error}
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-backwards">
            {comparisons.length > 0 ? (
              comparisons.map((comp) => (
                <LawCard key={comp.id} comparison={comp} locale={locale} />
              ))
            ) : (
              <div className="py-32 text-center bg-white/40 rounded-[3rem] border-2 border-dashed border-[#3d2e20]/5">
                <p className="text-[#3d2e20]/30 text-xl font-black">
                  {locale === "ar" ? "لا توجد مقارنات متاحة حالياً" : "No comparisons available"}
                </p>
              </div>
            )}
          </div>
        )}
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
