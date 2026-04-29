"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import ar from "../../../../locales/ar/common.json";
import en from "../../../../locales/en/common.json";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Scale,
  X,
  CheckCircle2,
} from "lucide-react";

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
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
    <main className="min-h-screen flex overflow-x-hidden" dir={dir}>

      {/* ── Desktop brand panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] xl:w-[500px] flex-shrink-0 relative overflow-hidden p-10"
        style={{ background: "linear-gradient(160deg, #1a1410 0%, #2e2218 55%, #3d2e20 100%)" }}
      >
        <div className="absolute inset-0">
          <Image src="/image/saudi.png" alt="" fill className="object-cover opacity-[0.15]" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(160deg, rgba(26,20,16,0.92), rgba(61,46,32,0.88))" }}
          />
        </div>

        {/* Decorative ring */}
        <div
          className="absolute -bottom-32 -start-32 w-96 h-96 rounded-full opacity-10"
          style={{ border: "80px solid #c4a882" }}
        />
        <div
          className="absolute -top-20 -end-20 w-72 h-72 rounded-full opacity-5"
          style={{ border: "60px solid #c4a882" }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <Link href={`/${locale}`} className="inline-flex items-center gap-3 group">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all group-hover:scale-105"
              style={{ background: "rgba(196,168,130,0.15)", border: "1px solid rgba(196,168,130,0.3)" }}
            >
              <Scale className="w-5 h-5" style={{ color: "#c4a882" }} />
            </div>
            <span className="text-xl font-black text-white">{isAr ? "تباين" : "Tabayun"}</span>
          </Link>
        </div>

        {/* Tagline */}
        <div className="relative z-10 space-y-5">
          <div
            className="w-14 h-1 rounded-full"
            style={{ background: "linear-gradient(to right, #c4a882, transparent)" }}
          />
          <h2 className="text-3xl xl:text-4xl font-black text-white leading-snug whitespace-pre-line">
            {isAr ? "اعرف حقوقك\nأينما كنت" : "Know your rights\nanywhere"}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
            {isAr
              ? "مقارنة فورية بين أنظمة المملكة العربية السعودية وقوانين دولتك"
              : "Instant comparison between Saudi laws and your country's regulations"}
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-2 gap-3">
          {[
            { num: "+100", label: isAr ? "نظام وقانون" : "Laws & Regulations" },
            { num: "24/7", label: isAr ? "دعم ذكاء اصطناعي" : "AI Support" },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-2xl p-4"
              style={{
                background: "rgba(196,168,130,0.07)",
                border: "1px solid rgba(196,168,130,0.1)",
              }}
            >
              <p className="text-2xl font-black text-white">{s.num}</p>
              <p className="text-xs font-medium mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Form panel ── */}
      <div
        className="flex-1 relative flex flex-col justify-center items-center w-full px-0 sm:px-10 py-0 sm:py-10 min-h-screen overflow-x-hidden overflow-y-auto"
        style={{ background: "linear-gradient(135deg, #fbf7ef 0%, #f3eadf 48%, #eadccd 100%)" }}
      >
        <div className="absolute inset-0 hidden sm:block pointer-events-none select-none overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 36%, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.3) 32%, rgba(245,240,232,0.08) 68%), linear-gradient(180deg, rgba(251,247,239,0.86) 0%, rgba(251,247,239,0.52) 42%, rgba(245,240,232,0.22) 100%)",
            }}
          />
        </div>

        {/* Skyline watermark */}
        <div className="absolute inset-0 hidden sm:block pointer-events-none select-none overflow-hidden">
          <Image
            src="/image/skyline-cropped.png"
            alt=""
            fill
            className="object-cover sm:object-contain object-bottom scale-100 sm:scale-[1.06] lg:scale-[1.16]"
            style={{ opacity: 0.62, filter: "contrast(1.1) saturate(0.9)", transformOrigin: "bottom center" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(251,247,239,0.66) 0%, rgba(251,247,239,0.14) 44%, rgba(251,247,239,0) 100%)",
            }}
          />
        </div>

        <div
          className="auth-card-shell relative z-10 w-full min-h-screen sm:min-h-0 sm:w-full sm:max-w-md box-border overflow-hidden rounded-none sm:rounded-[2rem] px-8 py-12 sm:px-8 sm:py-8"
          style={{
            background: "linear-gradient(180deg, rgba(255,252,246,0.38) 0%, rgba(250,244,235,0.28) 100%)",
            border: "1px solid rgba(255,255,255,0)",
            boxShadow: "none",
            backdropFilter: "none",
          }}
        >
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[58%] sm:hidden overflow-hidden"
            style={{
              backgroundImage: "url('/image/skyline-cropped.png')",
              backgroundRepeat: "no-repeat",
              backgroundSize: "680px auto",
              backgroundPosition: "center bottom",
              opacity: 0.42,
            }}
          >
            <Image
              src="/image/skyline-cropped.png"
              alt=""
              fill
              className="object-contain object-bottom"
              style={{
                opacity: 0,
                filter: "contrast(1.12) saturate(0.9)",
                transform: "scale(1.8) translateY(-14%)",
                transformOrigin: "bottom center",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,252,246,0.52) 0%, rgba(255,252,246,0.2) 34%, rgba(246,238,226,0.72) 78%, rgba(246,238,226,0.94) 100%)",
              }}
            />
          </div>

          {/* Mobile logo */}
          <div className="relative z-10 lg:hidden mb-12 flex justify-center">
            <Link href={`/${locale}`} className="flex items-center gap-3 group">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105"
                style={{
                  background: "rgba(255,255,255,0.5)",
                  boxShadow: "0 8px 22px rgba(61,46,32,0.08)",
                }}
              >
                <Scale className="w-5 h-5 text-[#3d2e20]" />
              </div>
              <span className="text-xl font-black text-[#2d1f14]">
                {isAr ? "تباين" : "Tabayun"}
              </span>
            </Link>
          </div>

          {/* Welcome heading */}
          <div className={`relative z-10 mb-10 ${isAr ? "text-right" : "text-left"}`}>
            <h1 className="text-[2.1rem] sm:text-[2.1rem] font-black text-[#2d1f14] mb-2 leading-tight break-words">
              {isAr ? "أهلاً بعودتك 👋" : "Welcome back 👋"}
            </h1>
            <p className="text-[#3d2e20]/48 text-base sm:text-sm font-semibold">
              {isAr ? "سجّل دخولك للمتابعة" : "Sign in to continue"}
            </p>
          </div>

          {/* Error banner */}
          {errors.general && (
            <div className="relative z-10 mb-5 bg-red-50 text-red-600 px-4 py-3.5 rounded-2xl text-sm font-semibold border border-red-100 flex items-center gap-2">
              <X className="w-4 h-4 flex-shrink-0" />
              {errors.general}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="relative z-10 space-y-6" noValidate>

            {/* Email field */}
            <div className="space-y-2">
              <label
                className={`block text-xs font-bold text-[#2d1f14]/70 tracking-wide uppercase ${isAr ? "text-right" : "text-left"}`}
              >
                {dict.email || (isAr ? "البريد الإلكتروني" : "Email")}
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="example@email.com"
                  className="w-full rounded-2xl pe-4 ps-12 py-4 text-[#2d1f14] font-semibold text-base sm:text-sm placeholder:text-[#3d2e20]/28 focus:outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.42)",
                    backdropFilter: "blur(6px)",
                    border: errors.email
                      ? "2px solid #f87171"
                      : focusedField === "email"
                      ? "2px solid #3d2e20"
                        : "2px solid rgba(255,255,255,0.38)",
                    boxShadow:
                      focusedField === "email"
                        ? "0 0 0 4px rgba(61,46,32,0.08)"
                        : "0 2px 8px rgba(61,46,32,0.06)",
                  }}
                  dir="ltr"
                />
                <div
                  className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none transition-colors"
                  style={{ color: focusedField === "email" ? "#3d2e20" : "rgba(61,46,32,0.3)" }}
                >
                  <Mail className="w-4.5 h-4.5" strokeWidth={2} />
                </div>
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs font-semibold ps-1">{errors.email}</p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#2d1f14]/70 tracking-wide uppercase">
                  {dict.password || (isAr ? "كلمة المرور" : "Password")}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail("");
                    setResetSuccess(false);
                    setShowForgotDialog(true);
                  }}
                  className="text-xs font-bold text-[#3d2e20]/50 hover:text-[#3d2e20] transition-colors"
                >
                  {dict.forgotPassword || (isAr ? "هل نسيت كلمة المرور؟" : "Forgot password?")}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl ps-12 pe-12 py-4 text-[#2d1f14] font-semibold text-base sm:text-sm placeholder:text-[#3d2e20]/28 focus:outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.42)",
                    backdropFilter: "blur(6px)",
                    border: errors.password
                      ? "2px solid #f87171"
                      : focusedField === "password"
                      ? "2px solid #3d2e20"
                      : "2px solid rgba(255,255,255,0.38)",
                    boxShadow:
                      focusedField === "password"
                        ? "0 0 0 4px rgba(61,46,32,0.08)"
                        : "0 2px 8px rgba(61,46,32,0.06)",
                  }}
                  dir="ltr"
                />
                <div
                  className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none transition-colors"
                  style={{ color: focusedField === "password" ? "#3d2e20" : "rgba(61,46,32,0.3)" }}
                >
                  <Lock className="w-4.5 h-4.5" strokeWidth={2} />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-0 pe-4 flex items-center transition-colors"
                  style={{ color: "rgba(61,46,32,0.3)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#3d2e20")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(61,46,32,0.3)")}
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" strokeWidth={2} />
                  ) : (
                    <Eye className="w-4.5 h-4.5" strokeWidth={2} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs font-semibold ps-1">{errors.password}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 flex items-center justify-center gap-2.5 py-[1.1rem] rounded-2xl font-black text-base sm:text-[0.95rem] tracking-wide transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: loading
                  ? "rgba(61,46,32,0.7)"
                  : "linear-gradient(135deg, #2d1f14 0%, #3d2e20 60%, #523e2b 100%)",
                color: "white",
                boxShadow: "0 8px 28px rgba(45,31,20,0.3)",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 12px 32px rgba(45,31,20,0.38)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 8px 28px rgba(45,31,20,0.3)";
              }}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>{dict.enter || (isAr ? "دخول" : "Sign in")}</span>
                  {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </>
              )}
            </button>
          </form>

          <div className="auth-bottom-copy relative z-10 mt-7 pt-5 pb-4">
          {/* Divider */}
          <div className="flex items-center gap-3 mb-7">
            <div className="flex-1 h-px bg-[#3d2e20]/10" />
            <span className="text-xs font-semibold text-[#3d2e20]/55">
              {isAr ? "أو" : "or"}
            </span>
            <div className="flex-1 h-px bg-[#3d2e20]/10" />
          </div>

          {/* Register link */}
          <p className={`text-sm text-[#2d1f14] font-bold text-center`}>
            {isAr ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
            <Link
              href={`/${locale}/auth/register`}
              className="font-black text-[#2d1f14] hover:underline underline-offset-4 decoration-[#2d1f14]/30"
            >
              {dict.createAccount || (isAr ? "إنشاء حساب" : "Sign up")}
            </Link>
          </p>

          {/* Copyright */}
          <p className="mt-8 text-center text-xs text-[#3d2e20]/70 font-semibold">
            {dict.rights || (isAr ? "جميع الحقوق محفوظة لتباين ©" : "© All rights reserved Tabayun")}
          </p>
          </div>
        </div>
      </div>

      {/* ── Forgot Password Dialog ── */}
      {showForgotDialog && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#1a1410]/50 backdrop-blur-sm"
            onClick={() => setShowForgotDialog(false)}
          />
          <div
            className="relative w-full max-w-sm rounded-[2rem] p-8 overflow-hidden"
            style={{
              background: "#f5f0e8",
              boxShadow: "0 24px 80px rgba(26,20,16,0.3)",
            }}
          >
            <button
              onClick={() => setShowForgotDialog(false)}
              className="absolute top-5 end-5 w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-[#3d2e20]/8"
            >
              <X className="w-4 h-4 text-[#3d2e20]/40" />
            </button>

            {!resetSuccess ? (
              <div className="space-y-6">
                <div>
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: "rgba(61,46,32,0.08)" }}
                  >
                    <Lock className="w-5 h-5 text-[#3d2e20]" />
                  </div>
                  <h3 className="text-xl font-black text-[#2d1f14] mb-1.5">
                    {isAr ? "نسيت كلمة المرور؟" : "Forgot password?"}
                  </h3>
                  <p className="text-sm font-medium text-[#3d2e20]/45 leading-relaxed">
                    {isAr
                      ? "أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة التعيين"
                      : "Enter your email and we'll send you a reset link"}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className={`block text-xs font-bold text-[#2d1f14]/70 tracking-wide uppercase ${isAr ? "text-right" : "text-left"}`}>
                    {isAr ? "البريد الإلكتروني" : "Email"}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="example@email.com"
                      className="w-full bg-white rounded-2xl ps-12 pe-4 py-4 text-[#2d1f14] font-semibold placeholder:text-[#3d2e20]/25 border-2 border-transparent focus:border-[#3d2e20]/25 focus:outline-none transition-all shadow-sm text-sm"
                      dir="ltr"
                    />
                    <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-[#3d2e20]/30">
                      <Mail className="w-4.5 h-4.5" strokeWidth={2} />
                    </div>
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
                      setShowForgotDialog(false);
                    } finally {
                      setIsSendingReset(false);
                    }
                  }}
                  disabled={isSendingReset || !forgotEmail}
                  className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-black text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, #2d1f14, #3d2e20)",
                    color: "white",
                    boxShadow: "0 8px 24px rgba(45,31,20,0.25)",
                  }}
                >
                  {isSendingReset ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>{isAr ? "إرسال رابط الاستعادة" : "Send Reset Link"}</span>
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center space-y-6 py-2">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
                  style={{ background: "rgba(22,163,74,0.1)" }}
                >
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#2d1f14] mb-2">
                    {isAr ? "تم الإرسال!" : "Email Sent!"}
                  </h3>
                  <p className="text-sm font-medium text-[#3d2e20]/45 leading-relaxed">
                    {isAr
                      ? "تحقق من بريدك الإلكتروني للحصول على تعليمات استعادة كلمة المرور"
                      : "Check your email for password reset instructions"}
                  </p>
                </div>
                <button
                  onClick={() => setShowForgotDialog(false)}
                  className="w-full py-4 rounded-2xl font-black text-sm"
                  style={{
                    background: "linear-gradient(135deg, #2d1f14, #3d2e20)",
                    color: "white",
                  }}
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
