"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, Loader2, Lock, Mail, X } from "lucide-react";
import { AuthHeader, AuthPrimaryButton, AuthShell, AuthTextField } from "@/components/auth/AuthLayout";
import { authService } from "@/services/authService";
import { Toast, useToast } from "@/components/ui/Toast";
import ar from "../../../../locales/ar/common.json";
import en from "../../../../locales/en/common.json";

const dictionaries = { ar, en };

export default function LoginPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "ar";
  const dict = (dictionaries[locale as keyof typeof dictionaries] || ar).auth.login;
  const isAr = locale === "ar";

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showForgotDialog, setShowForgotDialog] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const { message, type, isVisible, showToast, hideToast } = useToast();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    if (errors[event.target.name]) setErrors({ ...errors, [event.target.name]: "" });
  };

  const validate = () => {
    const nextErrors: { [key: string]: string } = {};
    if (!formData.email) nextErrors.email = isAr ? "البريد الإلكتروني مطلوب" : "Email is required";
    if (!formData.password) nextErrors.password = isAr ? "كلمة المرور مطلوبة" : "Password is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const data = new FormData();
      data.append("email", formData.email);
      data.append("password", formData.password);
      const response = await authService.login(data);
      authService.setToken(response.access_token);
      await authService.getMe();
      showToast(isAr ? "تم تسجيل الدخول بنجاح" : "Logged in successfully", "success");
      setTimeout(() => router.push(`/${locale}/dashboard`), 1000);
    } catch (error: any) {
      showToast(error.message || (isAr ? "فشل تسجيل الدخول" : "Login failed"), "error");
    } finally {
      setLoading(false);
    }
  };

  const sendResetLink = async () => {
    if (!forgotEmail) return;

    try {
      setIsSendingReset(true);
      await authService.forgotPassword(forgotEmail);
      setResetSuccess(true);
      showToast(isAr ? "تم إرسال رابط استعادة كلمة المرور" : "Password reset link sent", "success");
      setShowForgotDialog(false);
    } catch (error: any) {
      showToast(error.message || (isAr ? "فشل إرسال الرابط" : "Failed to send link"), "error");
      setShowForgotDialog(false);
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <AuthShell
      locale={locale}
      mode="login"
      title={isAr ? "اعرف حقوقك أينما كنت" : "Know your rights anywhere"}
      description={
        isAr
          ? "تجربة دخول هادئة وآمنة تقود السائح مباشرة إلى مقارنة القوانين والتنبيهات المهمة."
          : "A calm, secure sign-in experience that takes visitors directly to law comparisons and important alerts."
      }
    >
      <AuthHeader
        eyebrow={isAr ? "تسجيل الدخول" : "Sign in"}
        title={isAr ? "أهلاً بعودتك" : "Welcome back"}
        description={isAr ? "ادخل إلى حسابك لمتابعة المقارنات والتنبيهات القانونية." : "Access your comparisons, alerts, and legal guidance."}
      />

      <Toast message={message} type={type} isVisible={isVisible} onClose={hideToast} />

      {errors.general && (
        <div className="mb-5 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          <X className="mt-0.5 h-4 w-4 shrink-0" />
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <AuthTextField
          label={dict.email || (isAr ? "البريد الإلكتروني" : "Email")}
          icon={Mail}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="example@email.com"
          error={errors.email}
          dir={isAr ? "rtl" : "ltr"}
          autoComplete="email"
        />

        <AuthTextField
          label={dict.password || (isAr ? "كلمة المرور" : "Password")}
          icon={Lock}
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          error={errors.password}
          dir={isAr ? "rtl" : "ltr"}
          autoComplete="current-password"
          labelAction={
            <button
              type="button"
              onClick={() => {
                setForgotEmail(formData.email);
                setResetSuccess(false);
                setShowForgotDialog(true);
              }}
              className="text-xs font-black text-tabayun-coffee/42 transition hover:text-tabayun-coffee"
            >
              {dict.forgotPassword || (isAr ? "نسيت كلمة المرور؟" : "Forgot password?")}
            </button>
          }
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute inset-y-0 end-0 flex items-center pe-4 text-tabayun-coffee/35 transition hover:text-tabayun-coffee"
              aria-label={showPassword ? (isAr ? "إخفاء كلمة المرور" : "Hide password") : isAr ? "إظهار كلمة المرور" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          }
        />

        <AuthPrimaryButton type="submit" disabled={loading} className="mt-2">
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <span>{dict.enter || (isAr ? "دخول" : "Sign in")}</span>
              {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </>
          )}
        </AuthPrimaryButton>
      </form>

      <div className="mt-7">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-tabayun-coffee/10" />
          <span className="text-xs font-black text-tabayun-coffee/40">{isAr ? "أو" : "or"}</span>
          <span className="h-px flex-1 bg-tabayun-coffee/10" />
        </div>
        <p className="text-center text-sm font-bold text-tabayun-coffee/62">
          {isAr ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
          <Link href={`/${locale}/auth/register`} className="font-black text-tabayun-coffee underline-offset-4 hover:underline">
            {dict.createAccount || (isAr ? "إنشاء حساب" : "Create account")}
          </Link>
        </p>
        <p className="mt-8 text-center text-xs font-bold text-tabayun-coffee/42">
          {dict.rights || (isAr ? "جميع الحقوق محفوظة لتباين ©" : "© All rights reserved Tabayun")}
        </p>
      </div>

      {showForgotDialog && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <button
            type="button"
            className="absolute inset-0 bg-tabayun-coffee/55 backdrop-blur-sm"
            onClick={() => setShowForgotDialog(false)}
            aria-label={isAr ? "إغلاق" : "Close"}
          />
          <div className="relative w-full max-w-sm overflow-hidden rounded-[30px] border border-white/70 bg-tabayun-pearl p-6 shadow-[0_30px_90px_rgba(44,22,15,0.28)]">
            <button
              type="button"
              onClick={() => setShowForgotDialog(false)}
              className="absolute end-5 top-5 flex h-9 w-9 items-center justify-center rounded-2xl bg-tabayun-sand/45 text-tabayun-coffee/45 transition hover:text-tabayun-coffee"
              aria-label={isAr ? "إغلاق" : "Close"}
            >
              <X className="h-4 w-4" />
            </button>

            {!resetSuccess ? (
              <div className="space-y-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-tabayun-coffee text-tabayun-paper">
                  <Lock className="h-6 w-6" />
                </div>
                <div className="pe-8">
                  <h2 className="text-2xl font-black text-tabayun-coffee">{isAr ? "استعادة كلمة المرور" : "Reset password"}</h2>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-tabayun-coffee/55">
                    {isAr ? "أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة التعيين." : "Enter your email and we will send a reset link."}
                  </p>
                </div>
                <AuthTextField
                  label={isAr ? "البريد الإلكتروني" : "Email"}
                  icon={Mail}
                  type="email"
                  value={forgotEmail}
                  onChange={(event) => setForgotEmail(event.target.value)}
                  placeholder="example@email.com"
                  dir={isAr ? "rtl" : "ltr"}
                />
                <AuthPrimaryButton type="button" onClick={sendResetLink} disabled={isSendingReset || !forgotEmail}>
                  {isSendingReset ? <Loader2 className="h-5 w-5 animate-spin" /> : isAr ? "إرسال رابط الاستعادة" : "Send reset link"}
                </AuthPrimaryButton>
              </div>
            ) : (
              <div className="py-4 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-tabayun-success/10 text-tabayun-success">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h2 className="mt-5 text-2xl font-black text-tabayun-coffee">{isAr ? "تم الإرسال" : "Email sent"}</h2>
                <p className="mx-auto mt-2 max-w-xs text-sm font-semibold leading-relaxed text-tabayun-coffee/55">
                  {isAr ? "تحقق من بريدك الإلكتروني للحصول على تعليمات الاستعادة." : "Check your email for reset instructions."}
                </p>
                <AuthPrimaryButton type="button" onClick={() => setShowForgotDialog(false)} className="mt-6">
                  {isAr ? "حسناً" : "Got it"}
                </AuthPrimaryButton>
              </div>
            )}
          </div>
        </div>
      )}
    </AuthShell>
  );
}
