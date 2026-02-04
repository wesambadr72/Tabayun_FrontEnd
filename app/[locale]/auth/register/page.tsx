"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import ar from "../../../../locales/ar/common.json";
import en from "../../../../locales/en/common.json";

const dictionaries = { ar, en };

export default function RegisterPage() {
  const params = useParams();
  const locale = (params.locale as string) || "ar";
  const dict = (dictionaries[locale as keyof typeof dictionaries] || ar).auth.register;
  const dir = locale === "ar" ? "rtl" : "ltr";

  const [step, setStep] = useState(1);

  const countries = [
    { name: locale === "ar" ? "ألمانيا" : "Germany", flag: "🇩🇪" },
    { name: locale === "ar" ? "المملكة المتحدة" : "United Kingdom", flag: "🇬🇧" },
    { name: locale === "ar" ? "الولايات المتحدة" : "USA", flag: "🇺🇸" },
    { name: locale === "ar" ? "إندونيسيا" : "Indonesia", flag: "🇮🇩" },
    { name: locale === "ar" ? "إسبانيا" : "Spain", flag: "🇪🇸" },
    { name: locale === "ar" ? "إيطاليا" : "Italy", flag: "🇮🇹" },
    { name: locale === "ar" ? "الهند" : "India", flag: "🇮🇳" },
    { name: locale === "ar" ? "الصين" : "China", flag: "🇨🇳" },
  ];

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center p-4" dir={dir}>
      {/* الخلفية */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <Image src="/image/saudi.png" alt="Background" fill className="object-cover" priority />
      </div>

      <div className="relative z-20 w-full max-w-3xl flex flex-col items-center text-center px-4">
        
        {/* الترحيب وشريط التقدم */}
        {step !== 5 && (
          <div className="flex flex-col items-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-2 drop-shadow-lg">{dict.welcome}</h1>
            <p className="text-white text-sm sm:text-base md:text-xl font-medium mb-8 opacity-90">{dict.needInfo}</p>
            
            <div className="flex gap-1 md:gap-2 mb-10 md:mb-16 justify-center" dir="ltr">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-2 md:h-3 w-12 sm:w-16 md:w-20 rounded-full border border-white/30 transition-all duration-500 ${i <= step ? 'bg-[#3d2e20]' : 'bg-white/20'}`} />
              ))}
            </div>
          </div>
        )}

        {/* المحتوى */}
        <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">
          
          {step === 1 && (
            <div className="w-full flex flex-col items-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">{dict.emailQuestion}</h2>
              <input type="email" placeholder={dict.emailPlaceholder} className="w-full max-w-md bg-white border-2 border-[#3d2e20] rounded-2xl py-4 px-6 text-xl text-center shadow-xl focus:outline-none" />
            </div>
          )}

          {step === 2 && (
            <div className="w-full flex flex-col items-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">{dict.nameQuestion}</h2>
              <input type="text" placeholder={dict.namePlaceholder} className="w-full max-w-md bg-white border-2 border-[#3d2e20] rounded-2xl py-4 px-6 text-xl text-center shadow-xl focus:outline-none" />
            </div>
          )}

          {step === 3 && (
            <div className="w-full flex flex-col items-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">{dict.passwordQuestion}</h2>
              <input type="password" placeholder={dict.passwordPlaceholder} className="w-full max-w-md bg-white border-2 border-[#3d2e20] rounded-2xl py-4 px-6 text-xl text-center shadow-xl focus:outline-none" />
              <p className="text-white/90 text-sm md:text-base leading-relaxed mt-4 text-center max-w-md">
                {dict.passwordHint}
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="w-full flex flex-col items-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">{dict.repeatPasswordQuestion}</h2>
              <input type="password" placeholder={dict.repeatPasswordPlaceholder} className="w-full max-w-md bg-white border-2 border-[#3d2e20] rounded-2xl py-4 px-6 text-xl text-center shadow-xl focus:outline-none" />
            </div>
          )}

          {step === 5 && (
            <div className="w-full flex flex-col items-center py-6">
              <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-10 text-center">
                {dict.compareQuestion}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                {countries.map((country, index) => (
                  <button key={index} className="bg-[#3d2e20] hover:bg-[#4d3e30] text-white p-6 rounded-2xl flex flex-col items-center gap-3 transition-transform hover:scale-105 shadow-xl">
                    <span className="text-3xl">{country.flag}</span>
                    <span className="text-lg font-bold">{country.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* أزرار التحكم */}
        <div className={`w-full max-w-md flex justify-between items-center gap-6 mt-12 md:mt-20 ${dir === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
          <button 
            onClick={() => step === 1 ? window.location.href=`/${locale}/auth/login` : setStep(step - 1)}
            className="flex-1 bg-white text-[#3d2e20] border-2 border-[#3d2e20] py-3 rounded-full text-xl md:text-2xl font-bold hover:bg-gray-100 transition shadow-lg"
          >
            {step === 1 ? dict.exit : dict.back}
          </button>
          
          <button 
            onClick={() => step < 5 ? setStep(step + 1) : alert("Done!")}
            className="flex-1 bg-[#3d2e20] text-white py-3 rounded-full text-xl md:text-2xl font-bold hover:opacity-90 transition shadow-lg"
          >
            {step === 4 ? dict.welcomeBtn : step === 5 ? dict.confirm : dict.next}
          </button>
        </div>

      </div>
    </main>
  );
}