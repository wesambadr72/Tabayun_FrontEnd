"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { lawService } from "@/services/lawService";
import ar from "../../../../locales/ar/common.json";
import en from "../../../../locales/en/common.json";
import {
  ArrowLeft, ArrowRight, Eye, EyeOff,
  User, Mail, Lock, Check, Globe, Loader2, Scale,
} from "lucide-react";

const dictionaries = { ar, en };

const TOTAL_STEPS = 5;

export default function RegisterPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "ar";
  const dict = (dictionaries[locale as keyof typeof dictionaries] || ar).auth.register;
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    email: "", name: "", password: "", repeatPassword: "", country: "",
  });
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true);
        const data = await lawService.getAvailableCountries();
        setAvailableCountries(
          data.filter((c: string) =>
            !["saudi arabia", "السعودية", "المملكة العربية السعودية"].includes(c.toLowerCase())
          )
        );
      } catch {
        // silent
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const getFlagPath = (countryName: string) => {
    const mapping: Record<string, string> = {
      de: "/image/flags/germany.png",
      uk: "/image/flags/uk.png",
    };
    return mapping[countryName] || null;
  };

  const getLocalizedCountryName = (countryName: string) => {
    if (!isAr) return countryName;
    const mapping: Record<string, string> = {
      de: "ألمانيا",
      uk: "المملكة المتحدة",
    };
    return mapping[countryName] || countryName;
  };

  const validateStep = async (s: number) => {
    const e: { [key: string]: string } = {};
    if (s === 1) {
      if (!formData.email) {
        e.email = isAr ? "البريد الإلكتروني مطلوب" : "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        e.email = isAr ? "البريد غير صالح" : "Invalid email";
      } else {
        // Check if email exists in database
        try {
          setIsValidating(true);
          const res = await authService.checkEmail(formData.email);
          if (!res.available) {
            e.email = isAr ? "هذا البريد مسجل مسبقاً" : "This email is already registered";
          }
        } catch (err) {
          console.error("Email check failed", err);
        } finally {
          setIsValidating(false);
        }
      }
    } else if (s === 2) {
      if (!formData.name) e.name = isAr ? "الاسم مطلوب" : "Name is required";
      else if (formData.name.length < 3) e.name = isAr ? "الاسم يجب أن يكون 3 أحرف على الأقل" : "At least 3 characters";
    } else if (s === 3) {
      const password = formData.password;
      if (!password) {
        e.password = isAr ? "كلمة المرور مطلوبة" : "Password is required";
      } else if (password.length < 8) {
        e.password = isAr ? "8 خانات على الأقل" : "At least 8 characters";
      } else if (!/[A-Z]/.test(password)) {
        e.password = isAr ? "يجب أن تحتوي على حرف كبير واحد على الأقل" : "Must contain at least one uppercase letter";
      } else if (!/[a-z]/.test(password)) {
        e.password = isAr ? "يجب أن تحتوي على حرف صغير واحد على الأقل" : "Must contain at least one lowercase letter";
      } else if (!/[0-9]/.test(password)) {
        e.password = isAr ? "يجب أن تحتوي على رقم واحد على الأقل" : "Must contain at least one number";
      } else if (!/[!@#$%^&*]/.test(password)) {
        e.password = isAr ? "يجب أن تحتوي على رمز واحد على الأقل (!@#$%^&*)" : "Must contain at least one special character (!@#$%^&*)";
      }
    } else if (s === 4) {
      if (!formData.repeatPassword) e.repeatPassword = isAr ? "يرجى تأكيد كلمة المرور" : "Confirm password";
      else if (formData.repeatPassword !== formData.password) e.repeatPassword = isAr ? "كلمتا المرور غير متطابقتين" : "Passwords do not match";
    } else if (s === 5) {
      if (!formData.country) e.country = isAr ? "اختر دولتك" : "Select your country";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = async () => {
    const isValid = await validateStep(step);
    if (!isValid) return;
    if (step < TOTAL_STEPS) { setStep(step + 1); return; }
    await handleSubmit();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await authService.register({
        email: formData.email,
        password: formData.password,
        full_name: formData.name,
        country: formData.country,
        language: isAr ? "Arabic" : "English",
      });
      const loginData = new FormData();
      loginData.append("username", formData.email);
      loginData.append("password", formData.password);
      const loginResponse = await authService.login(loginData);
      authService.setToken(loginResponse.access_token);
      await authService.getMe();
      router.push(`/${locale}/dashboard`);
    } catch (err: any) {
      setErrors({ general: err.message || (isAr ? "حدث خطأ ما" : "Something went wrong") });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 1) router.push(`/${locale}/auth/login`);
    else setStep(step - 1);
  };

  // Step metadata
  const stepsMeta = [
    { icon: Mail, question: dict.emailQuestion, placeholder: dict.emailPlaceholder },
    { icon: User, question: dict.nameQuestion, placeholder: dict.namePlaceholder },
    { icon: Lock, question: dict.passwordQuestion, placeholder: dict.passwordPlaceholder },
    { icon: Lock, question: dict.repeatPasswordQuestion, placeholder: dict.repeatPasswordPlaceholder },
    { icon: Globe, question: dict.compareQuestion, placeholder: "" },
  ];
  const currentMeta = stepsMeta[step - 1];
  const StepIcon = currentMeta.icon;

  return (
    <main className="min-h-screen flex overflow-x-hidden" dir={dir}>

      {/* ── Brand panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] xl:w-[500px] flex-shrink-0 relative overflow-hidden p-10"
        style={{ background: "linear-gradient(160deg, #1a1410 0%, #2e2218 55%, #3d2e20 100%)" }}
      >
        <div className="absolute inset-0">
          <Image src="/image/saudi.png" alt="" fill className="object-cover opacity-[0.15]" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(26,20,16,0.92), rgba(61,46,32,0.88))" }} />
        </div>
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

        {/* Progress steps visual */}
        <div className="relative z-10 space-y-5">
          <div
            className="w-12 h-1 rounded-full"
            style={{ background: "linear-gradient(to right, #c4a882, #8B6F47)" }}
          />
          <h2 className="text-3xl xl:text-4xl font-black text-white leading-snug">
            {isAr ? "انضم إلى تباين\nاليوم" : "Join Tabayun\nToday"}
          </h2>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            {isAr ? "خطوات بسيطة لإنشاء حسابك" : "A few steps to create your account"}
          </p>

          {/* Step dots */}
          <div className="flex flex-col gap-3 pt-4">
            {[
              isAr ? "البريد الإلكتروني" : "Email",
              isAr ? "الاسم" : "Name",
              isAr ? "كلمة المرور" : "Password",
              isAr ? "تأكيد المرور" : "Confirm",
              isAr ? "اختر دولتك" : "Country",
            ].map((label, i) => (
              <div key={i} className={`flex items-center gap-3 ${isAr ? "flex-row-reverse" : ""}`}>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 transition-all duration-300"
                  style={
                    i + 1 < step
                      ? { background: "#c4a882", color: "#1a1410" }
                      : i + 1 === step
                      ? { background: "rgba(196,168,130,0.2)", border: "2px solid #c4a882", color: "#c4a882" }
                      : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.2)" }
                  }
                >
                  {i + 1 < step ? <Check className="w-3 h-3" /> : i + 1}
                </div>
                <span
                  className="text-sm font-semibold transition-all duration-300"
                  style={{ color: i + 1 === step ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)" }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Login link */}
        <div className="relative z-10">
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            {isAr ? "لديك حساب؟" : "Have an account?"}{" "}
            <Link href={`/${locale}/auth/login`} className="font-bold text-white hover:underline underline-offset-4">
              {isAr ? "سجّل دخولك" : "Sign in"}
            </Link>
          </p>
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
            background: "linear-gradient(180deg, rgba(255,252,246,0.58) 0%, rgba(250,244,235,0.5) 100%)",
            border: "1px solid rgba(255,255,255,0.82)",
            boxShadow: "0 34px 90px rgba(45,31,20,0.18), 0 2px 16px rgba(45,31,20,0.06)",
            backdropFilter: "blur(8px)",
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
                  "linear-gradient(180deg, rgba(255,252,246,0.72) 0%, rgba(255,252,246,0.22) 42%, rgba(255,252,246,0) 100%)",
              }}
            />
          </div>

        {/* Mobile logo */}
        <div className="relative z-10 lg:hidden mb-7 flex items-center justify-between">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(61,46,32,0.08)" }}>
              <Scale className="w-4 h-4 text-[#3d2e20]" />
            </div>
            <span className="text-base font-black text-[#3d2e20]">{isAr ? "تباين" : "Tabayun"}</span>
          </Link>
          {/* Mobile step dots */}
          <div className="flex gap-1.5" dir="ltr">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i + 1 === step ? "20px" : "6px",
                  background: i + 1 <= step ? "#3d2e20" : "rgba(61,46,32,0.15)",
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 w-full">

          {/* Step header */}
          <div className={`mb-8 ${isAr ? "text-right" : "text-left"}`}>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4 ${isAr ? "flex-row-reverse" : ""}`}
              style={{ background: "rgba(61,46,32,0.07)", color: "rgba(61,46,32,0.5)" }}
            >
              <span>{isAr ? `الخطوة ${step} من ${TOTAL_STEPS}` : `Step ${step} of ${TOTAL_STEPS}`}</span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(61,46,32,0.08)" }}
              >
                <StepIcon className="w-5 h-5 text-[#3d2e20]" strokeWidth={2} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#3d2e20] leading-tight">
                {step === 1
                  ? (isAr ? "يا هلا والله! 👋" : "Welcome! 👋")
                  : step === 5
                  ? (isAr ? "اختر دولتك 🌍" : "Your Country 🌍")
                  : (isAr ? "خطوة واحدة أخرى" : "One more step")}
              </h1>
            </div>
            <p className="text-[#3d2e20]/45 text-sm font-medium leading-relaxed">
              {currentMeta.question}
            </p>
          </div>

          {/* Error */}
          {errors.general && (
            <div className="mb-4 bg-red-50 text-red-600 px-4 py-3.5 rounded-2xl text-sm font-semibold border border-red-100">
              {errors.general}
            </div>
          )}

          {/* Step 1: Email */}
          {step === 1 && (
            <div className="space-y-1.5">
              <div className="relative">
                <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-[#3d2e20]/30">
                  <Mail className="w-4.5 h-4.5" strokeWidth={2} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={dict.emailPlaceholder}
                  className={`w-full bg-white/55 backdrop-blur-md rounded-2xl ps-11 pe-4 py-4 text-[#3d2e20] font-semibold placeholder:text-[#3d2e20]/25 focus:outline-none transition-all shadow-sm text-sm ${
                    errors.email ? "border-2 border-red-300" : "border-2 border-white/55 focus:border-[#3d2e20]/20"
                  }`}
                  dir="ltr"
                  autoFocus
                  suppressHydrationWarning
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs font-semibold ps-1">{errors.email}</p>}
            </div>
          )}

          {/* Step 2: Name */}
          {step === 2 && (
            <div className="space-y-1.5">
              <div className="relative">
                <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-[#3d2e20]/30">
                  <User className="w-4.5 h-4.5" strokeWidth={2} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={dict.namePlaceholder}
                  className={`w-full bg-white/55 backdrop-blur-md rounded-2xl ps-11 pe-4 py-4 text-[#3d2e20] font-semibold placeholder:text-[#3d2e20]/25 focus:outline-none transition-all shadow-sm text-sm ${
                    errors.name ? "border-2 border-red-300" : "border-2 border-white/55 focus:border-[#3d2e20]/20"
                  }`}
                  autoFocus
                  suppressHydrationWarning
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs font-semibold ps-1">{errors.name}</p>}
            </div>
          )}

          {/* Step 3: Password */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-[#3d2e20]/30">
                    <Lock className="w-4.5 h-4.5" strokeWidth={2} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={dict.passwordPlaceholder}
                    className={`w-full bg-white/55 backdrop-blur-md rounded-2xl ps-11 pe-11 py-4 text-[#3d2e20] font-semibold placeholder:text-[#3d2e20]/25 focus:outline-none transition-all shadow-sm text-sm ${
                      errors.password ? "border-2 border-red-300" : "border-2 border-white/55 focus:border-[#3d2e20]/20"
                    } ${isAr ? "text-right" : "text-left"}`}
                    dir={isAr ? "rtl" : "ltr"}
                    autoFocus
                    suppressHydrationWarning
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 end-0 pe-4 flex items-center text-[#3d2e20]/30 hover:text-[#3d2e20] transition-colors"
                    suppressHydrationWarning
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs font-semibold ps-1">{errors.password}</p>}
              </div>
              <div
                className="rounded-2xl p-4 text-xs leading-relaxed font-medium"
                style={{ background: "rgba(61,46,32,0.05)", color: "rgba(61,46,32,0.55)" }}
              >
                {dict.passwordHint}
              </div>
            </div>
          )}

          {/* Step 4: Confirm Password */}
          {step === 4 && (
            <div className="space-y-1.5">
              <div className="relative">
                <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-[#3d2e20]/30">
                  <Lock className="w-4.5 h-4.5" strokeWidth={2} />
                </div>
                <input
                  type="password"
                  name="repeatPassword"
                  value={formData.repeatPassword}
                  onChange={handleChange}
                  placeholder={dict.repeatPasswordPlaceholder}
                  className={`w-full bg-white/55 backdrop-blur-md rounded-2xl ps-11 pe-4 py-4 text-[#3d2e20] font-semibold placeholder:text-[#3d2e20]/25 focus:outline-none transition-all shadow-sm text-sm ${
                    errors.repeatPassword ? "border-2 border-red-300" : "border-2 border-white/55 focus:border-[#3d2e20]/20"
                  } ${isAr ? "text-right" : "text-left"}`}
                  dir={isAr ? "rtl" : "ltr"}
                  autoFocus
                  suppressHydrationWarning
                />
              </div>
              {/* Match indicator */}
              {formData.repeatPassword && formData.password && (
                <div className={`flex items-center gap-1.5 ps-1 text-xs font-semibold ${isAr ? "flex-row-reverse justify-end" : ""}`}>
                  {formData.repeatPassword === formData.password ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-green-600">{isAr ? "كلمتا المرور متطابقتان" : "Passwords match"}</span>
                    </>
                  ) : (
                    <span className="text-red-500">{errors.repeatPassword || (isAr ? "غير متطابقتين" : "Do not match")}</span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 5: Country */}
          {step === 5 && (
            <div className="space-y-4">
              {loadingCountries ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin text-[#3d2e20]" />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableCountries.map((countryName, i) => {
                    const flag = getFlagPath(countryName);
                    const localizedName = getLocalizedCountryName(countryName);
                    const isSelected = formData.country === countryName;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, country: countryName });
                          if (errors.country) setErrors({ ...errors, country: "" });
                        }}
                        className="relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        style={
                          isSelected
                            ? { background: "#3d2e20", borderColor: "#3d2e20", color: "white" }
                            : { background: "white", borderColor: "transparent", color: "#3d2e20" }
                        }
                        suppressHydrationWarning
                      >
                        <div className="relative w-12 h-12 rounded-full overflow-hidden mb-2.5 shadow-md">
                          {flag ? (
                            <Image src={flag} alt={countryName} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#3d2e20]/5">
                              <Globe className="w-6 h-6 text-[#3d2e20]/30" />
                            </div>
                          )}
                        </div>
                        <span className="font-bold text-xs text-center leading-tight">{localizedName}</span>
                        {isSelected && (
                          <div className="absolute top-2 end-2 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow">
                            <Check className="w-3 h-3 text-[#3d2e20]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
              {errors.country && (
                <p className={`text-red-500 text-xs font-semibold ${isAr ? "text-right" : "text-left"}`}>{errors.country}</p>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className={`flex gap-3 mt-8 ${isAr ? "flex-row-reverse" : ""}`}>
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              style={{ background: "rgba(61,46,32,0.08)", color: "#3d2e20" }}
              suppressHydrationWarning
            >
              {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{step === 1 ? (isAr ? "تسجيل الدخول" : "Login") : dict.back}</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="flex-[2] py-3.5 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
              style={{
                background: "linear-gradient(135deg, #3d2e20, #523e2b)",
                color: "white",
                boxShadow: "0 6px 20px rgba(61,46,32,0.25)",
              }}
              suppressHydrationWarning
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>
                    {loading || isValidating
                      ? <Loader2 className="w-5 h-5 animate-spin" />
                      : (step === TOTAL_STEPS ? dict.confirm : dict.next)}
                  </span>
                  {!loading && !isValidating && (isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />)}
                </>
              )}
            </button>
          </div>

          {/* Mobile login link */}
          <p className={`lg:hidden mt-6 text-xs text-[#3d2e20]/65 font-medium ${isAr ? "text-right" : "text-left"}`}>
            {isAr ? "لديك حساب؟" : "Have an account?"}{" "}
            <Link href={`/${locale}/auth/login`} className="font-bold text-[#3d2e20] hover:underline underline-offset-4">
              {isAr ? "سجّل دخولك" : "Sign in"}
            </Link>
          </p>
        </div>
        </div>
      </div>
    </main>
  );
}
