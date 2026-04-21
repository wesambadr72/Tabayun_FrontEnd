"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { lawService } from "@/services/lawService";
import { Category } from "@/types/law";
import {
  Car,
  Utensils,
  ShieldCheck,
  FileCheck,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";

const dictionaries = {
  ar: require("@/locales/ar/common.json"),
  en: require("@/locales/en/common.json")
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "traffic": Car,
  "visa_residency": FileCheck,
  "residency": FileCheck,
  "public_decency": ShieldCheck,
  "labor": Briefcase,
  "food": Utensils,
};

const CATEGORY_MAP: Record<string, string> = {
  "traffic": "traffic",
  "visa_residency": "residency",
  "residency": "residency",
  "public_decency": "publicDecency",
  "labor": "labor",
  "food": "food",
};

export default function CategoriesPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "ar";
  const dict = dictionaries[locale as keyof typeof dictionaries] || dictionaries.ar;
  const dir = locale === "ar" ? "rtl" : "ltr";

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <main className="min-h-screen flex flex-col bg-[#f5f1eb]" dir={dir}>
      <Navbar />

      {/* Clean Header */}
      <div className="w-full pt-32 md:pt-44 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-3xl md:text-6xl font-black text-[#3d2e20]">
            {dict.dashboard.categories || (locale === "ar" ? "تصفح الأقسام" : "Browse Categories")}
          </h1>
          <p className="text-[#3d2e20]/60 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            {locale === "ar"
              ? "استعرض جميع الأنظمة واللوائح المصنفة حسب المجال لتجد ما تبحث عنه بكل سهولة."
              : "Browse all regulations and laws categorized by field to find what you're looking for easily."}
          </p>
        </div>
      </div>

      {/* Grid Section */}
      <div className="flex-grow w-full max-w-6xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#3d2e20] animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-bold">
            {locale === 'ar' ? 'فشل تحميل الأقسام: ' : 'Failed to load categories: '} {error}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20 text-[#3d2e20]/60 font-bold text-xl">
            {locale === 'ar' ? 'لا يوجد أقسام' : 'No categories available'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-backwards">
            {categories.map((cat) => {
              const apiName = cat.name.toLowerCase().replace(/ /g, '_');
              const iconKey = apiName;
              const translationKey = CATEGORY_MAP[apiName] || apiName;
              
              const Icon = CATEGORY_ICONS[iconKey] || Briefcase;
              const translatedName = dict.dashboard.sections?.[translationKey] || cat.name;
              const translatedDesc = dict.dashboard.descriptions?.[translationKey] || cat.description;

              return (    
                <button
                  key={cat.id}
                  onClick={() => router.push(`/${locale}/laws?category=${cat.id}&name=${encodeURIComponent(translatedName)}`)}
                  className="group bg-white p-8 rounded-[2rem] border border-[#3d2e20]/5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 bg-[#f5f1eb] text-[#3d2e20] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#3d2e20] group-hover:text-white transition-colors duration-300">
                    <Icon className="w-8 h-8" strokeWidth={1.5} />
                  </div>

                  <h3 className="text-xl md:text-2xl font-black text-[#3d2e20] mb-3">
                    {translatedName}
                  </h3>

                  <p className="text-[#3d2e20]/60 text-sm md:text-base font-medium leading-relaxed mb-6 flex-grow">
                    {translatedDesc}
                  </p>

                  <div className="flex items-center gap-2 text-[#3d2e20] font-black text-sm">
                    <span>{locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}</span>
                    {dir === 'rtl' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <Footer />

      {/* Chatbot Icon */}
      <div className={`fixed bottom-8 ${dir === 'rtl' ? 'left-8' : 'right-8'} z-40 animate-in fade-in zoom-in duration-500 delay-500`}>
        <button
          onClick={() => router.push(`/${locale}/chat`)}
          className="bg-[#3d2e20] hover:bg-[#523e2b] text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-105 active:scale-95 group relative border border-white/10"
        >
          <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      </div>
    </main>
  );
}