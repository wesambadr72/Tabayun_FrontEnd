"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { lawService } from "@/services/lawService";
import { SearchResult } from "@/types/law";
import { 
  Search, 
  ArrowLeft, 
  ArrowRight, 
  Loader2, 
  Scale, 
  Globe, 
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Image from "next/image";

function SearchResultsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = (params.locale as string) || "ar";
  const query = searchParams.get("q") || "";
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInputValue, setSearchQueryValue] = useState(query);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await lawService.search(query);
        
        // Deduplicate results based on type and id
        const uniqueResults = data.filter((item, index, self) =>
          index === self.findIndex((t) => (
            t.id === item.id && t.type === item.type
          ))
        );
        
        setResults(uniqueResults);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInputValue.trim()) return;
    router.push(`/${locale}/search?q=${encodeURIComponent(searchInputValue)}`);
  };

  const getFlagPath = (country: string) => {
    const code = country.toLowerCase();
    const mapping: Record<string, string> = {
      "germany": "/image/flags/germany.png",
      "المانيا": "/image/flags/germany.png",
      "united kingdom": "/image/flags/uk.png",
      "المملكة المتحدة": "/image/flags/uk.png",
      "saudi arabia": "/image/flags/saudi_arabia.png",
      "السعودية": "/image/flags/saudi_arabia.png",
    };
    return mapping[code] || "/image/flags/placeholder.png";
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#f5f1eb]" dir={dir}>
      <Navbar />

      <div className="flex-grow w-full max-w-5xl mx-auto pt-32 md:pt-44 pb-24 px-6">
        
        {/* Search Header & Re-search bar */}
        <div className="mb-16 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="space-y-4">
            <button
              onClick={() => router.push(`/${locale}/dashboard`)}
              className="flex items-center gap-2 text-[#3d2e20]/40 hover:text-[#3d2e20] transition-colors font-black text-sm uppercase tracking-widest"
            >
              {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              {isAr ? "العودة للرئيسية" : "Back to Dashboard"}
            </button>
            <h1 className="text-4xl md:text-6xl font-black text-[#3d2e20]">
              {isAr ? 'نتائج البحث' : 'Search Results'}
            </h1>
            <p className="text-[#3d2e20]/60 text-lg font-medium">
              {isAr 
                ? `تظهر نتائج البحث عن: "${query}"` 
                : `Showing results for: "${query}"`}
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-white border border-[#3d2e20]/10 rounded-[2rem] shadow-xl p-2 focus-within:ring-4 focus-within:ring-[#3d2e20]/5 transition-all max-w-2xl">
            <input
              type="text"
              value={searchInputValue}
              onChange={(e) => setSearchQueryValue(e.target.value)}
              placeholder={isAr ? "ابحث عن شيء آخر..." : "Search for something else..."}
              className="w-full bg-transparent border-none py-4 px-6 text-lg text-[#3d2e20] placeholder-[#3d2e20]/30 focus:outline-none font-bold"
            />
            <button type="submit" className="bg-[#3d2e20] hover:bg-[#523e2b] text-white p-4 rounded-xl transition-all shadow-lg active:scale-95">
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Results Section */}
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-[#3d2e20] animate-spin" />
            <p className="text-[#3d2e20]/40 font-bold animate-pulse">
              {isAr ? 'جاري البحث...' : 'Searching...'}
            </p>
          </div>
        ) : error ? (
          <div className="py-20 text-center bg-red-50 rounded-[3rem] border-2 border-red-100 p-12">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-red-500 mb-2">{isAr ? 'حدث خطأ' : 'An error occurred'}</h2>
            <p className="text-red-400 font-bold">{error}</p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {results.map((result) => (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => router.push(`/${locale}/laws/${result.id}`)}
                className="group w-full bg-white border border-[#3d2e20]/5 rounded-[2.5rem] p-8 md:p-10 text-right rtl:text-right ltr:text-left hover:border-[#3d2e20]/20 hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row md:items-center gap-8 relative overflow-hidden"
              >
                {/* Decorative background accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#3d2e20]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-[#3d2e20]/10 transition-colors" />

                {/* Icon/Flag Section */}
                <div className="flex-shrink-0 flex items-center justify-center">
                  <div className="relative w-20 h-20 bg-[#f5f1eb] rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-[#3d2e20]/5">
                    {result.type === 'comparison' ? (
                      <Scale className="w-10 h-10 text-[#3d2e20]" />
                    ) : (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#3d2e20]/10">
                        <Image 
                          src={getFlagPath(result.country)} 
                          alt={result.country} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-grow space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-[#3d2e20]/5 text-[#3d2e20] text-[10px] font-black uppercase tracking-widest rounded-full">
                      {result.type === 'comparison' ? (isAr ? 'مقارنة' : 'Comparison') : (isAr ? 'قانون' : 'Law')}
                    </span>
                    <span className="text-[#3d2e20]/30 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {result.country}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-[#3d2e20] group-hover:text-[#523e2b] transition-colors line-clamp-1">
                    {result.title}
                  </h3>
                  <p className="text-[#3d2e20]/60 text-lg font-medium line-clamp-2 leading-relaxed">
                    {result.description}
                  </p>
                </div>

                {/* Arrow Action */}
                <div className="flex-shrink-0 self-end md:self-center">
                  <div className="w-14 h-14 bg-[#3d2e20] text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#523e2b] active:scale-95 transition-all">
                    {isAr ? <ArrowLeft className="w-6 h-6" /> : <ArrowRight className="w-6 h-6" />}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-white/40 rounded-[3rem] border-2 border-dashed border-[#3d2e20]/5 animate-in fade-in duration-700">
            <div className="w-24 h-24 bg-[#3d2e20]/5 rounded-full flex items-center justify-center mx-auto mb-8">
              <Search className="w-10 h-10 text-[#3d2e20]/20" />
            </div>
            <h2 className="text-3xl font-black text-[#3d2e20] mb-4">
              {isAr ? 'لا توجد نتائج مطابقة' : 'No results found'}
            </h2>
            <p className="text-[#3d2e20]/40 text-xl font-bold max-w-md mx-auto leading-relaxed">
              {isAr 
                ? 'جرب البحث بكلمات أخرى أو تحقق من الأقسام المتاحة في المنصة.' 
                : 'Try searching with different keywords or check the available categories.'}
            </p>
            <button
              onClick={() => router.push(`/${locale}/categories`)}
              className="mt-10 px-10 py-4 bg-[#3d2e20] text-white rounded-full font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#3d2e20]/20"
            >
              {isAr ? 'تصفح الأقسام' : 'Browse Categories'}
            </button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f5f1eb] flex items-center justify-center"><Loader2 className="w-12 h-12 text-[#3d2e20] animate-spin" /></div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
