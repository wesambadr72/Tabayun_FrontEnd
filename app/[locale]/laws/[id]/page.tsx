"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { lawService } from "@/services/lawService";
import { ComparisonDetail } from "@/types/law";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  Scale,
} from "lucide-react";
import { PageShell, PrimaryButton, SectionHeader, StatePanel, StatusBadge, SurfaceCard } from "@/components/ui/tabayun";

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
        const data = await lawService.getComparisonById(Number(comparisonId));
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
      setIsBookmarked(true);
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
      "usa": "/image/flags/usa.png",
      "united states": "/image/flags/usa.png",
      "sa": "/image/flags/saudi_arabia.png",
      "saudi arabia": "/image/flags/saudi_arabia.png",
      "السعودية": "/image/flags/saudi_arabia.png",
    };
    return mapping[code] || "/image/flags/saudi_arabia.png";
  };

  if (loading) {
    return (
      <PageShell dir={dir}>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-tabayun-coffee" />
        </div>
      </PageShell>
    );
  }

  if (error || !comparison) {
    return (
      <PageShell dir={dir}>
        <Navbar />
        <section className="tabayun-page-offset tabayun-container pb-20">
          <StatePanel
            type="error"
            title={isAr ? "تعذر تحميل المقارنة" : "Could not load comparison"}
            description={error || (isAr ? "البيانات غير متاحة حالياً." : "Data is not available right now.")}
            action={isAr ? "العودة" : "Go back"}
            onAction={() => router.back()}
            locale={locale}
          />
        </section>
      </PageShell>
    );
  }

  const saudiText =
    comparison.saudi_law.simplified_text ||
    comparison.saudi_law.simplified_description ||
    comparison.saudi_law.text;
  const foreignText =
    comparison.foreign_law.simplified_text ||
    comparison.foreign_law.simplified_description ||
    comparison.foreign_law.text;

  return (
    <PageShell dir={dir}>
      <Navbar />

      <section className="tabayun-page-offset pb-16">
        <div className="tabayun-container">
          <button
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-black text-tabayun-coffee/55 transition hover:bg-tabayun-sand/45 hover:text-tabayun-coffee"
          >
            {isAr ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            {isAr ? "العودة" : "Back"}
          </button>

          <div className="grid items-end gap-6 lg:grid-cols-[1fr_320px]">
            <SectionHeader
              align="start"
              eyebrow={isAr ? "مقارنة قانونية" : "Legal comparison"}
              icon={<Scale className="h-4 w-4" />}
              title={comparison.title}
              description={
                comparison.simplified_description ||
                (isAr ? "مقارنة مبسطة بين النظام السعودي ونظام بلد السائح." : "A simplified comparison between Saudi regulation and the visitor's country.")
              }
            />

            <SurfaceCard className="p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-tabayun-danger/10 text-tabayun-danger">
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-black text-tabayun-clay/65">{isAr ? "تنبيه" : "Notice"}</p>
                  <p className="text-sm font-bold leading-relaxed text-tabayun-coffee/62">
                    {isAr ? "هذه خلاصة توعوية وليست استشارة قانونية." : "This is educational guidance, not legal advice."}
                  </p>
                </div>
              </div>
            </SurfaceCard>
          </div>

          <div className="mt-8 overflow-hidden rounded-[34px] border border-tabayun-sand bg-tabayun-pearl shadow-[0_24px_70px_rgba(44,22,15,0.12)]">
            <div className="grid md:grid-cols-2">
              <ComparisonSide
                title={comparison.foreign_law.title}
                country={comparison.foreign_law.country}
                text={foreignText}
                source={comparison.foreign_law.source_url}
                flag={getFlagPath(comparison.foreign_law.country)}
                isAr={isAr}
                dark
              />
              <ComparisonSide
                title={comparison.saudi_law.title}
                country={isAr ? "المملكة العربية السعودية" : "Saudi Arabia"}
                text={saudiText}
                source={comparison.saudi_law.source_url}
                flag={getFlagPath("saudi arabia")}
                isAr={isAr}
              />
            </div>

            <div className="border-t border-tabayun-sand bg-tabayun-paper p-6 md:p-9">
              <div className="mx-auto max-w-4xl text-center">
                <StatusBadge tone="info" className="mb-4">
                  {isAr ? "الخلاصة العملية" : "Practical summary"}
                </StatusBadge>
                <h2 className="text-3xl font-black text-tabayun-coffee">{isAr ? "ما الذي يجب أن تتذكره؟" : "What should you remember?"}</h2>
                <p className="mt-4 text-lg font-bold leading-relaxed text-tabayun-coffee/70">
                  {comparison.comparison_text || comparison.summary || (isAr ? "لا يوجد خلاصة حالياً" : "No summary available")}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={handleBookmark}
              className="tabayun-focus inline-flex items-center justify-center gap-2 rounded-2xl border border-tabayun-sand bg-tabayun-pearl px-5 py-3 text-sm font-black text-tabayun-coffee transition hover:bg-tabayun-sand/45"
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-tabayun-coffee" : ""}`} />
              {isBookmarked ? (isAr ? "تم الحفظ" : "Saved") : (isAr ? "حفظ المقارنة" : "Save comparison")}
            </button>

            <div className="flex gap-3">
              <PrimaryButton variant="secondary" onClick={() => router.back()} locale={locale}>
                {isAr ? "السابق" : "Previous"}
              </PrimaryButton>
              <PrimaryButton href={`/${locale}/chat`} locale={locale}>
                {isAr ? "اسأل عن هذه المقارنة" : "Ask about this"}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </PageShell>
  );
}

function ComparisonSide({
  title,
  country,
  text,
  source,
  flag,
  isAr,
  dark = false,
}: {
  title: string;
  country: string;
  text?: string;
  source?: string;
  flag: string;
  isAr: boolean;
  dark?: boolean;
}) {
  return (
    <article className={`${dark ? "bg-tabayun-coffee text-tabayun-paper" : "bg-tabayun-pearl text-tabayun-coffee"} p-6 md:p-9`}>
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <StatusBadge tone={dark ? "warning" : "neutral"} className={dark ? "border-white/14 bg-white/10 text-tabayun-paper" : ""}>
            {country}
          </StatusBadge>
          <h3 className="mt-4 text-2xl font-black leading-tight">{title}</h3>
        </div>
        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-white/18 bg-white">
          <Image src={flag} alt={country} fill className="object-cover" sizes="48px" />
        </span>
      </div>

      <p className={`text-base font-semibold leading-relaxed md:text-lg ${dark ? "text-tabayun-paper/68" : "text-tabayun-coffee/64"}`}>
        {text}
      </p>

      {source && (
        <a
          href={source}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-8 inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition ${
            dark ? "bg-white/8 text-tabayun-paper/62 hover:text-tabayun-paper" : "bg-tabayun-sand/42 text-tabayun-coffee/62 hover:text-tabayun-coffee"
          }`}
        >
          <span>{isAr ? "المصدر الأصلي" : "Original source"}</span>
          {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </article>
  );
}
