"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Globe2, Scale, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import { CountUp } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

type Locale = "ar" | "en" | string;

export function AuthShell({
  locale,
  mode,
  children,
  title,
  description,
  mobileAccessory,
}: {
  locale: Locale;
  mode: "login" | "register";
  children: React.ReactNode;
  title: string;
  description: string;
  mobileAccessory?: React.ReactNode;
}) {
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";
  const stats = [
    { value: 100, prefix: "+", label: isAr ? "نظام وقانون" : "laws and regulations" },
    { value: 24, suffix: "/7", label: isAr ? "مساعد ذكي" : "AI assistant" },
  ];

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-tabayun-paper text-tabayun-coffee" dir={dir}>
      <div className="absolute inset-0">
        <Image
          src="/image/tabayun-hero.png"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-[0.16] lg:opacity-[0.32]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,252,246,0.9),rgba(246,241,231,0.84)_42%,rgba(232,221,201,0.7)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[46%] bg-[linear-gradient(180deg,rgba(246,241,231,0),rgba(246,241,231,0.92))]" />
      </div>

      <div className="relative z-10 grid min-h-[100svh] lg:grid-cols-[minmax(0,0.96fr)_minmax(430px,0.64fr)]">
        <aside className="auth-side-in relative hidden min-h-[100svh] overflow-hidden p-10 text-tabayun-paper lg:flex lg:flex-col lg:justify-between xl:p-12">
          <Image src="/image/saudi.png" alt="" fill className="object-cover" sizes="50vw" />
          <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(44,22,15,0.96),rgba(44,22,15,0.82)_50%,rgba(44,22,15,0.58))]" />
          <div className="absolute -bottom-28 -start-28 h-80 w-80 rounded-full border-[58px] border-tabayun-gold/12" />
          <div className="absolute -end-24 top-14 h-72 w-72 rounded-full bg-tabayun-gold/10 blur-[90px]" />
          <div className="absolute inset-x-10 bottom-0 h-px bg-gradient-to-r from-transparent via-tabayun-gold/35 to-transparent" />

          <Link href={`/${locale}`} className="relative z-10 inline-flex w-fit items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-tabayun-gold/24 bg-tabayun-gold/12 text-tabayun-gold shadow-[0_18px_44px_rgba(0,0,0,0.18)]">
              <Scale className="h-6 w-6" />
            </span>
            <span className="text-2xl font-black">{isAr ? "تباين" : "Tabayun"}</span>
          </Link>

          <div className="relative z-10 max-w-xl space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-black text-tabayun-paper/76 backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-tabayun-gold" />
              {mode === "login"
                ? isAr
                  ? "عودة آمنة إلى تجربتك القانونية"
                  : "A secure return to your legal guide"
                : isAr
                ? "بداية منظمة للسائح داخل السعودية"
                : "A structured start for visitors in Saudi Arabia"}
            </div>
            <div>
              <h2 className="max-w-[12ch] text-balance text-5xl font-black leading-[0.95] xl:text-7xl">
                {title}
              </h2>
              <p className="mt-5 max-w-lg text-base font-semibold leading-relaxed text-tabayun-paper/64 xl:text-lg">
                {description}
              </p>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-[26px] border border-white/10 bg-white/8 p-5 backdrop-blur-md">
                <p className="text-3xl font-black">
                  <CountUp end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-xs font-bold text-tabayun-paper/48">{stat.label}</p>
              </div>
            ))}
          </div>
        </aside>

        <section className="relative flex min-h-[100svh] items-center justify-center px-4 py-5 sm:px-6 sm:py-10 lg:px-8">
          <div className="auth-panel-in w-full max-w-[31rem]">
            <div className="mb-5 flex items-center justify-between lg:hidden">
              <Link href={`/${locale}`} className="inline-flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-tabayun-coffee text-tabayun-paper shadow-[0_16px_36px_rgba(44,22,15,0.18)]">
                  <Scale className="h-5 w-5" />
                </span>
                <span className="text-2xl font-black">{isAr ? "تباين" : "Tabayun"}</span>
              </Link>
              {mobileAccessory}
            </div>

            <div className="relative overflow-hidden rounded-[34px] border border-white/70 bg-[#fbf8f2]/82 p-5 shadow-[0_28px_90px_rgba(44,22,15,0.14)] backdrop-blur-2xl sm:p-7">
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-[linear-gradient(180deg,rgba(255,255,255,0),rgba(232,221,201,0.34))]" />
              <div className="pointer-events-none absolute -end-20 -top-24 h-56 w-56 rounded-full bg-tabayun-gold/15 blur-[60px]" />
              <div className="relative z-10">{children}</div>
            </div>

            <div className="mt-4 hidden items-center justify-center gap-3 text-xs font-black text-tabayun-coffee/52 sm:flex">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-tabayun-gold" />
                {isAr ? "واجهة آمنة" : "Secure access"}
              </span>
              <span className="h-1 w-1 rounded-full bg-tabayun-coffee/20" />
              <span className="inline-flex items-center gap-1.5">
                <Globe2 className="h-4 w-4 text-tabayun-gold" />
                {isAr ? "ثنائي اللغة" : "Bilingual"}
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export function AuthHeader({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-7 space-y-3 text-start", className)}>
      {eyebrow && (
        <span className="inline-flex rounded-full border border-tabayun-sand bg-white/55 px-3 py-1.5 text-xs font-black text-tabayun-coffee/58">
          {eyebrow}
        </span>
      )}
      <div>
        <h1 className="text-balance text-4xl font-black leading-tight text-tabayun-coffee sm:text-5xl">{title}</h1>
        <p className="mt-2 text-sm font-bold leading-relaxed text-tabayun-coffee/55 sm:text-base">{description}</p>
      </div>
    </div>
  );
}

export function AuthTextField({
  label,
  icon: Icon,
  error,
  trailing,
  labelAction,
  className,
  inputClassName,
  ...inputProps
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: LucideIcon;
  error?: string;
  trailing?: React.ReactNode;
  labelAction?: React.ReactNode;
  inputClassName?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-3">
        <label className="block text-start text-xs font-black text-tabayun-coffee/68">{label}</label>
        {labelAction}
      </div>
      <div
        className={cn(
          "group relative overflow-hidden rounded-[22px] border bg-white/64 shadow-[0_12px_32px_rgba(44,22,15,0.06)] transition duration-300 focus-within:border-tabayun-coffee/38 focus-within:bg-white focus-within:shadow-[0_18px_44px_rgba(44,22,15,0.11)]",
          error ? "border-red-300" : "border-white/80"
        )}
      >
        <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4 text-tabayun-coffee/35 transition group-focus-within:text-tabayun-coffee">
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </span>
        <input
          {...inputProps}
          className={cn(
            "min-h-14 w-full bg-transparent py-3 ps-12 text-sm font-black text-tabayun-coffee outline-none placeholder:text-tabayun-coffee/28",
            trailing ? "pe-12" : "pe-4",
            inputClassName
          )}
        />
        {trailing}
      </div>
      {error && <p className="px-1 text-start text-xs font-bold text-red-600">{error}</p>}
    </div>
  );
}

export function AuthPrimaryButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[22px] bg-tabayun-coffee px-6 text-sm font-black text-tabayun-paper shadow-[0_18px_44px_rgba(44,22,15,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(44,22,15,0.28)] active:translate-y-0 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-55",
        className
      )}
    >
      {children}
    </button>
  );
}
