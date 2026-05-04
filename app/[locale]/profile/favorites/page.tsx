"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { lawService } from "@/services/lawService";
import { Bookmark, Comparison } from "@/types/law";
import { LawCard } from "@/components/LawCard";
import { PageShell, SectionHeader, SkeletonCard, StatePanel, StatusBadge } from "@/components/ui/tabayun";

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
    <PageShell dir={dir}>
      <Navbar />

      <section className="tabayun-page-offset pb-16">
        <div className="tabayun-container">
          <SectionHeader
            eyebrow={isAr ? "المفضلة" : "Favorites"}
            icon={<Heart className="h-4 w-4" />}
            title={isAr ? "العناصر المفضلة" : "Favorite items"}
            description={isAr ? "قائمة القوانين والمقارنات التي اخترت الرجوع لها لاحقاً." : "Laws and comparisons you chose to revisit later."}
            className="mb-10"
          />

          {loading ? (
            <div className="grid gap-5 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonCard key={index} className="min-h-[240px]" />
              ))}
            </div>
          ) : bookmarks.length === 0 ? (
            <StatePanel
              title={isAr ? "لا توجد عناصر مفضلة" : "No favorites yet"}
              description={isAr ? "لم تقم بحفظ أي قوانين أو مقارنات حتى الآن." : "You have not saved any laws or comparisons yet."}
              action={isAr ? "تصفح الفئات" : "Browse categories"}
              onAction={() => router.push(`/${locale}/categories`)}
              locale={locale}
            />
          ) : (
            <>
              <div className="mb-5">
                <StatusBadge tone="neutral">
                  {isAr ? `${bookmarks.length} عنصر` : `${bookmarks.length} items`}
                </StatusBadge>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {bookmarks.map((bookmark) => {
                  const comp = bookmark.comparison;
                  if (comp) return <LawCard key={`bookmark-comp-${bookmark.id}`} comparison={comp} locale={locale} />;
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
            </>
          )}
        </div>
      </section>

      <Footer />
    </PageShell>
  );
}
