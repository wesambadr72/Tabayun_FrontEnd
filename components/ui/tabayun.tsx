"use client";

import React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Info,
  Loader2,
  Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { kashidaTitle } from "@/lib/typography";

type Locale = "ar" | "en" | string;

export function BrandMark({
  locale = "ar",
  compact = false,
  inverted = false,
  className,
}: {
  locale?: Locale;
  compact?: boolean;
  inverted?: boolean;
  className?: string;
}) {
  const isAr = locale === "ar";

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <span
        className={cn(
          "flex items-center justify-center rounded-[18px] shadow-[0_14px_34px_rgba(44,22,15,0.14)]",
          compact ? "h-10 w-10" : "h-12 w-12",
          inverted ? "bg-tabayun-paper text-tabayun-coffee" : "bg-tabayun-coffee text-tabayun-paper"
        )}
      >
        <Scale className={compact ? "h-5 w-5" : "h-6 w-6"} strokeWidth={1.9} />
      </span>
      {!compact && (
        <span
          className={cn(
            "tabayun-display text-2xl font-black leading-none",
            inverted ? "text-tabayun-paper" : "text-tabayun-coffee"
          )}
        >
          {isAr ? "تبايــن" : "Tabayun"}
        </span>
      )}
    </div>
  );
}

export function PageShell({
  children,
  dir,
  className,
}: {
  children: React.ReactNode;
  dir?: "rtl" | "ltr";
  className?: string;
}) {
  return (
    <main className={cn("tabayun-shell min-h-screen overflow-x-hidden", className)} dir={dir}>
      {children}
    </main>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  icon,
  align = "center",
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  align?: "center" | "start";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "space-y-4",
        align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl text-start",
        className
      )}
    >
      {(eyebrow || icon) && (
        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-tabayun-sand/80 bg-tabayun-pearl/78 px-4 py-2 text-xs font-black text-tabayun-clay shadow-sm",
            align === "center" && "mx-auto"
          )}
        >
          {icon}
          {eyebrow}
        </div>
      )}
      <h1 className="tabayun-display text-balance text-4xl font-black leading-[1.5] text-tabayun-coffee md:text-6xl">
        {typeof title === "string" ? kashidaTitle(title) : title}
      </h1>
      {description && (
        <p className="mx-auto max-w-2xl text-base font-semibold leading-relaxed text-tabayun-coffee/62 md:text-xl">
          {description}
        </p>
      )}
    </div>
  );
}

export function SurfaceCard({
  children,
  className,
  dark = false,
  interactive = false,
}: {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px]",
        dark
          ? "border border-white/10 bg-tabayun-coffee text-tabayun-paper shadow-[0_26px_70px_rgba(31,26,23,0.26)]"
          : "tabayun-card-solid text-tabayun-coffee",
        interactive &&
          "transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(44,22,15,0.14)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function StatusBadge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: "neutral" | "warning" | "danger" | "success" | "info";
  children: React.ReactNode;
  className?: string;
}) {
  const styles = {
    neutral: "bg-tabayun-sand/55 text-tabayun-coffee border-tabayun-sand",
    warning: "bg-tabayun-gold/18 text-tabayun-clay border-tabayun-gold/35",
    danger: "bg-tabayun-danger/10 text-tabayun-danger border-tabayun-danger/20",
    success: "bg-tabayun-success/10 text-tabayun-success border-tabayun-success/20",
    info: "bg-tabayun-info/10 text-tabayun-info border-tabayun-info/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-black",
        styles[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function PrimaryButton({
  children,
  href,
  onClick,
  locale = "ar",
  variant = "primary",
  className,
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  locale?: Locale;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const isAr = locale === "ar";
  const content = (
    <>
      <span>{children}</span>
      {variant === "primary" && (isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />)}
    </>
  );
  const styles = cn(
    "tabayun-focus inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45",
    variant === "primary" &&
      "bg-tabayun-coffee text-tabayun-paper shadow-[0_14px_34px_rgba(44,22,15,0.24)] hover:bg-tabayun-ink",
    variant === "secondary" &&
      "border border-tabayun-sand bg-tabayun-pearl text-tabayun-coffee hover:bg-tabayun-sand/45",
    variant === "ghost" && "text-tabayun-coffee/70 hover:bg-tabayun-sand/45 hover:text-tabayun-coffee",
    className
  );

  if (href) {
    return (
      <Link href={href} className={styles}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={styles}>
      {content}
    </button>
  );
}

export function StatePanel({
  type = "empty",
  title,
  description,
  action,
  onAction,
  locale = "ar",
  className,
}: {
  type?: "empty" | "loading" | "error" | "success" | "warning";
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  onAction?: () => void;
  locale?: Locale;
  className?: string;
}) {
  const Icon =
    type === "loading"
      ? Loader2
      : type === "error"
      ? AlertTriangle
      : type === "success"
      ? CheckCircle2
      : type === "warning"
      ? AlertTriangle
      : Info;

  return (
    <SurfaceCard className={cn("p-10 text-center md:p-14", className)}>
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[24px] bg-tabayun-sand/48 text-tabayun-coffee">
        <Icon className={cn("h-9 w-9", type === "loading" && "animate-spin")} strokeWidth={1.8} />
      </div>
      <h2 className="text-2xl font-black text-tabayun-coffee">{title}</h2>
      {description && (
        <p className="mx-auto mt-3 max-w-md text-base font-semibold leading-relaxed text-tabayun-coffee/58">
          {description}
        </p>
      )}
      {action && (
        <PrimaryButton onClick={onAction} locale={locale} className="mt-7">
          {action}
        </PrimaryButton>
      )}
    </SurfaceCard>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("tabayun-card-solid rounded-[28px] p-6", className)}>
      <div className="animate-pulse space-y-4">
        <div className="h-12 w-12 rounded-2xl bg-tabayun-sand/70" />
        <div className="h-4 w-2/3 rounded-full bg-tabayun-sand/65" />
        <div className="h-3 w-full rounded-full bg-tabayun-sand/45" />
        <div className="h-3 w-4/5 rounded-full bg-tabayun-sand/45" />
      </div>
    </div>
  );
}
