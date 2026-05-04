"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Globe,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { AuthHeader, AuthPrimaryButton, AuthShell, AuthTextField } from "@/components/auth/AuthLayout";
import { authService } from "@/services/authService";
import { lawService } from "@/services/lawService";
import ar from "../../../../locales/ar/common.json";
import en from "../../../../locales/en/common.json";

const dictionaries = { ar, en };
const TOTAL_STEPS = 5;

export default function RegisterPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "ar";
  const dict = (dictionaries[locale as keyof typeof dictionaries] || ar).auth.register;
  const isAr = locale === "ar";

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isValidating, setIsValidating] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    repeatPassword: "",
    country: "",
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true);
        const data = await lawService.getAvailableCountries();
        setAvailableCountries(
          data.filter(
            (country: string) =>
              !["saudi arabia", "السعودية", "المملكة العربية السعودية"].includes(country.toLowerCase())
          )
        );
      } catch {
        setAvailableCountries([]);
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  const stepsMeta = useMemo(
    () => [
      {
        icon: Mail,
        label: isAr ? "البريد" : "Email",
        title: isAr ? "ابدأ ببريدك الإلكتروني" : "Start with your email",
        question: dict.emailQuestion || (isAr ? "سنستخدمه لتسجيل الدخول والتنبيهات المهمة." : "We will use it for sign-in and important alerts."),
        placeholder: dict.emailPlaceholder || "example@email.com",
      },
      {
        icon: User,
        label: isAr ? "الاسم" : "Name",
        title: isAr ? "كيف نخاطبك؟" : "What should we call you?",
        question: dict.nameQuestion || (isAr ? "اكتب اسمك كما تفضل ظهوره داخل تباين." : "Enter the name you prefer inside Tabayun."),
        placeholder: dict.namePlaceholder || (isAr ? "اسمك الكامل" : "Full name"),
      },
      {
        icon: Lock,
        label: isAr ? "كلمة المرور" : "Password",
        title: isAr ? "أنشئ كلمة مرور قوية" : "Create a strong password",
        question: dict.passwordQuestion || (isAr ? "اختر كلمة مرور تحمي حسابك ومعلوماتك." : "Choose a password that protects your account."),
        placeholder: dict.passwordPlaceholder || "••••••••",
      },
      {
        icon: Lock,
        label: isAr ? "التأكيد" : "Confirm",
        title: isAr ? "أكد كلمة المرور" : "Confirm your password",
        question: dict.repeatPasswordQuestion || (isAr ? "أعد كتابة كلمة المرور للتأكد من صحتها." : "Re-enter your password to confirm it."),
        placeholder: dict.repeatPasswordPlaceholder || "••••••••",
      },
      {
        icon: Globe,
        label: isAr ? "الدولة" : "Country",
        title: isAr ? "اختر بلدك" : "Choose your country",
        question: dict.compareQuestion || (isAr ? "سنقارن قوانين السعودية مع قوانين بلدك." : "We will compare Saudi laws with your country's rules."),
        placeholder: "",
      },
    ],
    [dict, isAr]
  );

  const currentMeta = stepsMeta[step - 1];
  const StepIcon = currentMeta.icon;

  const passwordChecks = [
    { pass: formData.password.length >= 8, label: isAr ? "8 خانات على الأقل" : "At least 8 characters" },
    { pass: /[A-Z]/.test(formData.password), label: isAr ? "حرف كبير" : "Uppercase letter" },
    { pass: /[a-z]/.test(formData.password), label: isAr ? "حرف صغير" : "Lowercase letter" },
    { pass: /[0-9]/.test(formData.password), label: isAr ? "رقم" : "Number" },
    { pass: /[!@#$%^&*]/.test(formData.password), label: isAr ? "رمز خاص" : "Special character" },
  ];

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    if (errors[event.target.name]) setErrors({ ...errors, [event.target.name]: "" });
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

  const validateStep = async (targetStep: number) => {
    const nextErrors: { [key: string]: string } = {};

    if (targetStep === 1) {
      if (!formData.email) {
        nextErrors.email = isAr ? "البريد الإلكتروني مطلوب" : "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        nextErrors.email = isAr ? "البريد غير صالح" : "Invalid email";
      } else {
        try {
          setIsValidating(true);
          const response = await authService.checkEmail(formData.email);
          if (!response.available) {
            nextErrors.email = isAr ? "هذا البريد مسجل مسبقاً" : "This email is already registered";
          }
        } catch (error) {
          console.error("Email check failed", error);
        } finally {
          setIsValidating(false);
        }
      }
    }

    if (targetStep === 2) {
      if (!formData.name) nextErrors.name = isAr ? "الاسم مطلوب" : "Name is required";
      else if (formData.name.length < 3) nextErrors.name = isAr ? "الاسم يجب أن يكون 3 أحرف على الأقل" : "At least 3 characters";
    }

    if (targetStep === 3) {
      if (!formData.password) nextErrors.password = isAr ? "كلمة المرور مطلوبة" : "Password is required";
      else if (passwordChecks.some((item) => !item.pass)) nextErrors.password = isAr ? "كلمة المرور لا تحقق الشروط" : "Password does not meet the requirements";
    }

    if (targetStep === 4) {
      if (!formData.repeatPassword) nextErrors.repeatPassword = isAr ? "يرجى تأكيد كلمة المرور" : "Confirm password";
      else if (formData.repeatPassword !== formData.password) nextErrors.repeatPassword = isAr ? "كلمتا المرور غير متطابقتين" : "Passwords do not match";
    }

    if (targetStep === 5 && !formData.country) {
      nextErrors.country = isAr ? "اختر دولتك" : "Select your country";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
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
    } catch (error: any) {
      setErrors({ general: error.message || (isAr ? "حدث خطأ ما" : "Something went wrong") });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(step);
    if (!isValid) return;
    if (step < TOTAL_STEPS) {
      setStep((current) => current + 1);
      return;
    }
    await handleSubmit();
  };

  const handleBack = () => {
    if (step === 1) router.push(`/${locale}/auth/login`);
    else setStep((current) => current - 1);
  };

  return (
    <AuthShell
      locale={locale}
      mode="register"
      title={isAr ? "ابدأ رحلتك بثقة" : "Start with confidence"}
      description={
        isAr
          ? "حسابك في تباين يربط بلدك بتجربة قانونية مبسطة داخل المملكة."
          : "Your Tabayun account connects your country to a simplified legal experience in Saudi Arabia."
      }
      mobileAccessory={
        <div className="flex items-center gap-1.5" dir="ltr">
          {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
            <span
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index + 1 <= step ? "bg-tabayun-coffee" : "bg-tabayun-coffee/15"
              }`}
              style={{ width: index + 1 === step ? 22 : 8 }}
            />
          ))}
        </div>
      }
    >
      <AuthHeader
        eyebrow={isAr ? `الخطوة ${step} من ${TOTAL_STEPS}` : `Step ${step} of ${TOTAL_STEPS}`}
        title={currentMeta.title}
        description={currentMeta.question}
        className="mb-6"
      />

      <div className="mb-6 hidden gap-2 sm:grid sm:grid-cols-5">
        {stepsMeta.map((item, index) => {
          const active = index + 1 === step;
          const done = index + 1 < step;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                if (index + 1 < step) setStep(index + 1);
              }}
              className={`rounded-2xl px-2 py-3 text-center text-[11px] font-black transition ${
                active
                  ? "bg-tabayun-coffee text-tabayun-paper shadow-[0_12px_28px_rgba(44,22,15,0.16)]"
                  : done
                  ? "bg-tabayun-sand/70 text-tabayun-coffee"
                  : "bg-white/55 text-tabayun-coffee/38"
              }`}
            >
              {done ? <Check className="mx-auto mb-1 h-4 w-4" /> : <item.icon className="mx-auto mb-1 h-4 w-4" />}
              {item.label}
            </button>
          );
        })}
      </div>

      {errors.general && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {errors.general}
        </div>
      )}

      <div key={step} className="auth-step-in min-h-[13rem]">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-tabayun-coffee text-tabayun-paper shadow-[0_12px_30px_rgba(44,22,15,0.18)]">
          <StepIcon className="h-6 w-6" />
        </div>

        {step === 1 && (
          <AuthTextField
            label={isAr ? "البريد الإلكتروني" : "Email"}
            icon={Mail}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={currentMeta.placeholder}
            error={errors.email}
            dir="ltr"
            autoComplete="email"
            autoFocus
          />
        )}

        {step === 2 && (
          <AuthTextField
            label={isAr ? "الاسم" : "Name"}
            icon={User}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={currentMeta.placeholder}
            error={errors.name}
            autoComplete="name"
            autoFocus
          />
        )}

        {step === 3 && (
          <div className="space-y-4">
            <AuthTextField
              label={isAr ? "كلمة المرور" : "Password"}
              icon={Lock}
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={currentMeta.placeholder}
              error={errors.password}
              autoComplete="new-password"
              autoFocus
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
            <div className="grid grid-cols-2 gap-2">
              {passwordChecks.map((item) => (
                <span
                  key={item.label}
                  className={`inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-black ${
                    item.pass ? "bg-tabayun-success/10 text-tabayun-success" : "bg-tabayun-sand/50 text-tabayun-coffee/48"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <AuthTextField
              label={isAr ? "تأكيد كلمة المرور" : "Confirm password"}
              icon={Lock}
              type="password"
              name="repeatPassword"
              value={formData.repeatPassword}
              onChange={handleChange}
              placeholder={currentMeta.placeholder}
              error={errors.repeatPassword}
              autoComplete="new-password"
              autoFocus
            />
            {formData.repeatPassword && (
              <div
                className={`rounded-2xl px-4 py-3 text-sm font-black ${
                  formData.repeatPassword === formData.password ? "bg-tabayun-success/10 text-tabayun-success" : "bg-red-50 text-red-600"
                }`}
              >
                {formData.repeatPassword === formData.password
                  ? isAr
                    ? "كلمتا المرور متطابقتان"
                    : "Passwords match"
                  : isAr
                  ? "كلمتا المرور غير متطابقتين"
                  : "Passwords do not match"}
              </div>
            )}
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            {loadingCountries ? (
              <div className="flex min-h-40 items-center justify-center rounded-[26px] bg-white/50">
                <Loader2 className="h-8 w-8 animate-spin text-tabayun-coffee" />
              </div>
            ) : availableCountries.length > 0 ? (
              <div className="grid max-h-[18rem] grid-cols-2 gap-3 overflow-y-auto pe-1 sm:grid-cols-3">
                {availableCountries.map((countryName) => {
                  const flag = getFlagPath(countryName);
                  const localizedName = getLocalizedCountryName(countryName);
                  const selected = formData.country === countryName;
                  return (
                    <button
                      key={countryName}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, country: countryName });
                        if (errors.country) setErrors({ ...errors, country: "" });
                      }}
                      className={`relative rounded-[24px] border p-4 text-center transition duration-300 hover:-translate-y-0.5 ${
                        selected
                          ? "border-tabayun-coffee bg-tabayun-coffee text-tabayun-paper shadow-[0_16px_34px_rgba(44,22,15,0.18)]"
                          : "border-white/80 bg-white/62 text-tabayun-coffee hover:bg-white"
                      }`}
                    >
                      <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-tabayun-sand/50">
                        {flag ? (
                          <Image src={flag} alt={countryName} width={48} height={48} className="h-full w-full object-cover" />
                        ) : (
                          <Globe className="h-6 w-6 opacity-45" />
                        )}
                      </span>
                      <span className="block text-xs font-black leading-snug">{localizedName}</span>
                      {selected && (
                        <span className="absolute end-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-tabayun-paper text-tabayun-coffee">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[26px] bg-white/62 p-6 text-center text-sm font-bold leading-relaxed text-tabayun-coffee/55">
                {isAr ? "لا توجد دول متاحة حالياً. حاول لاحقاً." : "No countries are available right now. Please try again later."}
              </div>
            )}
            {errors.country && <p className="px-1 text-start text-xs font-bold text-red-600">{errors.country}</p>}
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-[0.85fr_1.35fr] gap-3">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[22px] bg-tabayun-sand/55 px-4 text-sm font-black text-tabayun-coffee transition hover:bg-tabayun-sand active:scale-[0.99]"
        >
          {isAr ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          <span>{step === 1 ? (isAr ? "الدخول" : "Login") : dict.back || (isAr ? "رجوع" : "Back")}</span>
        </button>

        <AuthPrimaryButton type="button" onClick={handleNext} disabled={loading || isValidating}>
          {loading || isValidating ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <span>{step === TOTAL_STEPS ? dict.confirm || (isAr ? "إنشاء الحساب" : "Create account") : dict.next || (isAr ? "التالي" : "Next")}</span>
              {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </>
          )}
        </AuthPrimaryButton>
      </div>

      <p className="mt-7 text-center text-sm font-bold text-tabayun-coffee/62">
        {isAr ? "لديك حساب؟" : "Have an account?"}{" "}
        <Link href={`/${locale}/auth/login`} className="font-black text-tabayun-coffee underline-offset-4 hover:underline">
          {isAr ? "سجّل دخولك" : "Sign in"}
        </Link>
      </p>
    </AuthShell>
  );
}
