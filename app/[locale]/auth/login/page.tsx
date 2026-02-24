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
  const router = useRouter();
  const locale = (params.locale as string) || "ar";
  const dict = (dictionaries[locale as keyof typeof dictionaries] || ar).auth.login;
  const dir = locale === "ar" ? "rtl" : "ltr";

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.username) {
      newErrors.username = locale === "ar" ? "اسم المستخدم مطلوب" : "Username is required";
    }

    const password = formData.password;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const onlyEnglish = /^[A-Za-z0-9!@#$%^&*(),.?":{}|<>]*$/.test(password);

    if (!password) {
      newErrors.password = locale === "ar" ? "كلمة المرور مطلوبة" : "Password is required";
    } else if (password.length < 8) {
      newErrors.password = locale === "ar" ? "كلمة المرور يجب أن تكون 8 خانات على الأقل" : "Password must be at least 8 characters";
    } else if (!onlyEnglish) {
      newErrors.password = locale === "ar" ? "يجب استخدام حروف إنجليزية فقط" : "Only English letters are allowed";
    } else if (!hasUppercase || !hasLowercase || !hasNumber || !hasSymbol) {
      newErrors.password = locale === "ar" 
        ? "يجب أن تحتوي على حرف كبير، حرف صغير، رقم، ورمز" 
        : "Must include uppercase, lowercase, number, and symbol";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Proceed to login
      router.push(`/${locale}/dashboard`);
    }
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
          <form onSubmit={handleSubmit} className="w-full space-y-6">

            {/* Username Field */}
            <div className="space-y-2 text-start">
              <label className="text-[#3d2e20] font-bold px-2">{dict.username}</label>
              <div className="relative group">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full bg-white border-2 ${errors.username ? 'border-red-500' : 'border-transparent'} focus:border-[#3d2e20]/20 shadow-lg shadow-[#3d2e20]/5 rounded-[1.5rem] px-6 py-4 pl-12 rtl:pl-6 rtl:pr-12 text-lg outline-none transition-all placeholder-[#3d2e20]/30 text-[#3d2e20]`}
                />
                <User className={`w-6 h-6 ${errors.username ? 'text-red-500/50' : 'text-[#3d2e20]/40'} absolute top-1/2 -translate-y-1/2 left-4 rtl:left-auto rtl:right-4 transition-colors group-focus-within:text-[#3d2e20]`} />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm font-bold px-2 animate-in fade-in slide-in-from-top-1 duration-300">
                  {errors.username}
                </p>
              )}
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
                  className={`w-full bg-white border-2 ${errors.password ? 'border-red-500' : 'border-transparent'} focus:border-[#3d2e20]/20 shadow-lg shadow-[#3d2e20]/5 rounded-[1.5rem] px-6 py-4 pl-12 rtl:pl-6 rtl:pr-12 text-lg outline-none transition-all placeholder-[#3d2e20]/30 text-[#3d2e20]`}
                />
                <Lock className={`w-6 h-6 ${errors.password ? 'text-red-500/50' : 'text-[#3d2e20]/40'} absolute top-1/2 -translate-y-1/2 left-4 rtl:left-auto rtl:right-4 transition-colors group-focus-within:text-[#3d2e20]`} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 right-4 rtl:right-auto rtl:left-4 text-[#3d2e20]/40 hover:text-[#3d2e20] transition p-2"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm font-bold px-2 animate-in fade-in slide-in-from-top-1 duration-300">
                  {errors.password}
                </p>
              )}
              <div className="flex justify-end px-2">
                <Link href="#" className="text-sm font-bold text-[#3d2e20]/60 hover:text-[#3d2e20] transition hover:underline">
                  {dict.forgotPassword}
                </Link>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-6">
              <button
                type="submit"
                className="w-full bg-[#3d2e20] text-white py-4 rounded-[1.5rem] text-xl font-bold hover:bg-[#2a1f15] transition shadow-xl shadow-[#3d2e20]/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
              >
                <span>{dict.enter}</span>
                {locale === "ar" ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </button>

              <div className="relative py-4 flex items-center">
                <div className="flex-grow border-t border-[#3d2e20]/10"></div>
                <span className="flex-shrink-0 mx-4 text-[#3d2e20]/40 text-sm font-bold uppercase">أو</span>
                <div className="flex-grow border-t border-[#3d2e20]/10"></div>
              </div>

              <button
                type="button"
                className="w-full bg-white border-2 border-transparent hover:border-[#3d2e20]/10 text-[#3d2e20] py-4 rounded-[1.5rem] text-lg font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition shadow-lg shadow-[#3d2e20]/5 hover:scale-[1.01] active:scale-95"
              >
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
          </form>

        </div>
      </div>

      <Footer />
    </main>
  );
}