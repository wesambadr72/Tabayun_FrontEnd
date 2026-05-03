"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { lawService } from "@/services/lawService";
import { ComparisonDetail } from "@/types/law";
import { 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  ArrowLeft, 
  ArrowRight,
  Loader2,
  Scale,
  ExternalLink
} from "lucide-react";
import Image from "next/image";

export default function ComparisonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "ar";
  const comparisonId = params.id as string;
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const [comparison, setComparison] = useState<ComparisonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchComparison = async () => {
      if (!comparisonId) return;
      try {
        setLoading(true);
        const data = await lawService.getComparisonById(Number(comparisonId), locale);
        setComparison(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [comparisonId]);

  const handleBookmark = async () => {
    if (!comparison) return;
    try {
      await lawService.addBookmark(comparison.id);
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error("Failed to bookmark:", err);
    }
  };

  const getFlagPath = (country: string) => {
    const code = country.toLowerCase();
    const mapping: Record<string, string> = {
      "de": "/image/flags/germany.png",
      "germany": "/image/flags/germany.png",
      "المانيا": "/image/flags/germany.png",
      "uk": "/image/flags/uk.png",
      "united kingdom": "/image/flags/uk.png",
      "المملكة المتحدة": "/image/flags/uk.png",
      "sa": "/image/flags/saudi_arabia.png",
      "saudi arabia": "/image/flags/saudi_arabia.png",
      "السعودية": "/image/flags/saudi_arabia.png",
    };
    return mapping[code] || "/image/flags/placeholder.png";
  };

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col bg-[#f5f1eb]" dir={dir}>
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-[#3d2e20] animate-spin" />
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !comparison) {
    return (
      <main className="min-h-screen flex flex-col bg-[#f5f1eb]" dir={dir}>
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center space-y-4">
          <p className="text-red-500 font-bold text-xl">{isAr ? 'خطأ في تحميل البيانات' : 'Error loading data'}</p>
          <button onClick={() => router.back()} className="text-[#3d2e20] font-black underline">
            {isAr ? 'العودة للخلف' : 'Go Back'}
          </button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#f5f1eb]" dir={dir}>
      <Navbar />

      <div className="flex-grow w-full max-w-5xl mx-auto pt-32 md:pt-44 pb-24 px-6">
        {/* Comparison Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-black text-[#3d2e20] leading-tight">
            {comparison.title}
          </h1>
        </div>

        {/* The Dual Comparison Card (Image 2 Style) */}
        <div className="relative group animate-in fade-in zoom-in-95 duration-1000">
          <div className="bg-white rounded-[3rem] border-4 border-[#3d2e20]/10 shadow-2xl overflow-hidden">
            {/* Side-by-Side Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#3d2e20]/5 rtl:divide-x-reverse">
              {/* Foreign Law (Left/Start) */}
              <div className="bg-[#a37c5a] text-white p-8 md:p-12 relative group">
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white/20">
                    <Image 
                      src={getFlagPath(comparison.foreign_law.country)} 
                      alt={comparison.foreign_law.country} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                </div>
                <p className="text-xl md:text-2xl font-bold leading-relaxed">
                  {comparison.foreign_law.simplified_text || comparison.foreign_law.simplified_description || comparison.foreign_law.text}
                </p>

                {comparison.foreign_law.source_url && (
                  <a 
                    href={comparison.foreign_law.source_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-black text-white/40 hover:text-white transition-colors border-t border-white/10 pt-4 w-full"
                  >
                    <span>{isAr ? 'المصدر الأصلي' : 'Original Source'}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Saudi Law (Right/End) */}
              <div className="bg-white text-[#3d2e20] p-8 md:p-12 relative group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-end gap-3 mb-6">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-[#3d2e20]/10">
                      <Image 
                        src={getFlagPath("saudi arabia")} 
                        alt="Saudi Arabia" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <p className="text-xl md:text-2xl font-bold leading-relaxed text-start">
                    {comparison.saudi_law.simplified_text || comparison.saudi_law.simplified_description || comparison.saudi_law.text}
                  </p>
                </div>

                {comparison.saudi_law.source_url && (
                  <a 
                    href={comparison.saudi_law.source_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-black text-[#3d2e20]/20 hover:text-[#3d2e20] transition-colors border-t border-[#3d2e20]/5 pt-4 w-full"
                  >
                    <span>{isAr ? 'المصدر الأصلي' : 'Original Source'}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Summary Section (The "الخلاصة" part) */}
            <div className="bg-[#f5f1eb] p-8 md:p-12 border-t-4 border-[#3d2e20]/10 text-center">
              <h4 className="text-2xl md:text-3xl font-black text-[#3d2e20] mb-4">
                {isAr ? 'الخلاصة' : 'Summary'}
              </h4>
              <p className="text-[#3d2e20]/70 text-lg md:text-xl font-bold leading-relaxed italic max-w-3xl mx-auto">
                {comparison.comparison_text || comparison.summary || (isAr ? 'لا يوجد خلاصة حالياً' : 'No summary available')}
              </p>
            </div>
          </div>

          {/* Bookmark Button (Floats outside/inside) */}
          <button 
            onClick={handleBookmark}
            className={`absolute top-1/2 -translate-y-1/2 ${isAr ? '-left-12' : '-right-12'} hidden lg:flex bg-white p-4 rounded-2xl border-2 border-[#3d2e20]/5 shadow-xl hover:scale-110 active:scale-95 transition-all text-[#3d2e20]`}
          >
            <Bookmark className={`w-8 h-8 ${isBookmarked ? 'fill-[#3d2e20]' : ''}`} strokeWidth={2.5} />
          </button>
        </div>

        {/* Navigation Actions (Previous / Next) */}
        <div className="mt-16 flex items-center justify-center gap-6 md:gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <button 
            onClick={() => router.back()} // Ideally navigate to the next comparison ID in the category
            className="bg-white border-2 border-[#3d2e20]/10 text-[#3d2e20] px-10 md:px-16 py-4 md:py-5 rounded-full font-black text-xl md:text-2xl hover:bg-[#f5f1eb] transition shadow-lg flex items-center gap-3 active:scale-95"
          >
            {isAr ? 'السابق' : 'Previous'}
          </button>

          <button 
            onClick={() => router.back()} // Ideally navigate to the next comparison ID in the category
            className="bg-[#3d2e20] text-white px-10 md:px-16 py-4 md:py-5 rounded-full font-black text-xl md:text-2xl hover:bg-[#523e2b] transition shadow-lg flex items-center gap-3 active:scale-95"
          >
            {isAr ? 'التالي' : 'Next'}
          </button>
        </div>
      </div>

      <Footer />
    </main>
  );
}
