"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { lawService } from "@/services/lawService";
import { Bookmark as BookmarkType } from "@/types/law";
import { LawCard } from "@/components/LawCard";
import { Bookmark, ArrowRight, ArrowLeft, Trash2, Loader2 } from "lucide-react";

export default function BookmarksPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "ar";
  const dir = locale === "ar" ? "rtl" : "ltr";

  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        const data = await lawService.getMyBookmarks();
        setBookmarks(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center overflow-x-hidden bg-[#f5f1eb]" dir={dir}>
      <Navbar />

      <div className="relative z-20 w-full flex flex-col items-center pt-32 md:pt-40 pb-20 px-4">

        {/* Header Section */}
        <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="mx-auto w-20 h-20 bg-[#3d2e20]/5 rounded-full flex items-center justify-center mb-6">
            <Bookmark className="w-10 h-10 text-[#3d2e20]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#3d2e20]">
            {locale === "ar" ? "قوانيني المحفوظة" : "My Saved Laws"}
          </h1>
          <p className="text-[#3d2e20]/60 text-lg font-medium">
            {locale === "ar" ? "احتفظ بالأنظمة التي تهمك للرجوع إليها سريعاً" : "Keep the regulations that matter to you for quick reference"}
          </p>
        </div>

        {/* Content Section */}
        <div className="w-full max-w-5xl">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 text-[#3d2e20] animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500 font-bold">
              {locale === 'ar' ? 'فشل تحميل المحفوظات: ' : 'Failed to load bookmarks: '} {error}
            </div>
          ) : bookmarks.length > 0 ? (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              {bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="relative group">
                  {bookmark.comparison && <LawCard comparison={bookmark.comparison} locale={locale} />}
                  {!bookmark.comparison && bookmark.law && (
                    /* Fallback for single law bookmarks if any */
                    <div className="bg-white p-6 rounded-2xl border border-[#3d2e20]/10">
                      <h3 className="text-xl font-bold">{bookmark.law.title}</h3>
                      <p>{bookmark.law.simplified_text}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="w-full bg-white border border-[#3d2e20]/10 rounded-[2.5rem] p-12 shadow-xl shadow-[#3d2e20]/5 flex flex-col items-center animate-in fade-in slide-in-from-bottom-12 duration-700 delay-150 fill-mode-backwards">
              <div className="w-32 h-32 text-[#3d2e20]/10 mb-8">
                <Bookmark className="w-full h-full" strokeWidth={0.5} />
              </div>
              <p className="text-[#3d2e20]/40 text-2xl font-bold mb-8">
                {locale === "ar" ? "لا يوجد محفوظات" : "No bookmarks"}
              </p>
              <button
                onClick={() => router.push(`/${locale}/categories`)}
                className="px-10 py-4 bg-[#3d2e20] text-white rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#3d2e20]/20 flex items-center gap-3"
              >
                <span>{locale === "ar" ? "تصفح القوانين" : "Browse Laws"}</span>
                {locale === "ar" ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
