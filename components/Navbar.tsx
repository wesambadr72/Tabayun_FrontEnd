"use client";
import React, { useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import ar from "../locales/ar/common.json";
import en from "../locales/en/common.json";

const dictionaries = { ar, en };

export default function Navbar() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = (params.locale as string) || "ar";
  const dict = (dictionaries[locale as keyof typeof dictionaries] || ar).navbar;
  
  // الاتجاه يعتمد على اللغة المختارة
  const dir = locale === 'ar' ? 'rtl' : 'ltr'; 

  // فحص هل نحن في الصفحة الرئيسية (قبل تسجيل الدخول)
  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;

  const [isLangOpen, setIsLangOpen] = useState(false);

  const languages = [
    { name: "العربية", code: "ar" },
    { name: "English", code: "en" },
  ];

  const currentLangName = languages.find(l => l.code === locale)?.name || "العربية";

  const handleLangChange = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    router.push(newPath);
    setIsLangOpen(false);
  };

  return (
    <div className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-2 md:px-4" dir={dir}>
      <nav className="flex justify-between items-center w-full max-w-6xl bg-white/10 backdrop-blur-md border border-white/20 px-4 md:px-8 py-2 md:py-3 rounded-full shadow-2xl text-white">
        
        {/* القسم الأيمن (في RTL) / الأيسر (في LTR): تباين والروابط */}
        <div className="flex items-center gap-4 md:gap-12">
          <span className="text-xl md:text-3xl font-black tracking-wider font-bold">{dict.brand}</span>
          <div className="flex items-center gap-4 md:gap-8 text-sm md:text-xl font-bold">
            
            {/* في الهوم بيج تظهر فقط "تواصل"، وفي غيرها تظهر الروابط كاملة */}
            {!isHomePage && (
              <>
                <Link 
                  href={`/${locale}/dashboard`} 
                  className={`hover:opacity-70 transition ${pathname.includes('/dashboard') && !pathname.includes('/categories') ? 'border-b-2 border-white' : ''} pb-0.5 font-bold`}
                >
                  {dict.home}
                </Link>
                <Link 
                  href={`/${locale}/categories`} 
                  className={`hover:opacity-70 transition ${pathname.includes('/categories') ? 'border-b-2 border-white' : ''} font-bold`}
                >
                  {dict.browse}
                </Link>
              </>
            )}
            
            {/* "تواصل" تظهر دائماً في كل الصفحات */}
            <Link 
              href={`/${locale}/contact`} 
              className={`hover:opacity-70 transition ${pathname === `/${locale}/contact` ? 'border-b-2 border-white' : ''} font-bold`}
            >
              {dict.contact}
            </Link>
          </div>
        </div>

        {/* القسم الأيسر (في RTL) / الأيمن (في LTR): اللغة ثم البروفايل */}
        <div className="flex items-center gap-2 md:gap-6">
          
          {/* 1. زر اللغة */}
          <div className="relative">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center justify-center gap-2 h-8 md:h-10 px-3 md:px-4 rounded-full bg-white/10 hover:bg-white/20 transition border border-white/20 group"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9-3-9m-9 9h18"></path>
              </svg>
              <span className="text-xs md:text-sm font-bold">{currentLangName}</span>
            </button>

            {isLangOpen && (
              <div className={`absolute top-full mt-3 ${dir === 'rtl' ? 'left-0' : 'right-0'} w-32 bg-[#1a1510]/95 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2`}>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLangChange(lang.code)}
                    className={`w-full text-center px-4 py-3 text-xs md:text-sm transition-colors border-b border-white/5 last:border-0 hover:bg-white/10 ${locale === lang.code ? 'text-white font-bold' : 'text-white/60'}`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. أيقونة البروفايل - تظهر دائماً */}
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/50 flex items-center justify-center hover:bg-white/20 transition cursor-pointer">
             <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6">
               <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
             </svg>
          </div>

        </div>
      </nav>
    </div>
  );
}