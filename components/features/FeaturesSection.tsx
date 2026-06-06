"use client";

import React from "react";
import { AlertTriangle, FileSearch, Globe, Search, ShieldCheck, Zap } from "lucide-react";
import ar from "../../locales/ar/common.json";
import en from "../../locales/en/common.json";
import { useParams } from "next/navigation";
import { SectionHeader, StatusBadge, SurfaceCard } from "@/components/ui/tabayun";

const dictionaries = { ar, en };

export default function FeaturesSection() {
  const params = useParams();
  const locale = (params.locale as string) || "ar";
  const dict = (dictionaries[locale as keyof typeof dictionaries] || ar);
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const features = [
    { icon: Search, title: dict.features.items.easy, desc: dict.features.items.easyDesc, tone: "info" as const },
    { icon: Globe, title: dict.features.items.compare, desc: dict.features.items.compareDesc, tone: "warning" as const },
    { icon: FileSearch, title: dict.features.items.visual, desc: dict.features.items.visualDesc, tone: "neutral" as const },
    { icon: Zap, title: dict.features.items.fast, desc: dict.features.items.fastDesc, tone: "success" as const },
  ];

  return (
    <section className="w-full bg-tabayun-pearl py-20 md:py-28" dir={dir}>
      <div className="tabayun-container">
        <SectionHeader
          eyebrow={isAr ? "القدرات الأساسية" : "Core capabilities"}
          icon={<ShieldCheck className="h-4 w-4" />}
          title={dict.features.title}
          description={isAr ? "تجربة قانونية منظمة للسائح: بحث، مقارنة، تنبيه، وخلاصة قابلة للتصرف." : "A structured legal experience for visitors: search, compare, warning, and action-ready summaries."}
          className="mb-12"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <SurfaceCard key={feature.title} className="p-6" interactive>
                <div className="flex h-full flex-col">
                  <div className="mb-7 flex items-center justify-between gap-3">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-tabayun-sand/50 text-tabayun-coffee">
                      <Icon className="h-6 w-6" strokeWidth={1.7} />
                    </span>
                    <StatusBadge tone={feature.tone}>
                      {isAr ? "مفيد للسائح" : "Visitor ready"}
                    </StatusBadge>
                  </div>
                  <h3 className="text-xl font-black text-tabayun-coffee">{feature.title}</h3>
                  <p className="mt-3 text-sm font-semibold leading-relaxed text-tabayun-coffee/60">{feature.desc}</p>
                </div>
              </SurfaceCard>
            );
          })}
        </div>

        <SurfaceCard dark className="mt-5 p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-tabayun-gold/18 text-tabayun-gold">
                <AlertTriangle className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-2xl font-black">
                  {isAr ? "التنبيه أهم من كثرة المعلومات" : "Warnings matter more than volume"}
                </h3>
                <p className="mt-2 max-w-3xl text-sm font-semibold leading-relaxed text-tabayun-paper/60">
                  {isAr
                    ? "تصميم تباين يبرز ما يحتاج السائح معرفته فوراً: المخاطر، الاستثناءات، والخطوة التالية."
                    : "Tabayun surfaces what visitors need immediately: risks, exceptions, and the next step."}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge tone="warning" className="border-white/12 bg-white/10 text-tabayun-paper">
                {isAr ? "تحذير" : "Warning"}
              </StatusBadge>
              <StatusBadge tone="danger" className="border-white/12 bg-white/10 text-tabayun-paper">
                {isAr ? "ممنوع" : "Restricted"}
              </StatusBadge>
            </div>
          </div>
        </SurfaceCard>
      </div>
    </section>
  );
}
