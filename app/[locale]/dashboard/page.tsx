"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { lawService } from "@/services/lawService";
import { Comparison, Bookmark as BookmarkType } from "@/types/law";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Bookmark,
  Bot,
  Car,
  FileCheck,
  Globe2,
  History,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { PageShell, PrimaryButton, SectionHeader, SkeletonCard, StatePanel, StatusBadge, SurfaceCard } from "@/components/ui/tabayun";

const dictionaries = {
  ar: require("@/locales/ar/common.json"),
  en: require("@/locales/en/common.json")
};

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "ar";
  const dict = dictionaries[locale as keyof typeof dictionaries] || dictionaries.ar;
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const [priorityComparisons, setPriorityComparisons] = useState<Comparison[]>([]);
  const [recentBookmarks, setRecentBookmarks] = useState<BookmarkType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/${locale}/search?q=${encodeURIComponent(searchQuery)}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [comparisonsData, bookmarksData] = await Promise.all([
          lawService.getPriorityComparisons(),
          lawService.getMyBookmarks()
        ]);
        setPriorityComparisons(comparisonsData.slice(0, 4));
        setRecentBookmarks(bookmarksData.slice(0, 3));
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const quickCategories = [
    { key: "traffic", icon: Car, tone: "neutral" as const },
    { key: "residency", icon: FileCheck, tone: "neutral" as const },
    { key: "publicDecency", icon: ShieldCheck, tone: "neutral" as const },
    { key: "food", icon: UtensilsCrossed, tone: "neutral" as const },
  ];

  return (
    <PageShell dir={dir}>
      <Navbar />

      <section className="tabayun-page-offset pb-24">
        <div className="tabayun-container">
          <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
            <SurfaceCard dark className="p-6 md:p-9">
              <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <SectionHeader
                  align="start"
                  eyebrow={isAr ? "لوحة السياح الذكية" : "Visitor intelligence dashboard"}
                  icon={<Sparkles className="h-4 w-4" />}
                  title={isAr ? "اسأل، قارن، وتصرّف بثقة" : "Ask, compare, and act with confidence"}
                  description={
                    isAr
                      ? "ابدأ من موقفك الحالي وسنوجهك للقانون، التحذير، أو المقارنة المناسبة."
                      : "Start with your situation and we will guide you to the right law, warning, or comparison."
                  }
                  className="[&_*]:text-inherit [&_p]:text-tabayun-paper/62"
                />
                <PrimaryButton href={`/${locale}/chat`} locale={locale} className="bg-tabayun-paper text-tabayun-coffee hover:bg-white">
                  {isAr ? "اسأل المساعد" : "Ask assistant"}
                </PrimaryButton>
              </div>

              <form onSubmit={handleSearch} className="mt-8">
                <div className="flex flex-col gap-3 rounded-[26px] border border-white/12 bg-white/10 p-2 backdrop-blur sm:flex-row sm:items-center">
                  <div className="flex min-h-14 flex-1 items-center gap-3 rounded-2xl bg-tabayun-paper/95 px-4 text-tabayun-coffee">
                    <Search className="h-5 w-5 text-tabayun-clay" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={isAr ? "ابحث عن مخالفة، قانون، سلوك عام..." : "Search for a violation, law, public behavior..."}
                      className="min-w-0 flex-1 bg-transparent text-base font-bold placeholder:text-tabayun-coffee/35 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="min-h-14 rounded-2xl bg-tabayun-gold px-6 text-sm font-black text-tabayun-ink transition hover:bg-[#d5ad7d] active:scale-[0.98]"
                  >
                    {isAr ? "بحث سريع" : "Quick search"}
                  </button>
                </div>
              </form>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  [isAr ? "تحذيرات مهمة" : "Key warnings", isAr ? "قبل التصرف" : "before acting", AlertTriangle],
                  [isAr ? "مقارنة حسب بلدك" : "Country comparison", isAr ? "أوضح الفروقات" : "clear differences", Globe2],
                  [isAr ? "مصادر منظمة" : "Organized sources", isAr ? "قابلة للمراجعة" : "reviewable", ShieldCheck],
                ].map(([title, desc, Icon]) => {
                  const ItemIcon = Icon as typeof AlertTriangle;
                  return (
                    <div key={String(title)} className="rounded-3xl border border-white/10 bg-white/7 p-4">
                      <ItemIcon className="mb-3 h-5 w-5 text-tabayun-gold" />
                      <p className="font-black text-tabayun-paper">{title as string}</p>
                      <p className="mt-1 text-xs font-bold text-tabayun-paper/46">{desc as string}</p>
                    </div>
                  );
                })}
              </div>
            </SurfaceCard>

            <SurfaceCard className="p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-tabayun-danger/10 text-tabayun-danger">
                  <Bell className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-black text-tabayun-clay/65">{isAr ? "تنبيه للسائح" : "Visitor alert"}</p>
                  <h2 className="text-xl font-black text-tabayun-coffee">{isAr ? "انتبه لاختلاف الأنظمة" : "Regulations may differ"}</h2>
                </div>
              </div>
              <p className="text-sm font-semibold leading-relaxed text-tabayun-coffee/62">
                {isAr
                  ? "بعض السلوكيات اليومية قد تكون مسموحة في بلدك لكنها مقيدة أو مخالفة في السعودية. ابدأ دائماً بالبحث أو المقارنة."
                  : "Some everyday behaviors may be allowed in your country but restricted in Saudi Arabia. Start with search or comparison."}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <StatusBadge tone="danger">{isAr ? "ممنوع" : "Restricted"}</StatusBadge>
                <StatusBadge tone="warning">{isAr ? "قد يختلف" : "May vary"}</StatusBadge>
              </div>
            </SurfaceCard>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-8">
              <div>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h2 className="text-2xl font-black text-tabayun-coffee">{isAr ? "الفئات القانونية" : "Legal categories"}</h2>
                  <PrimaryButton href={`/${locale}/categories`} variant="ghost" locale={locale}>
                    {isAr ? "كل الفئات" : "All categories"}
                  </PrimaryButton>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {quickCategories.map((category) => {
                    const Icon = category.icon;
                    const title = dict.dashboard.sections?.[category.key] || category.key;
                    const desc = dict.dashboard.descriptions?.[category.key] || "";
                    return (
                      <button
                        key={category.key}
                        type="button"
                        onClick={() => router.push(`/${locale}/categories`)}
                        className="group flex flex-col rounded-[32px] border border-tabayun-sand/60 bg-white p-6 text-start shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-tabayun-gold/40 hover:shadow-xl hover:shadow-tabayun-coffee/5"
                      >
                        <div className="mb-6 flex items-center justify-between">
                          <span className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-tabayun-sand/40 text-tabayun-coffee transition-all duration-300 group-hover:bg-tabayun-coffee group-hover:text-white group-hover:shadow-lg group-hover:shadow-tabayun-coffee/20">
                            <Icon className="h-7 w-7" strokeWidth={1.5} />
                          </span>
                          <StatusBadge tone={category.tone} className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            {isAr ? "استكشف" : "Explore"}
                          </StatusBadge>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-lg font-black leading-tight text-tabayun-coffee group-hover:text-tabayun-gold transition-colors">
                            {title}
                          </h3>
                          <p className="line-clamp-2 text-xs font-bold leading-relaxed text-tabayun-coffee/50">
                            {desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h2 className="text-2xl font-black text-tabayun-coffee">
                    {isAr ? "الأكثر أهمية الآن" : "Important now"}
                  </h2>
                  <div className="flex items-center gap-2">
                    <StatusBadge tone="warning">{isAr ? "محدّث" : "Updated"}</StatusBadge>
                  </div>
                </div>

                {loading ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <SkeletonCard />
                    <SkeletonCard />
                  </div>
                ) : priorityComparisons.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {priorityComparisons.map((comp) => (
                      <button
                        key={comp.id}
                        onClick={() => router.push(`/${locale}/laws/${comp.id}`)}
                        className="group rounded-[28px] border border-tabayun-sand bg-tabayun-pearl p-5 text-start shadow-[0_14px_36px_rgba(44,22,15,0.06)] transition hover:-translate-y-1 hover:border-tabayun-gold/55"
                      >
                        <div className="mb-5 flex items-start justify-between gap-3">
                          <StatusBadge tone="warning">{isAr ? "تحقق" : "Check"}</StatusBadge>
                          {isAr ? (
                            <ArrowLeft className="h-5 w-5 text-tabayun-coffee/30 group-hover:text-tabayun-coffee transition-colors" />
                          ) : (
                            <ArrowRight className="h-5 w-5 text-tabayun-coffee/30 group-hover:text-tabayun-coffee transition-colors" />
                          )}
                        </div>
                        <h3 className="line-clamp-2 text-xl font-black leading-tight text-tabayun-coffee group-hover:text-tabayun-gold transition-colors">
                          {isAr ? (comp.saudi_law?.title || comp.title) : (comp.foreign_law?.title || comp.title)}
                        </h3>
                        <p className="mt-3 line-clamp-2 text-sm font-semibold leading-relaxed text-tabayun-coffee/55">
                          {isAr ? (comp.saudi_law?.simplified_text || comp.summary) : (comp.foreign_law?.simplified_text || comp.summary)}
                        </p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <StatePanel
                    title={isAr ? "لا توجد مقارنات شائعة حالياً" : "No priority comparisons yet"}
                    description={isAr ? "ابدأ بتصفح الفئات أو استخدم البحث للوصول للمعلومة." : "Browse categories or search to find the right guidance."}
                    action={isAr ? "تصفح الفئات" : "Browse categories"}
                    onAction={() => router.push(`/${locale}/categories`)}
                    locale={locale}
                  />
                )}
              </div>
            </div>

            <SurfaceCard className="h-fit p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-tabayun-sand/55 text-tabayun-coffee">
                  <History className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-black text-tabayun-clay/65">{isAr ? "نشاطك" : "Your activity"}</p>
                  <h2 className="text-xl font-black text-tabayun-coffee">{isAr ? "المحفوظات الأخيرة" : "Recent saves"}</h2>
                </div>
              </div>

              {loading ? (
                <div className="py-10 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-tabayun-coffee" />
                </div>
              ) : recentBookmarks.length > 0 ? (
                <div className="space-y-3">
                  {recentBookmarks.map((bookmark) => (
                    <button
                      key={bookmark.id}
                      onClick={() => bookmark.comparison_id && router.push(`/${locale}/laws/${bookmark.comparison_id}`)}
                      className="flex w-full items-center gap-3 rounded-3xl bg-tabayun-sand/32 p-4 text-start transition hover:bg-tabayun-sand/55"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-tabayun-pearl text-tabayun-coffee">
                        <Bookmark className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-black text-tabayun-coffee">
                          {bookmark.comparison?.title || (isAr ? "مقارنة محفوظة" : "Saved comparison")}
                        </span>
                        <span className="mt-1 block text-xs font-bold text-tabayun-coffee/42">
                          {new Date(bookmark.created_at).toLocaleDateString(isAr ? "ar-SA" : "en-US")}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <StatePanel
                  className="p-7"
                  title={isAr ? "لا توجد محفوظات بعد" : "No saves yet"}
                  description={isAr ? "احفظ المقارنات المهمة للرجوع إليها أثناء رحلتك." : "Save important comparisons for quick access during your trip."}
                  action={isAr ? "ابدأ التصفح" : "Start browsing"}
                  onAction={() => router.push(`/${locale}/categories`)}
                  locale={locale}
                />
              )}
            </SurfaceCard>
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={() => router.push(`/${locale}/chat`)}
        className={`fixed bottom-[calc(6.75rem+env(safe-area-inset-bottom))] ${dir === "rtl" ? "left-5" : "right-5"} z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-tabayun-coffee text-tabayun-paper shadow-[0_18px_44px_rgba(44,22,15,0.24)] transition hover:bg-tabayun-ink active:scale-95 md:bottom-8`}
        aria-label={isAr ? "المساعد الذكي" : "AI assistant"}
      >
        <Bot className="h-6 w-6" />
      </button>
    </PageShell>
  );
}
