"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import ar from "../../../../locales/ar/common.json";
import en from "../../../../locales/en/common.json";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

const dictionaries = { ar, en };

export default function LoginPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "ar";
  const dict = (dictionaries[locale as keyof typeof dictionaries] || ar).auth.login;
  const dir = locale === "ar" ? "rtl" : "ltr";

  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  React.useEffect(() => {
    setMounted(true);
  }, []);

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
    if (!password) {
      newErrors.password = locale === "ar" ? "كلمة المرور مطلوبة" : "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        setLoading(true);
        const data = new FormData();
        data.append('username', formData.username);
        data.append('password', formData.password);
        
        const response = await authService.login(data);
        authService.setToken(response.access_token);
        
        // Fetch and store user profile after login using the new /me endpoint
        await authService.getMe();
        
        router.push(`/${locale}/dashboard`);
      } catch (err: any) {
        setErrors({ general: err.message });
      } finally {
        setLoading(false);
      }
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
          {!mounted ? (
            <div className="w-full h-96 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-[#3d2e20]/20" />
              <p className="text-[#3d2e20]/20 font-bold uppercase tracking-widest text-xs animate-pulse">
                {locale === 'ar' ? 'جاري التحميل...' : 'Loading Tabayun...'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              {errors.general && (
                <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-bold border border-red-100 animate-in fade-in zoom-in duration-300">
                  {errors.general}
                </div>
              )}
              {/* Username Field */}
              <div className="space-y-2 text-start">
                <label className="text-[#3d2e20] font-bold px-2">{dict.username}</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 start-0 ps-5 flex items-center pointer-events-none text-[#3d2e20]/30 group-focus-within:text-[#3d2e20] transition-colors">
                    <User className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder={locale === 'ar' ? 'أدخل اسم المستخدم' : 'Enter username'}
                    className={`w-full bg-white border-2 ${errors.username ? 'border-red-200' : 'border-[#3d2e20]/5'} rounded-[1.5rem] py-5 ps-14 pe-6 text-[#3d2e20] font-bold placeholder:text-[#3d2e20]/20 focus:outline-none focus:border-[#3d2e20] focus:ring-4 focus:ring-[#3d2e20]/5 transition-all shadow-sm`}
                    suppressHydrationWarning
                  />
                </div>
                {errors.username && <p className="text-red-500 text-xs font-bold px-4 mt-1">{errors.username}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-2 text-start">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[#3d2e20] font-bold">{dict.password}</label>
                  <Link href="#" className="text-sm font-black text-[#3d2e20]/40 hover:text-[#3d2e20] transition-colors tracking-tight uppercase">
                    {dict.forgotPassword}
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 start-0 ps-5 flex items-center pointer-events-none text-[#3d2e20]/30 group-focus-within:text-[#3d2e20] transition-colors">
                    <Lock className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full bg-white border-2 ${errors.password ? 'border-red-200' : 'border-[#3d2e20]/5'} rounded-[1.5rem] py-5 ps-14 pe-14 text-[#3d2e20] font-bold placeholder:text-[#3d2e20]/20 focus:outline-none focus:border-[#3d2e20] focus:ring-4 focus:ring-[#3d2e20]/5 transition-all shadow-sm`}
                    suppressHydrationWarning
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 end-0 pe-5 flex items-center text-[#3d2e20]/20 hover:text-[#3d2e20] transition-colors"
                    suppressHydrationWarning
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" strokeWidth={2.5} /> : <Eye className="w-5 h-5" strokeWidth={2.5} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs font-bold px-4 mt-1">{errors.password}</p>}
              </div>

              {/* Actions */}
              <div className="space-y-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#3d2e20] hover:bg-[#523e2b] text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-[#3d2e20]/20 transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                  suppressHydrationWarning
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <span className="text-lg uppercase tracking-widest">{dict.title}</span>
                      {dir === "rtl" ? <ArrowLeft className="w-6 h-6" /> : <ArrowRight className="w-6 h-6" />}
                    </>
                  )}
                </button>

                <div className="relative py-4 flex items-center">
                  <div className="flex-grow border-t border-[#3d2e20]/10"></div>
                  <span className="flex-shrink-0 mx-4 text-[#3d2e20]/40 text-sm font-bold uppercase">أو</span>
                  <div className="flex-grow border-t border-[#3d2e20]/10"></div>
                </div>

                <button
                  type="button"
                  className="w-full bg-white border-2 border-transparent hover:border-[#3d2e20]/10 text-[#3d2e20] py-4 rounded-[1.5rem] text-lg font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition shadow-lg shadow-[#3d2e20]/5 hover:scale-[1.01] active:scale-95"
                  suppressHydrationWarning
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
          )}

        </div>
      </div>

      <Footer />
    </main>
  );
}