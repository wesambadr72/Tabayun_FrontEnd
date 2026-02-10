"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import ar from "../../../../locales/ar/common.json";
import en from "../../../../locales/en/common.json";

const dictionaries = { ar, en };

export default function LoginPage() {
  const params = useParams();
  const locale = (params.locale as string) || "ar";
  const dict = (dictionaries[locale as keyof typeof dictionaries] || ar).auth.login;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center p-4" dir={dir}>
      {/* الخلفية الموحدة للموقع */}
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

      {/* بطاقة تسجيل الدخول البيضاء */}
      <div className="relative z-20 w-full max-w-md bg-white rounded-[40px] p-10 shadow-2xl flex flex-col items-center">
        <h2 className="text-4xl font-bold text-[#4a3a2a] mb-10 font-bold">{dict.title}</h2>

        <div className="w-full space-y-6">
          {/* حقل اسم المستخدم */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 font-regular">{dict.username}</label>
            <input 
              type="text" 
              className="w-full border-2 border-[#4a3a2a] rounded-2xl p-3 focus:outline-none text-gray-800 font-regular"
            />
          </div>

          {/* حقل كلمة المرور */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 font-regular">{dict.password}</label>
            <input 
              type="password" 
              className="w-full border-2 border-[#4a3a2a] rounded-2xl p-3 focus:outline-none text-gray-800 font-regular"
            />
            <div className={`text-${dir === 'rtl' ? 'left' : 'right'} mt-2`}>
              <a href="#" className="text-sm font-bold underline text-gray-800 hover:text-black font-regular">{dict.forgotPassword}</a>
            </div>
          </div>

          {/* أزرار العمليات */}
          <div className="space-y-4 pt-4">
            {/* زر الدخول - نسوي فالديشن لها مستقبلاً */}
            <Link href={`/${locale}/dashboard`} className="w-full">
              <button className="w-full bg-[#3d2e20] text-white py-4 rounded-2xl text-xl font-bold hover:opacity-90 transition shadow-md">
                {dict.enter}
              </button>
            </Link>

            {/* زر إنشاء حساب - مربوط بصفحة التسجيل */}
            <Link href={`/${locale}/auth/register`} className="block w-full">
              <button className="w-full bg-[#e1c6a6] text-[#3d2e20] py-4 rounded-2xl text-xl font-bold hover:opacity-90 transition shadow-md font-bold">
                {dict.createAccount}
              </button>
            </Link>
            
            {/* زر الدخول عبر قوقل */}
            <button className="w-full border-2 border-[#3d2e20] text-[#3d2e20] py-3 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
              {dict.google}
            </button>
          </div>
        </div>
      </div>

      {/* حقوق الملكية في الأسفل */}
      <div className="relative z-20 mt-6 text-white/80 text-sm font-medium">
         {dict.rights}
      </div>
    </main>
  );
}