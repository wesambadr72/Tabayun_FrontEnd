"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import ar from "../../../../locales/ar/common.json";
import en from "../../../../locales/en/common.json";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Loader2, Scale, X } from "lucide-react";

const dictionaries = { ar, en };

export default function LoginPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "ar";
  const dict = (dictionaries[locale as keyof typeof dictionaries] || ar).auth.login;
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showForgotDialog, setShowForgotDialog] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email)
      newErrors.email = isAr ? "البريد الإلكتروني مطلوب" : "Email is required";
    if (!formData.password)
      newErrors.password = isAr ? "كلمة المرور مطلوبة" : "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      const data = new FormData();
      data.append("email", formData.email);
      data.append("password", formData.password);
      const response = await authService.login(data);
      authService.setToken(response.access_token);
      await authService.getMe();
      router.push(`/${locale}/dashboard`);
    } catch (err: any) {
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex" dir={dir}>

      {/* ── Brand panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] xl:w-[480px] flex-shrink-0 relative overflow-hidden p-10"
        style={{ background: "linear-gradient(160deg, #1a1410 0%, #2e2218 60%, #3d2e20 100%)" }}
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <Image src="/image/saudi.png" alt="" fill className="object-cover opacity-20" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(26,20,16,0.9), rgba(61,46,32,0.85))" }} />
        </div>

        {/* Top: Logo */}
        <div className="relative z-10">
          <Link href={`/${locale}`} className="inline-flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(196,168,130,0.15)", border: "1px solid rgba(196,168,130,0.3)" }}
            >
              <Scale className="w-5 h-5" style={{ color: "#c4a882" }} />
            </div>
            <span className="text-xl font-black text-white">{isAr ? "تباين" : "Tabayun"}</span>
          </Link>
        </div>

        {/* Middle: Quote / tagline */}
        <div className="relative z-10 space-y-4">
          <div
            className="w-12 h-1 rounded-full"
            style={{ background: "linear-gradient(to right, #c4a882, #8B6F47)" }}
          />
          <h2 className="text-3xl xl:text-4xl font-black text-white leading-snug">
            {isAr
              ? "اعرف حقوقك\nأينما كنت"
              : "Know your rights\nanywhere"}
          </h2>
          <p className="text-base" style={{ color: "rgba(255,255,255,0.5)" }}>
            {isAr
              ? "مقارنة فورية بين أنظمة المملكة وقوانين دولتك"
              : "Instant comparison between Saudi laws and your country's"}
          </p>
        </div>

        {/* Bottom: Stats */}
        <div className="relative z-10 grid grid-cols-2 gap-4">
          {[
            { num: "+100", label: isAr ? "نظام وقانون" : "Laws" },
            { num: "24/7", label: isAr ? "دعم ذكي" : "AI Support" },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-2xl p-4"
              style={{ background: "rgba(196,168,130,0.08)", border: "1px solid rgba(196,168,130,0.12)" }}
            >
              <p className="text-2xl font-black text-white">{s.num}</p>
              <p className="text-xs font-semibold mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Form panel ── */}
      <div className="flex-1 bg-[#f5f1eb] flex flex-col justify-center items-center px-5 sm:px-10 py-16 min-h-screen overflow-y-auto">

        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(61,46,32,0.08)" }}
            >
              <Scale className="w-4.5 h-4.5 text-[#3d2e20]" />
            </div>
            <span className="text-lg font-black text-[#3d2e20]">{isAr ? "تباين" : "Tabayun"}</span>
          </Link>
        </div>

        <div className="w-full max-w-md">
          {/* Header */}
          <div className={`mb-10 ${isAr ? "text-right" : "text-left"}`}>
            <h1 className="text-3xl sm:text-4xl font-black text-[#3d2e20] mb-2">
              {isAr ? "أهلاً بعودتك 👋" : "Welcome back 👋"}
            </h1>
            <p className="text-[#3d2e20]/50 font-medium">
              {isAr ? "سجّل دخولك للمتابعة" : "Sign in to continue"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {errors.general && (
              <div className="bg-red-50 text-red-600 px-4 py-3.5 rounded-2xl text-sm font-semibold border border-red-100">
                {errors.general}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className={`block text-sm font-bold text-[#3d2e20] ${isAr ? "text-right" : "text-left"}`}>
                {dict.email || (isAr ? "البريد الإلكتروني" : "Email")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-[#3d2e20]/30">
                  <Mail className="w-4.5 h-4.5" strokeWidth={2} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={isAr ? "example@email.com" : "example@email.com"}
                  className={`w-full bg-white rounded-2xl ps-11 pe-4 py-4 text-[#3d2e20] font-semibold placeholder:text-[#3d2e20]/25 focus:outline-none transition-all shadow-sm text-sm ${
                    errors.email
                      ? "border-2 border-red-300 focus:border-red-400"
                      : "border-2 border-transparent focus:border-[#3d2e20]/20"
                  }`}
                  dir="ltr"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs font-semibold ps-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className={`block text-sm font-bold text-[#3d2e20] ${isAr ? "text-right" : "text-left"}`}>
                {dict.password}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-[#3d2e20]/30">
                  <Lock className="w-4.5 h-4.5" strokeWidth={2} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full bg-white rounded-2xl ps-11 pe-11 py-4 text-[#3d2e20] font-semibold placeholder:text-[#3d2e20]/25 focus:outline-none transition-all shadow-sm text-sm ${
                    errors.password
                      ? "border-2 border-red-300 focus:border-red-400"
                      : "border-2 border-transparent focus:border-[#3d2e20]/20"
                  } ${isAr ? "text-right" : "text-left"}`}
                  dir={isAr ? "rtl" : "ltr"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-0 pe-4 flex items-center text-[#3d2e20]/30 hover:text-[#3d2e20] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" strokeWidth={2} /> : <Eye className="w-4.5 h-4.5" strokeWidth={2} />}
                </button>
              </div>
              <div className="flex justify-start px-1">
                <button 
                  type="button"
                  onClick={() => {
                    setForgotEmail("");
                    setResetSuccess(false);
                    setShowForgotDialog(true);
                  }}
                  className="text-xs font-bold text-[#3d2e20]/40 hover:text-[#3d2e20] transition-colors"
                >
                  {dict.forgotPassword}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs font-semibold ps-1">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2.5 py-4 rounded-2xl font-black text-base transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
              style={{
                background: "linear-gradient(135deg, #3d2e20, #523e2b)",
                color: "white",
                boxShadow: "0 8px 24px rgba(61,46,32,0.25)",
              }}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>{dict.enter}</span>
                  {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </>
              )}
            </button>
          </form>

          {/* Register link */}
          <p className={`mt-8 text-sm text-[#3d2e20]/50 font-medium ${isAr ? "text-right" : "text-left"}`}>
            {isAr ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
            <Link
              href={`/${locale}/auth/register`}
              className="font-bold text-[#3d2e20] hover:underline underline-offset-4"
            >
              {dict.createAccount}
            </Link>
          </p>

          {/* Footer note */}
          <p className={`mt-10 text-xs text-[#3d2e20]/30 font-medium ${isAr ? "text-right" : "text-left"}`}>
            {dict.rights}
          </p>
        </div>
      </div>
      {/* Forgot Password Dialog */}
      {showForgotDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-[#1a1410]/60 backdrop-blur-sm" 
            onClick={() => setShowForgotDialog(false)}
          />
          <div className="relative w-full max-w-md bg-[#f5f1eb] rounded-[32px] p-8 shadow-2xl overflow-hidden border border-white/20">
            <button 
              onClick={() => setShowForgotDialog(false)}
              className="absolute top-6 end-6 p-2 rounded-full hover:bg-[#3d2e20]/5 transition-colors"
            >
              <X className="w-5 h-5 text-[#3d2e20]/40" />
            </button>

            {!resetSuccess ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-[#3d2e20] mb-2">
                    {isAr ? "نسيت كلمة المرور؟" : "Forgot password?"}
                  </h3>
                  <p className="text-sm font-medium text-[#3d2e20]/50">
                    {isAr 
                      ? "لا تقلق، أدخل بريدك الإلكتروني وسنرسل لك رابطاً لاستعادة كلمة المرور"
                      : "Don't worry, enter your email and we'll send you a password reset link"}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-[#3d2e20]">
                    {isAr ? "البريد الإلكتروني" : "Email"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-[#3d2e20]/30">
                      <Mail className="w-4.5 h-4.5" strokeWidth={2} />
                    </div>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="example@email.com"
                      className="w-full bg-white rounded-2xl ps-11 pe-4 py-4 text-[#3d2e20] font-semibold placeholder:text-[#3d2e20]/25 border-2 border-transparent focus:border-[#3d2e20]/20 focus:outline-none transition-all shadow-sm text-sm"
                      dir="ltr"
                    />
                  </div>
                </div>

                <button
                  onClick={async () => {
                    if (!forgotEmail) return;
                    setIsSendingReset(true);
                    try {
                      await authService.forgotPassword(forgotEmail);
                      setResetSuccess(true);
                    } catch (err: any) {
                      setErrors({ general: err.message });
                    } finally {
                      setIsSendingReset(false);
                    }
                  }}
                  disabled={isSendingReset || !forgotEmail}
                  className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-black text-base transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #3d2e20, #523e2b)",
                    color: "white",
                  }}
                >
                  {isSendingReset ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span>{isAr ? "إرسال رابط الاستعادة" : "Send Reset Link"}</span>
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center space-y-6 py-4">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#3d2e20] mb-2">
                    {isAr ? "تم الإرسال بنجاح!" : "Sent Successfully!"}
                  </h3>
                  <p className="text-sm font-medium text-[#3d2e20]/50">
                    {isAr
                      ? "تحقق من بريدك الإلكتروني للحصول على تعليمات استعادة كلمة المرور"
                      : "Check your email for instructions on how to reset your password"}
                  </p>
                </div>
                <button
                  onClick={() => setShowForgotDialog(false)}
                  className="w-full py-4 rounded-2xl font-black text-base bg-[#3d2e20] text-white"
                >
                  {isAr ? "حسناً" : "Got it"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
