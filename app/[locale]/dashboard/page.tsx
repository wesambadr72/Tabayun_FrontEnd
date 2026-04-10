"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { lawService } from "@/services/lawService";
import { Comparison, Bookmark as BookmarkType } from "@/types/law";
import {
  Search,
  Sparkles,
  Scale,
  AlertCircle,
  Car,
  Trash2,
  Store,
  Globe,
  ShieldCheck,
  Zap,
  TrendingUp,
  Bookmark,
  History,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

const dictionaries = {
  ar: require("@/locales/ar/common.json"),
  en: require("@/locales/en/common.json")
};

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "ar";
  const dict = dictionaries[locale as keyof typeof dictionaries] || dictionaries.ar;
  const dir = locale === "ar" ? "rtl" : "ltr";

  const [priorityComparisons, setPriorityComparisons] = useState<Comparison[]>([]);
  const [recentBookmarks, setRecentBookmarks] = useState<BookmarkType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [comparisonsData, bookmarksData] = await Promise.all([
          lawService.getPriorityComparisons(),
          lawService.getMyBookmarks()
        ]);
        setPriorityComparisons(comparisonsData.slice(0, 4)); // Get top 4
        setRecentBookmarks(bookmarksData.slice(0, 3)); // Get 3 most recent
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      }
    };
    fetchData();
  }, []);

  const quickStats = [
    { label: locale === 'ar' ? 'نظام وقانون' : 'Laws & Regs', value: '2,400+', icon: Scale },
    { label: locale === 'ar' ? 'تحديث يومي' : 'Daily Updates', value: '100%', icon: Zap },
    { label: locale === 'ar' ? 'دقة قانونية' : 'Legal Accuracy', value: '99.9%', icon: ShieldCheck },
  ];

  return (
    <main className="relative min-h-screen w-full flex flex-col overflow-x-hidden bg-[#f5f1eb]" dir={dir}>
      <Navbar />

      {/* Hero Section with Enhanced Background */}
      <section className="relative w-full flex flex-col items-center pt-40 pb-12 px-4">
        {/* Subtle Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none opacity-40">
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#3d2e20]/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#d4c5b5]/30 rounded-full blur-3xl" />
        </div>

        <div className="relative z-20 w-full max-w-5xl flex flex-col items-center">

          {/* Main Title & Description */}
          <div className="text-center mb-10 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3d2e20]/5 border border-[#3d2e20]/10 text-[#3d2e20] text-sm font-bold shadow-sm">
              <Sparkles className="w- h-4 text-[#3d2e20]" />
              <span className="font-regular">{locale === "ar" ? "محرك البحث القانوني الأول" : "The #1 Legal Search Engine"}</span>
            </div>

            <h1 className="text-4xl md:text-7xl text-[#3d2e20] tracking-tight leading-tight font-black">
              {locale === "ar" ? "قارن وافهم.. بكل سهولة" : "Compare & Understand.. Easily"}
            </h1>

            <p className="text-[#3d2e20]/60 text-lg md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed">
              {locale === "ar"
                ? "دليلك الشامل لمقارنة الأنظمة واللوائح السعودية مع القوانين العالمية عبر تقنيات الذكاء الاصطناعي."
                : "Your comprehensive guide to compare Saudi regulations with global laws using AI technologies."}
            </p>
          </div>

          {/* Redesigned Search Bar */}
          <div className="w-full max-w-3xl mb-12 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-150 fill-mode-backwards px-4">
            <div className="relative flex items-center bg-white border border-[#3d2e20]/10 rounded-3xl shadow-2xl p-2 focus-within:ring-4 focus-within:ring-[#3d2e20]/5 transition-all">
              <div className="pl-6 pr-2 text-[#3d2e20]/30 border-r border-[#3d2e20]/10 hidden md:block">
                <Globe className="w-6 h-6" />
              </div>
              <input
                type="text"
                placeholder={locale === "ar" ? "ابحث عن مخالفة، قانون، أو نظام..." : "Search for a violation, law, or regulation..."}
                className="w-full bg-transparent border-none py-5 px-6 text-xl text-[#3d2e20] placeholder-[#3d2e20]/30 focus:outline-none font-bold"
              />
              <button className="bg-[#3d2e20] hover:bg-[#523e2b] text-white px-8 py-5 rounded-2xl transition-all flex items-center gap-2 shadow-lg active:scale-95">
                <Search className="w-6 h-6" />
                <span className="font-black text-lg hidden sm:block">{locale === 'ar' ? 'بحث' : 'Search'}</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-backwards">
            {quickStats.map((stat, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/40 backdrop-blur-sm border border-white p-6 rounded-[2rem]">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#3d2e20] shadow-sm">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-[#3d2e20] leading-none">{stat.value}</div>
                  <div className="text-sm font-bold text-[#3d2e20]/40 uppercase tracking-widest mt-1">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Trending & Categories Combined Section */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-500 fill-mode-backwards">

            {/* Trending Items Layer */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-[#3d2e20]" />
                  <h2 className="text-2xl font-black text-[#3d2e20]">
                    {locale === "ar" ? "الأكثر بحثاً الآن" : "Trending Now"}
                  </h2>
                </div>
                <button className="text-sm font-bold text-[#3d2e20]/60 hover:text-[#3d2e20] transition-colors">
                  {locale === 'ar' ? 'عرض الكل' : 'View All'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {priorityComparisons.length > 0 ? (
                  priorityComparisons.map((comp, index) => (
                    <button
                      key={comp.id}
                      onClick={() => router.push(`/${locale}/laws/${comp.id}`)}
                      className="group flex items-center p-6 bg-white border border-[#3d2e20]/5 rounded-3xl hover:border-[#3d2e20]/20 hover:shadow-xl transition-all duration-300 text-right rtl:text-right ltr:text-left"
                    >
                      <div className={`p-4 rounded-2xl bg-[#3d2e20]/5 text-[#3d2e20] mb-0 mr-0 rtl:ml-4 ltr:mr-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Scale className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <span className="text-[#3d2e20] font-black text-lg block line-clamp-1">
                          {comp.foreign_law?.title || (locale === 'ar' ? 'قانون غير متوفر' : 'Law unavailable')}
                        </span>
                        <span className="text-xs font-bold text-[#3d2e20]/30 uppercase tracking-tighter">
                          {comp.foreign_law?.country || (locale === 'ar' ? 'دولة أجنبية' : 'Foreign country')}
                        </span>
                      </div>
                      {dir === 'rtl' ? <ArrowLeft className="w-5 h-5 opacity-0 group-hover:opacity-40 transition-opacity" /> : <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-40 transition-opacity" />}
                    </button>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center bg-white/50 rounded-3xl border-2 border-dashed border-[#3d2e20]/5">
                    <p className="text-[#3d2e20]/40 font-bold">
                      {locale === 'ar' ? 'لا يوجد مقارنات شائعة حالياً' : 'No trending comparisons available'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar-like Activities */}
            <div className="bg-[#3d2e20] rounded-[2.5rem] p-8 text-white space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

              <h3 className="text-xl font-black flex items-center gap-3">
                <History className="w-5 h-5 opacity-60" />
                {locale === 'ar' ? 'نشاطاتك الأخيرة' : 'Recent Activity'}
              </h3>

              <div className="space-y-6">
                {recentBookmarks.length > 0 ? (
                  recentBookmarks.map((bookmark) => (
                    <div 
                      key={bookmark.id} 
                      onClick={() => bookmark.comparison_id && router.push(`/${locale}/laws/${bookmark.comparison_id}`)}
                      className="flex gap-4 group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-white group-hover:text-[#3d2e20] transition-all">
                        <Bookmark className="w-4 h-4" />
                      </div>
                      <div className="border-b border-white/10 pb-4 flex-1">
                        <div className="font-bold text-sm line-clamp-1">
                          {bookmark.comparison ? 
                            `${bookmark.comparison.foreign_law?.title}` : 
                            (locale === 'ar' ? 'مقارنة محفوظة' : 'Saved comparison')
                          }
                        </div>
                        <div className="text-[10px] uppercase tracking-widest text-white/40 mt-1 font-black">
                          {new Date(bookmark.created_at).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-white/40 font-bold text-sm italic">
                    {locale === 'ar' ? 'لا يوجد نشاطات حالياً' : 'No recent activities'}
                  </div>
                )}
              </div>

              <button
                onClick={() => router.push(`/${locale}/bookmarks`)}
                className="w-full py-4 bg-white/10 rounded-2xl text-sm font-bold border border-white/10 hover:bg-white hover:text-[#3d2e20] transition-all"
              >
                {locale === 'ar' ? 'شاهد كل المحفوظات' : 'View all bookmarks'}
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Spacing for Footer if needed */}
      <div className="h-20" />

      {/* Chatbot Icon - Maintained Linked State */}
      <div className={`fixed bottom-8 ${dir === 'rtl' ? 'left-8' : 'right-8'} z-30 animate-in fade-in zoom-in duration-500 delay-500`}>
        <button
          onClick={() => router.push(`/${locale}/chat`)}
          className="bg-[#3d2e20] hover:bg-[#523e2b] text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center group relative border border-white/10"
        >
          <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className={`absolute bottom-full mb-3 ${dir === 'rtl' ? 'left-0' : 'right-0'} w-max px-3 py-1.5 rounded-lg bg-[#3d2e20] text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg`}>
            {locale === "ar" ? "المساعد" : "Assistant"}
          </span>
        </button>
      </div>
    </main>
  );
}