"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ar from "../../../../locales/ar/common.json";
import en from "../../../../locales/en/common.json";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";

const dictionaries = { ar, en };

export default function LoginPage() {
  const params = useParams();
  const locale = (params.locale as string) || "ar";
  const dict = (dictionaries[locale as keyof typeof dictionaries] || ar).auth.login;
  const dir = locale === "ar" ? "rtl" : "ltr";

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-[#f5f1eb] overflow-x-hidden" dir={dir}>
      {/* Navbar Wrapper */}
      <div className="fixed top-0 w-full z-50 flex justify-center py-4 bg-transparent pointer-events-none">
        <div className="pointer-events-auto w-full max-w-6xl px-4">
          <Navbar />
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full mt-32 mb-10 flex-grow flex flex-col items-center justify-center px-4 md:px-6 relative overflow-hidden">

        {/* Background Elements - Subtle */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#3d2e20]/5 rounded-full blur-[100px] pointer-events-none hidden md:block" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[#d4c5b5]/40 rounded-full blur-[100px] pointer-events-none hidden md:block" />

        <div className="relative z-10 w-full max-w-lg flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-700">

          {/* Header */}
          <div className="space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-[#3d2e20] tracking-tight">{dict.title}</h1>
            <p className="text-[#3d2e20]/60 text-lg font-medium">مرحباً بعودتك إلى تباين</p>
          </div>

          {/* Form */}
          <div className="w-full space-y-6">

            {/* Username Field */}
            <div className="space-y-2 text-start">
              <label className="text-[#3d2e20] font-bold px-2">{dict.username}</label>
              <div className="relative group">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-white border-2 border-transparent focus:border-[#3d2e20]/20 shadow-lg shadow-[#3d2e20]/5 rounded-[1.5rem] px-6 py-4 pl-12 rtl:pl-6 rtl:pr-12 text-lg outline-none transition-all placeholder-[#3d2e20]/30 text-[#3d2e20]"
                />
                <User className="w-6 h-6 text-[#3d2e20]/40 absolute top-1/2 -translate-y-1/2 left-4 rtl:left-auto rtl:right-4 transition-colors group-focus-within:text-[#3d2e20]" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2 text-start">
              <label className="text-[#3d2e20] font-bold px-2">{dict.password}</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white border-2 border-transparent focus:border-[#3d2e20]/20 shadow-lg shadow-[#3d2e20]/5 rounded-[1.5rem] px-6 py-4 pl-12 rtl:pl-6 rtl:pr-12 text-lg outline-none transition-all placeholder-[#3d2e20]/30 text-[#3d2e20]"
                />
                <Lock className="w-6 h-6 text-[#3d2e20]/40 absolute top-1/2 -translate-y-1/2 left-4 rtl:left-auto rtl:right-4 transition-colors group-focus-within:text-[#3d2e20]" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 right-4 rtl:right-auto rtl:left-4 text-[#3d2e20]/40 hover:text-[#3d2e20] transition p-2"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex justify-end px-2">
                <Link href="#" className="text-sm font-bold text-[#3d2e20]/60 hover:text-[#3d2e20] transition hover:underline">
                  {dict.forgotPassword}
                </Link>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-6">
              <Link href={`/${locale}/dashboard`} className="block w-full">
                <button className="w-full bg-[#3d2e20] text-white py-4 rounded-[1.5rem] text-xl font-bold hover:bg-[#2a1f15] transition shadow-xl shadow-[#3d2e20]/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
                  <span>{dict.enter}</span>
                  {locale === "ar" ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                </button>
              </Link>

              <div className="relative py-4 flex items-center">
                <div className="flex-grow border-t border-[#3d2e20]/10"></div>
                <span className="flex-shrink-0 mx-4 text-[#3d2e20]/40 text-sm font-bold uppercase">أو</span>
                <div className="flex-grow border-t border-[#3d2e20]/10"></div>
              </div>

              <button className="w-full bg-white border-2 border-transparent hover:border-[#3d2e20]/10 text-[#3d2e20] py-4 rounded-[1.5rem] text-lg font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition shadow-lg shadow-[#3d2e20]/5 hover:scale-[1.01] active:scale-95">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                {dict.google}
              </button>

              <div className="pt-6 text-center">
                <p className="text-[#3d2e20]/60 font-medium">
                  ليس لديك حساب؟ {' '}
                  <Link href={`/${locale}/auth/register`} className="text-[#3d2e20] font-bold hover:underline">
                    {dict.createAccount}
                  </Link>
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}