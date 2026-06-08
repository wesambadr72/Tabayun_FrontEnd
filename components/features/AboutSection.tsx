"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { CheckCircle2, Globe2, Landmark, Scale } from "lucide-react";
import ar from "../../locales/ar/common.json";
import en from "../../locales/en/common.json";
import { SectionHeader, StatusBadge, SurfaceCard } from "@/components/ui/tabayun";
import { lawService } from "@/services/lawService";

const dictionaries = { ar, en };

export default function AboutSection() {
  const params = useParams();
  const locale = (params.locale as string) || "ar";
  const dict = (dictionaries[locale as keyof typeof dictionaries] || ar);
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const [totalLaws, setTotalLaws] = useState<number | string>("100+");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await lawService.getStats();
        if (stats && stats.total_laws) {
          setTotalLaws(stats.total_laws);
        }
      } catch (error) {
        console.error("Failed to fetch law stats:", error);
      }
    };
    fetchStats();
  }, []);

  const points = [
    {
      icon: Landmark,
      title: isAr ? "موثوق ومبسط" : "Trusted and simple",
      desc: isAr ? "نحوّل النص القانوني إلى خلاصة عملية للسائح." : "We translate legal text into practical visitor guidance.",
    },
    {
      icon: Globe2,
      title: isAr ? "مقارنة حسب البلد" : "Country-aware comparison",
      desc: isAr ? "تظهر الفروقات المهمة بين بلد المستخدم والسعودية." : "Highlights key differences between Saudi Arabia and the visitor's country.",
    },
    {
      icon: CheckCircle2,
      title: isAr ? "قرار أسرع" : "Faster decisions",
      desc: isAr ? "مسموح، ممنوع، تنبيه، أو تحقق من التفاصيل." : "Allowed, restricted, warning, or check details.",
    },
  ];

  return (
    <section id="about-section" className="w-full bg-tabayun-paper py-20 md:py-28" dir={dir}>
      <div className="tabayun-container">
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative order-2 lg:order-1">
            <SurfaceCard className="overflow-hidden p-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[24px]">
                <Image
                  src="/image/saudi.png"
                  alt={isAr ? "ضيافة سعودية للسياح" : "Saudi hospitality for visitors"}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 42vw, 100vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,26,23,0.02)_0%,rgba(31,26,23,0.62)_100%)]" />
                <div className="absolute bottom-4 inset-x-4 rounded-3xl border border-white/16 bg-tabayun-ink/72 p-4 text-tabayun-paper backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-tabayun-paper/12">
                      <Scale className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xl font-black">{totalLaws}{typeof totalLaws === 'number' ? '' : ''}</p>
                      <p className="text-xs font-bold text-tabayun-paper/58">
                        {isAr ? "قانون ونظام قابل للمقارنة" : "Comparable laws and regulations"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SurfaceCard>
          </div>

          <div className="order-1 space-y-8 lg:order-2">
            <SectionHeader
              align="start"
              eyebrow={isAr ? "عن تباين" : "About Tabayun"}
              icon={<Scale className="h-4 w-4" />}
              title={isAr ? "وضوح قانوني للسائح بدون تعقيد" : "Legal clarity for visitors without friction"}
              description={dict.about.description}
            />

            <div className="grid gap-3">
              {points.map((point) => {
                const Icon = point.icon;
                return (
                  <SurfaceCard key={point.title} className="p-5" interactive>
                    <div className="flex gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-tabayun-sand/48 text-tabayun-coffee">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-lg font-black text-tabayun-coffee">{point.title}</h3>
                        <p className="mt-1 text-sm font-semibold leading-relaxed text-tabayun-coffee/58">{point.desc}</p>
                      </div>
                    </div>
                  </SurfaceCard>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusBadge tone="success">{isAr ? "مسموح" : "Allowed"}</StatusBadge>
              <StatusBadge tone="danger">{isAr ? "ممنوع" : "Restricted"}</StatusBadge>
              <StatusBadge tone="warning">{isAr ? "قد يختلف حسب الحالة" : "May vary by case"}</StatusBadge>
              <StatusBadge tone="info">{isAr ? "تحقق من التفاصيل" : "Check details"}</StatusBadge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
