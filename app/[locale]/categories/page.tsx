"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// --- استيراد المكونات (Components) ---
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PageShell, SectionHeader, SkeletonCard, StatePanel, StatusBadge, SurfaceCard } from "@/components/ui/tabayun";

// --- استيراد الخدمات والأنواع (Services & Types) ---
import { lawService } from "@/services/lawService";
import { Category } from "@/types/law";

// --- استيراد الأيقونات ---
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Car,
  FileCheck,
  Search,
  ShieldCheck,
  Utensils,
} from "lucide-react";

/**
 * قاموس الترجمة المحلي للصفحة
 * يتم تحميله بناءً على اللغة المختارة (ar/en)
 */
const dictionaries = {
  ar: require("@/locales/ar/common.json"),
  en: require("@/locales/en/common.json")
};

/**
 * ربط أسماء الفئات القادمة من قاعدة البيانات بالأيقونات المناسبة
 */
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "traffic": Car,
  "visa_residency": FileCheck,
  "residency": FileCheck,
  "public_decency": ShieldCheck,
  "labor": Briefcase,
  "food": Utensils,
};

/**
 * خريطة لتحويل أسماء الفئات من API إلى مفاتيح الترجمة في ملفات الـ JSON
 */
const CATEGORY_MAP: Record<string, string> = {
  "traffic": "traffic",
  "visa_residency": "residency",
  "residency": "residency",
  "public_decency": "publicDecency",
  "labor": "labor",
  "food": "food",
};

/**
 * مكون صفحة الأقسام: يعرض جميع فئات الأنظمة المتاحة (مرور، عمل، إقامة، إلخ)
 */
export default function CategoriesPage() {
  // --- خطافات Next.js (Hooks) ---
  const params = useParams();
  const router = useRouter();
  
  // --- إعدادات اللغة والاتجاه ---
  const locale = (params.locale as string) || "ar";
  const dict = dictionaries[locale as keyof typeof dictionaries] || dictionaries.ar;
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  // --- إدارة حالة البيانات (State) ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * جلب الأقسام من الخادم عند تحميل الصفحة
   */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await lawService.getCategories();
        setCategories(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <PageShell dir={dir}>
      <Navbar />

      <section className="tabayun-page-offset pb-16">
        <div className="tabayun-container">
          {/* رأس الصفحة: العنوان والوصف */}
          <SectionHeader
            eyebrow={isAr ? "اختر المجال" : "Choose a domain"}
            icon={<Search className="h-4 w-4" />}
            title={dict.dashboard.categories || (isAr ? "تصفح الأقسام" : "Browse categories")}
            description={
              isAr
                ? "الفئات منظمة حسب ما يحتاجه السائح فعلياً: قيادة، إقامة، سلوك عام، طعام، وعمل."
                : "Categories are organized around real visitor needs: driving, residency, public conduct, food, and work."
            }
            className="mb-12"
          />

          {/* لوحة إرشادية للمستخدم */}
          <SurfaceCard dark className="mb-6 p-5 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-tabayun-gold/18 text-tabayun-gold">
                  <AlertTriangle className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="text-xl font-black">{isAr ? "ابدأ بالفئة ثم اقرأ الخلاصة" : "Start by category, then read the summary"}</h2>
                  <p className="mt-1 text-sm font-semibold leading-relaxed text-tabayun-paper/58">
                    {isAr
                      ? "كل فئة تعرض المقارنات والتنبيهات المهمة حتى تصل للمعلومة بسرعة."
                      : "Each category surfaces comparisons and important warnings so you can find answers quickly."}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge tone="warning" className="border-white/12 bg-white/10 text-tabayun-paper">
                  {isAr ? "معلومة مهمة للسائح" : "Visitor note"}
                </StatusBadge>
              </div>
            </div>
          </SurfaceCard>

          {/* عرض المحتوى بناءً على حالة التحميل */}
          {loading ? (
            // عرض بطاقات الهيكل (Skeleton) أثناء التحميل
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} className="min-h-[220px]" />
              ))}
            </div>
          ) : error ? (
            // عرض رسالة خطأ في حال فشل جلب البيانات
            <StatePanel
              type="error"
              title={isAr ? "تعذر تحميل الأقسام" : "Could not load categories"}
              description={error}
              action={isAr ? "حاول مرة أخرى" : "Try again"}
              onAction={() => window.location.reload()}
              locale={locale}
            />
          ) : categories.length === 0 ? (
            // عرض حالة "لا توجد بيانات"
            <StatePanel
              title={isAr ? "لا توجد أقسام بعد" : "No categories yet"}
              description={isAr ? "عند إضافة الأنظمة ستظهر الأقسام هنا بشكل منظم." : "Once regulations are added, categories will appear here."}
              locale={locale}
            />
          ) : (
            // عرض شبكة الأقسام (Categories Grid)
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat) => {
                // معالجة بيانات الفئة للترجمة والأيقونات
                const apiName = cat.name.toLowerCase().replace(/ /g, "_");
                const translationKey = CATEGORY_MAP[apiName] || apiName;
                const Icon = CATEGORY_ICONS[apiName] || Briefcase;
                const translatedName = dict.dashboard.sections?.[translationKey] || cat.name;
                const translatedDesc = dict.dashboard.descriptions?.[translationKey] || cat.description;

                return (
                  <button
                    key={cat.id}
                    onClick={() => router.push(`/${locale}/laws?category=${cat.id}&name=${encodeURIComponent(translatedName)}`)}
                    className="group rounded-[30px] border border-tabayun-sand bg-tabayun-pearl p-6 text-start shadow-[0_14px_36px_rgba(44,22,15,0.07)] transition duration-300 hover:-translate-y-1 hover:border-tabayun-gold/60 hover:shadow-[0_26px_70px_rgba(44,22,15,0.14)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-tabayun-gold/25"
                  >
                    <div className="mb-7 flex items-start justify-between gap-4">
                      {/* أيقونة الفئة */}
                      <span className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-tabayun-sand/52 text-tabayun-coffee transition group-hover:bg-tabayun-coffee group-hover:text-tabayun-paper">
                        <Icon className="h-8 w-8" strokeWidth={1.6} />
                      </span>
                      <StatusBadge tone="neutral">{isAr ? "فئة قانونية" : "Legal domain"}</StatusBadge>
                    </div>

                    {/* تفاصيل الفئة */}
                    <h3 className="text-2xl font-black text-tabayun-coffee">{translatedName}</h3>
                    <p className="mt-3 min-h-[54px] text-sm font-semibold leading-relaxed text-tabayun-coffee/58">
                      {translatedDesc}
                    </p>

                    {/* زر الانتقال */}
                    <div className="mt-7 flex items-center justify-between border-t border-tabayun-sand/70 pt-4">
                      <span className="text-sm font-black text-tabayun-clay">{isAr ? "عرض المقارنات" : "View comparisons"}</span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-tabayun-sand/52 text-tabayun-coffee transition group-hover:bg-tabayun-coffee group-hover:text-tabayun-paper">
                        {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </PageShell>
  );
}
