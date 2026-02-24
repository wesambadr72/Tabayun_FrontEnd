"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ar from "../../../../locales/ar/common.json";
import en from "../../../../locales/en/common.json";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, Eye, EyeOff, User, Mail, Lock, Check, Sparkles, Globe } from "lucide-react";

const dictionaries = { ar, en };

export default function RegisterPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "ar";
  const dict = (dictionaries[locale as keyof typeof dictionaries] || ar).auth.register;
  const dir = locale === "ar" ? "rtl" : "ltr";

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Custom input state
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    repeatPassword: "",
    country: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const countries = [
    { name: locale === "ar" ? "ألمانيا" : "Germany", flag: "/image/flags/germany.png" },
    { name: locale === "ar" ? "المملكة المتحدة" : "United Kingdom", flag: "/image/flags/uk.png" },
    { name: locale === "ar" ? "الولايات المتحدة" : "USA", flag: "/image/flags/usa.png" },
    { name: locale === "ar" ? "إندونيسيا" : "Indonesia", flag: "/image/flags/indonesia.png" },
    { name: locale === "ar" ? "إسبانيا" : "Spain", flag: "/image/flags/spain.png" },
    { name: locale === "ar" ? "إيطاليا" : "Italy", flag: "/image/flags/italy.png" },
    { name: locale === "ar" ? "الهند" : "India", flag: "/image/flags/india.png" },
    { name: locale === "ar" ? "الصين" : "China", flag: "/image/flags/china.png" },
  ];

  const validateStep = (currentStep: number) => {
    const newErrors: { [key: string]: string } = {};

    if (currentStep === 1) {
      if (!formData.email) {
        newErrors.email = locale === "ar" ? "البريد الإلكتروني مطلوب" : "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = locale === "ar" ? "البريد الإلكتروني غير صالح" : "Invalid email address";
      }
    } else if (currentStep === 2) {
      if (!formData.name) {
        newErrors.name = locale === "ar" ? "الاسم مطلوب" : "Name is required";
      } else if (formData.name.length < 3) {
        newErrors.name = locale === "ar" ? "الاسم يجب أن يكون 3 أحرف على الأقل" : "Name must be at least 3 characters";
      }
    } else if (currentStep === 3) {
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
    } else if (currentStep === 4) {
      if (!formData.repeatPassword) {
        newErrors.repeatPassword = locale === "ar" ? "يرجى تأكيد كلمة المرور" : "Please confirm your password";
      } else if (formData.repeatPassword !== formData.password) {
        newErrors.repeatPassword = locale === "ar" ? "كلمات المرور غير متطابقة" : "Passwords do not match";
      }
    } else if (currentStep === 5) {
      if (!formData.country) {
        newErrors.country = locale === "ar" ? "يرجى اختيار الدولة" : "Please select a country";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 5) setStep(step + 1);
      else {
        alert(locale === 'ar' ? "تم التسجيل بنجاح!" : "Registration Complete!");
        router.push(`/${locale}/dashboard`);
      }
    }
  };

  const handleBack = () => {
    if (step === 1) {
      router.push(`/${locale}/auth/login`);
    } else {
      setStep(step - 1);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#f5f1eb] overflow-x-hidden" dir={dir}>
      <Navbar />

      {/* Main Container */}
      <div className="w-full max-w-5xl mt-32 md:mt-44 mb-20 px-4 md:px-8 flex flex-col items-center relative">

        {/* Background Decorative Blobs */}
        <div className="absolute top-0 -right-20 w-96 h-96 bg-[#3d2e20]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-96 h-96 bg-[#d4c5b5]/40 rounded-full blur-[100px] pointer-events-none" />

        {/* Step Counter Badge */}
        {step !== 5 && (
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="px-6 py-2 bg-white border border-[#3d2e20]/10 rounded-full shadow-sm flex items-center gap-3">
              <span className="text-xs font-black text-[#3d2e20]/40 uppercase tracking-widest leading-none">
                {locale === 'ar' ? 'المرحلة' : 'Step'}
              </span>
              <div className="flex gap-1.5" dir="ltr">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-4 bg-[#3d2e20]' : 'bg-[#3d2e20]/20'}`} />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="w-full max-w-3xl bg-white rounded-[3rem] shadow-2xl shadow-[#3d2e20]/10 border border-[#3d2e20]/5 p-8 md:p-16 relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">

          {/* Inner Content Headers */}
          <div className="text-center mb-12 space-y-4">
            {step === 5 ? (
              <div className="w-20 h-20 bg-[#3d2e20]/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Globe className="w-10 h-10 text-[#3d2e20]" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-[#3d2e20]/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-[#3d2e20]" />
              </div>
            )}
            <h1 className="text-3xl md:text-5xl font-black text-[#3d2e20] leading-tight">
              {step === 5 ? dict.compareQuestion : dict.welcome}
            </h1>
            <p className="text-[#3d2e20]/60 text-lg md:text-xl font-medium">
              {step === 5 ? (locale === 'ar' ? "أين ولدت أو تقيم حالياً؟" : "Where calculation were you born or reside?") : dict.needInfo}
            </p>
          </div>

          {/* Steps Rendering */}
          <div className="space-y-8 min-h-[140px] flex flex-col justify-center">
            {/* Step 1: Email */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
                <label className="text-sm font-black text-[#3d2e20]/40 uppercase tracking-widest px-2">{dict.emailQuestion}</label>
                <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={dict.emailPlaceholder}
                    className={`w-full bg-[#f5f1eb]/50 border-2 ${errors.email ? 'border-red-500' : 'border-transparent'} focus:border-[#3d2e20]/10 focus:bg-white rounded-2xl px-8 py-5 md:py-6 pl-14 rtl:pl-8 rtl:pr-14 text-xl md:text-2xl outline-none transition-all placeholder-[#3d2e20]/20 text-[#3d2e20] font-bold`}
                    autoFocus
                  />
                  <Mail className={`w-7 h-7 ${errors.email ? 'text-red-500/50' : 'text-[#3d2e20]/20'} absolute top-1/2 -translate-y-1/2 left-6 rtl:left-auto rtl:right-6 group-focus-within:text-[#3d2e20] transition-colors`} />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm font-bold px-2 animate-in fade-in slide-in-from-top-1 duration-300">
                    {errors.email}
                  </p>
                )}
              </div>
            )}

            {/* Step 2: Name */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
                <label className="text-sm font-black text-[#3d2e20]/40 uppercase tracking-widest px-2">{dict.nameQuestion}</label>
                <div className="relative group">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={dict.namePlaceholder}
                    className={`w-full bg-[#f5f1eb]/50 border-2 ${errors.name ? 'border-red-500' : 'border-transparent'} focus:border-[#3d2e20]/10 focus:bg-white rounded-2xl px-8 py-5 md:py-6 pl-14 rtl:pl-8 rtl:pr-14 text-xl md:text-2xl outline-none transition-all placeholder-[#3d2e20]/20 text-[#3d2e20] font-bold`}
                    autoFocus
                  />
                  <User className={`w-7 h-7 ${errors.name ? 'text-red-500/50' : 'text-[#3d2e20]/20'} absolute top-1/2 -translate-y-1/2 left-6 rtl:left-auto rtl:right-6 group-focus-within:text-[#3d2e20] transition-colors`} />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm font-bold px-2 animate-in fade-in slide-in-from-top-1 duration-300">
                    {errors.name}
                  </p>
                )}
              </div>
            )}

            {/* Step 3: Password */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="space-y-4">
                  <label className="text-sm font-black text-[#3d2e20]/40 uppercase tracking-widest px-2">{dict.passwordQuestion}</label>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={dict.passwordPlaceholder}
                      className={`w-full bg-[#f5f1eb]/50 border-2 ${errors.password ? 'border-red-500' : 'border-transparent'} focus:border-[#3d2e20]/10 focus:bg-white rounded-2xl px-8 py-5 md:py-6 pl-14 rtl:pl-8 rtl:pr-14 text-xl md:text-2xl outline-none transition-all placeholder-[#3d2e20]/20 text-[#3d2e20] font-bold`}
                      autoFocus
                    />
                    <Lock className={`w-7 h-7 ${errors.password ? 'text-red-500/50' : 'text-[#3d2e20]/20'} absolute top-1/2 -translate-y-1/2 left-6 rtl:left-auto rtl:right-6 group-focus-within:text-[#3d2e20] transition-colors`} />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 -translate-y-1/2 right-6 rtl:right-auto rtl:left-6 text-[#3d2e20]/40 hover:text-[#3d2e20] transition p-2"
                    >
                      {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm font-bold px-2 animate-in fade-in slide-in-from-top-1 duration-300">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div className="bg-[#f5f1eb]/50 p-5 rounded-2xl border border-[#3d2e20]/5">
                  <p className="text-[#3d2e20]/60 text-sm font-medium leading-relaxed">
                    {dict.passwordHint}
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Repeat Password */}
            {step === 4 && (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
                <label className="text-sm font-black text-[#3d2e20]/40 uppercase tracking-widest px-2">{dict.repeatPasswordQuestion}</label>
                <div className="relative group">
                  <input
                    type="password"
                    name="repeatPassword"
                    value={formData.repeatPassword}
                    onChange={handleChange}
                    placeholder={dict.repeatPasswordPlaceholder}
                    className={`w-full bg-[#f5f1eb]/50 border-2 ${errors.repeatPassword ? 'border-red-500' : 'border-transparent'} focus:border-[#3d2e20]/10 focus:bg-white rounded-2xl px-8 py-5 md:py-6 pl-14 rtl:pl-8 rtl:pr-14 text-xl md:text-2xl outline-none transition-all placeholder-[#3d2e20]/20 text-[#3d2e20] font-bold`}
                    autoFocus
                  />
                  <Lock className={`w-7 h-7 ${errors.repeatPassword ? 'text-red-500/50' : 'text-[#3d2e20]/20'} absolute top-1/2 -translate-y-1/2 left-6 rtl:left-auto rtl:right-6 group-focus-within:text-[#3d2e20] transition-colors`} />
                </div>
                {errors.repeatPassword && (
                  <p className="text-red-500 text-sm font-bold px-2 animate-in fade-in slide-in-from-top-1 duration-300">
                    {errors.repeatPassword}
                  </p>
                )}
              </div>
            )}

            {/* Step 5: Country Selection Overlay */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-in fade-in zoom-in-95 duration-700">
                  {countries.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setFormData({ ...formData, country: item.name });
                        if (errors.country) setErrors({ ...errors, country: "" });
                      }}
                      className={`group relative flex flex-col items-center p-5 rounded-[2rem] border-2 transition-all duration-300 ${formData.country === item.name ? 'bg-[#3d2e20] text-white border-[#3d2e20] shadow-xl scale-105' : 'bg-[#f5f1eb]/50 border-transparent text-[#3d2e20] hover:border-[#3d2e20]/20 hover:bg-white'}`}
                    >
                      <div className={`relative w-16 h-16 md:w-20 md:h-20 mb-4 rounded-full overflow-hidden shadow-md border-2 transition-transform duration-500 group-hover:scale-110 ${formData.country === item.name ? 'border-white/20' : 'border-[#3d2e20]/10'}`}>
                        <Image src={item.flag} alt={item.name} fill className="object-cover" />
                      </div>
                      <span className="font-bold text-sm md:text-base">{item.name}</span>
                      {formData.country === item.name && (
                        <div className="absolute top-3 right-3 bg-white text-[#3d2e20] rounded-full p-1 shadow-md">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {errors.country && (
                  <p className="text-red-500 text-center text-sm font-bold px-2 animate-in fade-in slide-in-from-top-1 duration-300">
                    {errors.country}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Actions Bar */}
          <div className="flex items-center gap-4 md:gap-6 mt-16 pt-10 border-t border-[#3d2e20]/5">
            <button
              onClick={handleBack}
              className="flex-1 py-4 px-6 md:px-10 bg-[#f5f1eb] text-[#3d2e20] rounded-full font-black text-lg hover:bg-white hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              {locale === "ar" ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
              <span>{step === 1 ? (locale === 'ar' ? 'عودة' : 'Exit') : dict.back}</span>
            </button>

            <button
              onClick={handleNext}
              className="flex-[2] py-4 px-6 md:px-10 bg-[#3d2e20] text-white rounded-full font-black text-lg shadow-xl shadow-[#3d2e20]/20 hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <span>{step === 4 ? dict.welcomeBtn : step === 5 ? dict.confirm : dict.next}</span>
              {locale === "ar" ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Bottom Link */}
        <div className="mt-12 text-center animate-in fade-in duration-1000 delay-500">
          <span className="text-[#3d2e20]/40 font-bold">{locale === 'ar' ? "لديك حساب بالفعل؟" : "Already have an account?"}</span>
          <Link href={`/${locale}/auth/login`} className="ml-2 rtl:mr-2 text-[#3d2e20] font-black hover:underline underline-offset-4">
            {locale === 'ar' ? "سجل دخولك هنا" : "Log in here"}
          </Link>
        </div>

      </div>

      <Footer />
    </main>
  );
}