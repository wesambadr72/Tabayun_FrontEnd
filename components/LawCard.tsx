import React from "react";
import Link from "next/link";

// --- استيراد الأيقونات ---
import { AlertTriangle, ArrowLeft, ArrowRight, Bookmark, Scale } from "lucide-react";

// --- استيراد الأنواع والمكونات المشتركة ---
import { Comparison } from "@/types/law";
import { StatusBadge } from "@/components/ui/tabayun";

/**
 * واجهة خصائص مكون بطاقة القانون
 */
interface LawCardProps {
  comparison: Comparison; // بيانات المقارنة القانونية
  locale: string;         // اللغة الحالية (ar/en)
  compact?: boolean;      // هل يتم عرض البطاقة بشكل مضغوط (للصفحات الجانبية مثلاً)
}

/**
 * مكون بطاقة القانون (Law Card):
 * يعرض ملخص للمقارنة القانونية بين النظام السعودي ودولة أخرى.
 * يستخدم في صفحة النتائج، المفضلة، والصفحة الرئيسية.
 */
export const LawCard = ({ comparison, locale, compact = false }: LawCardProps) => {
  const isAr = locale === "ar";
  
  // تجهيز العنوان (يستخدم العنوان الأساسي أو عنوان القانون الأجنبي كبديل)
  const title = comparison.title || comparison.foreign_law?.title || (isAr ? "مقارنة قانونية" : "Legal comparison");
  
  // تجهيز الوصف المختصر
  const description =
    comparison.simplified_description ||
    comparison.summary ||
    comparison.foreign_law?.simplified_description ||
    comparison.foreign_law?.simplified_text ||
    (isAr ? "اطلع على الفرق بين النظام السعودي والنظام المقارن." : "Review the difference between Saudi regulation and the comparison country.");

  return (
    <Link
      href={`/${locale}/laws/${comparison.id}`}
      className="group block rounded-[30px] border border-tabayun-sand bg-tabayun-pearl p-5 shadow-[0_14px_36px_rgba(44,22,15,0.07)] transition duration-300 hover:-translate-y-1 hover:border-tabayun-gold/50 hover:shadow-[0_26px_70px_rgba(44,22,15,0.14)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-tabayun-gold/25"
    >
      <div className="flex h-full flex-col gap-5">
        {/* الجزء العلوي: الأيقونة، الشارات، وزر المفضلة */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-tabayun-coffee text-tabayun-paper shadow-[0_12px_28px_rgba(44,22,15,0.2)]">
              <Scale className="h-5 w-5" />
            </span>
            <div className="flex flex-wrap gap-2">
              <StatusBadge tone="warning">
                <AlertTriangle className="h-3 w-3" />
                {isAr ? "تحقق من التفاصيل" : "Check details"}
              </StatusBadge>
              {comparison.foreign_law?.country && (
                <StatusBadge tone="neutral">{comparison.foreign_law.country}</StatusBadge>
              )}
            </div>
          </div>
          <Bookmark className="h-5 w-5 text-tabayun-coffee/24 transition group-hover:text-tabayun-coffee" />
        </div>

        {/* محتوى البطاقة: العنوان والوصف */}
        <div className="space-y-3">
          <h3 className={`${compact ? "text-xl" : "text-2xl md:text-3xl"} text-balance font-black leading-tight text-tabayun-coffee`}>
            {title}
          </h3>
          <p className={`${compact ? "text-sm" : "text-base"} line-clamp-3 font-semibold leading-relaxed text-tabayun-coffee/58`}>
            {description}
          </p>
        </div>

        {/* الجزء السفلي: رابط الانتقال */}
        <div className="mt-auto flex items-center justify-between border-t border-tabayun-sand/70 pt-4">
          <span className="text-sm font-black text-tabayun-clay">
            {isAr ? "عرض المقارنة" : "View comparison"}
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-tabayun-sand/52 text-tabayun-coffee transition group-hover:bg-tabayun-coffee group-hover:text-tabayun-paper">
            {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          </span>
        </div>
      </div>
    </Link>
  );
};
