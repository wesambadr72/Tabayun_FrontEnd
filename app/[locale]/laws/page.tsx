"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { lawService } from "@/services/lawService";
import { authService } from "@/services/authService";
import { Comparison } from "@/types/law";
import { LawCard } from "@/components/LawCard";
import ar from "@/locales/ar/common.json";
import en from "@/locales/en/common.json";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Filter, Scale } from "lucide-react";
import { PageShell, PrimaryButton, SectionHeader, SkeletonCard, StatePanel, StatusBadge, SurfaceCard } from "@/components/ui/tabayun";

const dictionaries = { ar, en };

function LawsListContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = (params.locale as string) || "ar";
  const dir = locale === "ar" ? "rtl" : "ltr";
  const isAr = locale === "ar";

  const categoryId = searchParams.get("category");
  const categoryName = searchParams.get("name") || (isAr ? "القسم" : "Category");

  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userCountry, setUserCountry] = useState<string | null>(null);

  useEffect(() => {
    const user = authService.getUser();
    if (user?.country) setUserCountry(user.country);
  }, []);

  useEffect(() => {
    const fetchComparisons = async () => {
      if (!categoryId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await lawService.getLawsByCategory(Number(categoryId));
        
        // Filter by user country if available
        let filteredData = data;
        if (userCountry) {
          filteredData = data.filter(comp =>
            comp.foreign_law?.country.toLowerCase() === userCountry.toLowerCase() ||
            !comp.foreign_law
          );
        }
        setComparisons(filteredData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComparisons();
  }, [categoryId, userCountry]);

  return (
    <PageShell dir={dir}>
      <Navbar />

      <section className="tabayun-page-offset pb-16">
        <div className="tabayun-container">
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="mb-6 inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-black text-tabayun-coffee/55 transition hover:bg-tabayun-sand/45 hover:text-tabayun-coffee"
            >
              {isAr ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              {isAr ? "العودة للأقسام" : "Back to categories"}
            </button>

            <div className="grid items-end gap-6 lg:grid-cols-[1fr_320px]">
              <SectionHeader
                align="start"
                eyebrow={isAr ? "مقارنات الفئة" : "Category comparisons"}
                icon={<Scale className="h-4 w-4" />}
                title={categoryName}
                description={
                  isAr
                    ? `اطلع على أهم الفروقات المرتبطة بـ ${categoryName}، مع خلاصة عملية للسائح.`
                    : `Review key differences for ${categoryName}, with practical visitor guidance.`
                }
              />

              <SurfaceCard className="p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-tabayun-sand/50 text-tabayun-coffee">
                    <Filter className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-black text-tabayun-clay/65">{isAr ? "فلترة ذكية" : "Smart filter"}</p>
                    <p className="text-sm font-bold text-tabayun-coffee/62">
                      {userCountry
                        ? (isAr ? `حسب بلدك: ${userCountry}` : `By your country: ${userCountry}`)
                        : (isAr ? "اختر بلدك من الملف الشخصي لتخصيص النتائج" : "Set your country in profile to personalize results")}
                    </p>
                  </div>
                </div>
              </SurfaceCard>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonCard key={index} className="min-h-[240px]" />
              ))}
            </div>
          ) : error ? (
            <StatePanel
              type="error"
              title={isAr ? "فشل تحميل المقارنات" : "Could not load comparisons"}
              description={error}
              action={isAr ? "العودة للأقسام" : "Back to categories"}
              onAction={() => router.push(`/${locale}/categories`)}
              locale={locale}
            />
          ) : comparisons.length > 0 ? (
            <>
              <div className="mb-5 flex items-center justify-between gap-4">
                <StatusBadge tone="neutral">
                  {isAr ? `${comparisons.length} مقارنة متاحة` : `${comparisons.length} comparisons available`}
                </StatusBadge>
                <PrimaryButton href={`/${locale}/chat`} variant="secondary" locale={locale}>
                  {isAr ? "اسأل عن هذه الفئة" : "Ask about this domain"}
                </PrimaryButton>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {comparisons.map((comp) => (
                  <LawCard key={comp.id} comparison={comp} locale={locale} />
                ))}
              </div>
            </>
          ) : (
            <StatePanel
              title={isAr ? "لا توجد مقارنات متاحة حالياً" : "No comparisons available yet"}
              description={isAr ? "قد لا تكون هناك بيانات مطابقة لبلدك أو لهذه الفئة حالياً." : "There may be no data matching your country or this category yet."}
              action={isAr ? "تصفح فئة أخرى" : "Browse another category"}
              onAction={() => router.push(`/${locale}/categories`)}
              locale={locale}
            />
          )}
        </div>
      </section>

      <Footer />
    </PageShell>
  );
}

export default function LawsPage() {
  return (
    <Suspense
      fallback={
        <PageShell>
          <div className="flex min-h-screen items-center justify-center">
            <div className="flex items-center gap-3 text-tabayun-coffee">
              <Scale className="h-6 w-6 animate-pulse" />
              <span className="font-black">Loading...</span>
            </div>
          </div>
        </PageShell>
      }
    >
      <LawsListContent />
    </Suspense>
  );
}
