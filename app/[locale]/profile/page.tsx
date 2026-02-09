"use client";
import React from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import ar from "@/locales/ar/common.json";
import en from "@/locales/en/common.json";

const dictionaries = { ar, en };

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "ar";
  
  // الوصول للترجمات مع التأكد من المسار الصحيح
  const commonDict = dictionaries[locale as keyof typeof dictionaries] || ar;
  
  // في ملف common.json، البروفايل موجود داخل auth.profile
  const profileDict = commonDict.auth?.profile || {};
  
  const dir = locale === "ar" ? "rtl" : "ltr";

  // قائمة العناصر كما تظهر في الصورة
  const profileItems = [
    { label: profileDict.country || (locale === 'ar' ? 'الدولة' : 'Country'), value: profileDict.germany || (locale === 'ar' ? 'ألمانيا' : 'Germany') },
    { label: profileDict.language || (locale === 'ar' ? 'اللغة' : 'Language'), value: profileDict.arabic || (locale === 'ar' ? 'عربي' : 'Arabic') },
    { label: profileDict.favorites || (locale === 'ar' ? 'المفضلة' : 'Favorites'), value: profileDict.lawsCount || (locale === 'ar' ? '7 قوانين' : '7 Laws') },
    { label: profileDict.name || (locale === 'ar' ? 'الاسم' : 'Name'), value: profileDict.userName || (locale === 'ar' ? 'فيصل' : 'Faisal') },
    { label: profileDict.email || (locale === 'ar' ? 'البريد الالكتروني' : 'Email'), value: profileDict.userEmail || 'user@gmail.com' },
  ];

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center overflow-hidden" dir={dir}>
      {/* طبقة الصورة الخلفية (نفس الهوم بيج) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10" /> 
        <Image 
          src="/image/saudi.png" 
          alt="Background" 
          fill 
          className="object-cover" 
          priority 
        />
      </div>

      <Navbar />

      <div className="relative z-10 w-full max-w-lg mx-auto px-8 pt-32 pb-12 flex flex-col items-center min-h-[90vh]">
        {/* العنوان - تباين (محاذاة حسب الاتجاه) */}
        <div className="w-full flex justify-start mb-4">
          <h1 className="text-5xl font-bold text-white font-bold">
            {commonDict.navbar.brand}
          </h1>
        </div>

        {/* صورة الملف الشخصي */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white/20 flex items-center justify-center mb-3 backdrop-blur-sm">
            <Image
              src="/image/profile.svg"
              alt="Profile"
              width={100}
              height={100}
              className="opacity-90 object-contain p-2 invert"
            />
          </div>
          <button className="text-white font-bold text-xl hover:opacity-70 transition font-bold">
            {profileDict.changePhoto || "تغيير الصورة"}
          </button>
        </div>

        {/* قائمة المعلومات */}
        <div className="w-full space-y-8 mt-4">
          {profileItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between group cursor-pointer">
              {/* التسمية والأيقونة (تظهر أولاً في الـ DOM لتكون في الجهة الصحيحة حسب الـ dir) */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-white font-bold">
                  {item.label}
                </span>
                {locale === "ar" ? (
                  <ChevronLeft className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                )}
              </div>

              {/* القيمة (تظهر ثانياً) */}
              <span className="text-2xl text-white/60 font-regular">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* زر تسجيل الخروج */}
        <div className="mt-auto pt-16 w-full flex justify-center">
          <button 
            onClick={() => router.push(`/${locale}`)}
            className="text-red-400 text-3xl font-bold hover:scale-105 transition-transform font-bold"
          >
            {profileDict.logout || "تسجيل الخروج"}
          </button>
        </div>
      </div>
    </main>
  );
}
