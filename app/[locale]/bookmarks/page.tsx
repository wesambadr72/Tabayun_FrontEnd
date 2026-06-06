"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { lawService } from "@/services/lawService";
import { Bookmark as BookmarkType } from "@/types/law";
import { LawCard } from "@/components/LawCard";
import { Bookmark, Loader2 } from "lucide-react";
import { PageShell, SectionHeader, SkeletonCard, StatePanel, StatusBadge } from "@/components/ui/tabayun";

export default function BookmarksPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "ar";
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

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
    <PageShell dir={dir}>
      <Navbar />

      <section className="tabayun-page-offset pb-16">
        <div className="tabayun-container">
          <SectionHeader
            eyebrow={isAr ? "مكتبتك القانونية" : "Your legal library"}
            icon={<Bookmark className="h-4 w-4" />}
            title={isAr ? "المحفوظات" : "Saved comparisons"}
            description={isAr ? "احتفظ بالمقارنات والتنبيهات التي قد تحتاجها أثناء التنقل داخل السعودية." : "Keep comparisons and alerts you may need while moving around Saudi Arabia."}
            className="mb-10"
          />

          {loading ? (
            <div className="grid gap-5 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonCard key={index} className="min-h-[240px]" />
              ))}
            </div>
          ) : error ? (
            <StatePanel
              type="error"
              title={isAr ? "فشل تحميل المحفوظات" : "Could not load saves"}
              description={error}
              locale={locale}
            />
          ) : bookmarks.length > 0 ? (
            <>
              <div className="mb-5">
                <StatusBadge tone="neutral">
                  {isAr ? `${bookmarks.length} عنصر محفوظ` : `${bookmarks.length} saved items`}
                </StatusBadge>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {bookmarks.map((bookmark) => (
                  <div key={bookmark.id}>
                    {bookmark.comparison && <LawCard comparison={bookmark.comparison} locale={locale} />}
                    {!bookmark.comparison && bookmark.law && (
                      <div className="rounded-[30px] border border-tabayun-sand bg-tabayun-pearl p-6">
                        <h3 className="text-2xl font-black text-tabayun-coffee">{bookmark.law.title}</h3>
                        <p className="mt-3 text-sm font-semibold leading-relaxed text-tabayun-coffee/58">{bookmark.law.simplified_text}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <StatePanel
              title={isAr ? "لا توجد محفوظات بعد" : "No saved items yet"}
              description={isAr ? "احفظ أي مقارنة مهمة لتجدها هنا بسرعة عند الحاجة." : "Save important comparisons so you can find them quickly when needed."}
              action={isAr ? "تصفح القوانين" : "Browse laws"}
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
