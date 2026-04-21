"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import { lawService } from "@/services/lawService";
import { Bookmark, Comparison } from "@/types/law";
import { LawCard } from "@/components/LawCard";

export default function FavoritesPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "ar";
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await lawService.getMyBookmarks();
        setBookmarks(data || []);
      } catch (err) {
        console.error("Failed to fetch bookmarks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center overflow-x-hidden bg-[#f5f1eb]" dir={dir}>
      <Navbar />
      <div className="relative z-20 w-full flex flex-col items-center pt-40 md:pt-48 pb-20 px-4 max-w-7xl">
        <button 
          onClick={() => router.back()}
          className="self-start flex items-center gap-2 text-[#3d2e20]/60 hover:text-[#3d2e20] mb-8 transition-colors"
        >
          {isAr ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          <span className="font-medium">{isAr ? "العودة" : "Back"}</span>
        </button>

        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full">
          <h1 className="text-4xl md:text-5xl font-black text-[#3d2e20] mb-4 tracking-tight">
            {isAr ? "المفضلة" : "Favorites"}
          </h1>
          <p className="text-[#3d2e20]/60 text-lg font-regular">
            {isAr ? "قائمة القوانين والمقارنات المحفوظة" : "List of saved laws and comparisons"}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#3d2e20] animate-spin" />
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-12 duration-700">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md mb-6">
              <svg className="w-10 h-10 text-[#3d2e20]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#3d2e20] mb-2">
              {isAr ? "لا توجد عناصر مفضلة" : "No favorites yet"}
            </h3>
            <p className="text-[#3d2e20]/60 text-lg max-w-sm">
              {isAr ? "لم تقم بحفظ أي قوانين أو مقارنات إلى مفضلتك حتى الآن." : "You haven't saved any laws or comparisons to your favorites yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-in fade-in slide-in-from-bottom-12 duration-700">
            {bookmarks.map((bookmark) => {

              const comp = bookmark.comparison;
              if (comp) {
                return <LawCard key={`bookmark-comp-${bookmark.id}`} comparison={comp} locale={locale} />;
              }
              if (bookmark.law) {
                const lawAsComp: Comparison = {
                  id: bookmark.law.id,
                  title: bookmark.law.title,
                  simplified_description: bookmark.law.simplified_description || bookmark.law.title,
                  category_id: bookmark.law.category_id,
                };
                return <LawCard key={`bookmark-law-${bookmark.id}`} comparison={lawAsComp} locale={locale} />;
              }
              return null;
            })}
          </div>
        )}
      </div>
    </main>
  );
}
