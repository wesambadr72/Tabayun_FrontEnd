"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { lawService } from "@/services/lawService";
import { SearchResult } from "@/types/law";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Globe2,
  Loader2,
  Scale,
  Search,
} from "lucide-react";
import Image from "next/image";
import { PageShell, PrimaryButton, SectionHeader, SkeletonCard, StatePanel, StatusBadge, SurfaceCard } from "@/components/ui/tabayun";

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
        const uniqueResults = data.filter((item, index, self) =>
          index === self.findIndex((t) => t.id === item.id && t.type === item.type)
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
      "usa": "/image/flags/usa.png",
      "united states": "/image/flags/usa.png",
    };
    return mapping[code] || "/image/flags/saudi_arabia.png";
  };

  return (
    <PageShell dir={dir}>
      <Navbar />

      <section className="tabayun-page-offset pb-16">
        <div className="tabayun-container">
          <button
            onClick={() => router.push(`/${locale}/dashboard`)}
            className="mb-6 inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-black text-tabayun-coffee/55 transition hover:bg-tabayun-sand/45 hover:text-tabayun-coffee"
          >
            {isAr ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            {isAr ? "العودة للوحة" : "Back to dashboard"}
          </button>

          <div className="grid items-end gap-6 lg:grid-cols-[1fr_360px]">
            <SectionHeader
              align="start"
              eyebrow={isAr ? "بحث موحد" : "Unified search"}
              icon={<Search className="h-4 w-4" />}
              title={isAr ? "ابحث عن قانون أو موقف" : "Search for a law or situation"}
              description={
                query
                  ? (isAr ? `نتائج البحث عن: "${query}"` : `Showing results for: "${query}"`)
                  : (isAr ? "اكتب ما تريد فهمه، وسنبحث في القوانين والمقارنات." : "Type what you need to understand, and we will search laws and comparisons.")
              }
            />

            <SurfaceCard className="p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-tabayun-sand/55 text-tabayun-coffee">
                  <Globe2 className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-black text-tabayun-clay/65">{isAr ? "نصيحة بحث" : "Search tip"}</p>
                  <p className="text-sm font-bold leading-relaxed text-tabayun-coffee/62">
                    {isAr ? "استخدم كلمات مثل: مخالفة، قيادة، تصوير، إقامة." : "Use words like: fine, driving, filming, residency."}
                  </p>
                </div>
              </div>
            </SurfaceCard>
          </div>

          <form onSubmit={handleSearchSubmit} className="mt-8 max-w-3xl">
            <div className="flex flex-col gap-3 rounded-[28px] border border-tabayun-sand bg-tabayun-pearl p-2 shadow-[0_14px_36px_rgba(44,22,15,0.08)] sm:flex-row sm:items-center">
              <div className="flex min-h-14 flex-1 items-center gap-3 px-4">
                <Search className="h-5 w-5 text-tabayun-clay" />
                <input
                  type="text"
                  value={searchInputValue}
                  onChange={(e) => setSearchQueryValue(e.target.value)}
                  placeholder={isAr ? "ابحث عن شيء آخر..." : "Search for something else..."}
                  className="min-w-0 flex-1 bg-transparent text-base font-bold text-tabayun-coffee placeholder:text-tabayun-coffee/35 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="min-h-14 rounded-2xl bg-tabayun-coffee px-6 text-sm font-black text-tabayun-paper transition hover:bg-tabayun-ink active:scale-[0.98]"
              >
                {isAr ? "بحث" : "Search"}
              </button>
            </div>
          </form>

          <div className="mt-8">
            {loading ? (
              <div className="grid gap-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <SkeletonCard key={index} className="min-h-[180px]" />
                ))}
              </div>
            ) : error ? (
              <StatePanel
                type="error"
                title={isAr ? "حدث خطأ أثناء البحث" : "Search failed"}
                description={error}
                locale={locale}
              />
            ) : results.length > 0 ? (
              <div className="space-y-4">
                <StatusBadge tone="neutral">
                  {isAr ? `${results.length} نتيجة` : `${results.length} results`}
                </StatusBadge>

                <div className="grid gap-4">
                  {results.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => router.push(`/${locale}/laws/${result.id}`)}
                      className="group rounded-[30px] border border-tabayun-sand bg-tabayun-pearl p-5 text-start shadow-[0_14px_36px_rgba(44,22,15,0.07)] transition duration-300 hover:-translate-y-1 hover:border-tabayun-gold/60 hover:shadow-[0_26px_70px_rgba(44,22,15,0.14)] md:p-6"
                    >
                      <div className="flex flex-col gap-5 md:flex-row md:items-center">
                        <div className="flex items-center gap-4">
                          <span className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[22px] bg-tabayun-sand/52 text-tabayun-coffee">
                            {result.type === "comparison" ? (
                              <Scale className="h-8 w-8" />
                            ) : (
                              <Image src={getFlagPath(result.country)} alt={result.country} fill className="object-cover" sizes="64px" />
                            )}
                          </span>
                          <div className="flex flex-wrap gap-2 md:hidden">
                            <ResultBadges result={result} isAr={isAr} />
                          </div>
                        </div>

                        <div className="min-w-0 flex-1 space-y-3">
                          <div className="hidden flex-wrap gap-2 md:flex">
                            <ResultBadges result={result} isAr={isAr} />
                          </div>
                          <h3 className="text-2xl font-black leading-tight text-tabayun-coffee md:text-3xl">
                            {result.title}
                          </h3>
                          <p className="line-clamp-2 text-sm font-semibold leading-relaxed text-tabayun-coffee/58 md:text-base">
                            {result.description}
                          </p>
                        </div>

                        <span className="ms-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-tabayun-sand/52 text-tabayun-coffee transition group-hover:bg-tabayun-coffee group-hover:text-tabayun-paper">
                          {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <StatePanel
                title={isAr ? "لا توجد نتائج مطابقة" : "No results found"}
                description={isAr ? "جرّب كلمات أخرى أو تصفح الفئات القانونية." : "Try different keywords or browse legal categories."}
                action={isAr ? "تصفح الفئات" : "Browse categories"}
                onAction={() => router.push(`/${locale}/categories`)}
                locale={locale}
              />
            )}
          </div>
        </div>
      </section>

      <Footer />
    </PageShell>
  );
}

function ResultBadges({ result, isAr }: { result: SearchResult; isAr: boolean }) {
  return (
    <>
      <StatusBadge tone={result.type === "comparison" ? "warning" : "info"}>
        {result.type === "comparison" ? (isAr ? "مقارنة" : "Comparison") : (isAr ? "قانون" : "Law")}
      </StatusBadge>
      <StatusBadge tone="neutral">{result.country}</StatusBadge>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <PageShell>
          <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-tabayun-coffee" />
          </div>
        </PageShell>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}
