"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, ArrowRight, Bell, CheckCircle2, ShieldAlert } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PageShell, PrimaryButton, SectionHeader, StatePanel, StatusBadge, SurfaceCard } from "@/components/ui/tabayun";

export default function NotificationsPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "ar";
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const sampleAlertTypes = [
    {
      icon: ShieldAlert,
      title: isAr ? "تحديثات الأنظمة" : "Regulation updates",
      desc: isAr ? "إشعار عند تحديث قانون أو فئة تتابعها." : "Get notified when a followed law or category changes.",
      tone: "warning" as const,
    },
    {
      icon: AlertTriangle,
      title: isAr ? "تحذيرات مهمة" : "Important warnings",
      desc: isAr ? "تنبيهات مختصرة للسلوكيات عالية المخاطر." : "Short alerts for higher-risk behaviors.",
      tone: "danger" as const,
    },
    {
      icon: CheckCircle2,
      title: isAr ? "توصيات الرحلة" : "Trip recommendations",
      desc: isAr ? "ملاحظات مفيدة حسب بلدك والفئات التي تهمك." : "Helpful notes based on your country and interests.",
      tone: "success" as const,
    },
  ];

  return (
    <PageShell dir={dir}>
      <Navbar />

      <section className="tabayun-page-offset pb-16">
        <div className="tabayun-container">
          <button
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-black text-tabayun-coffee/55 transition hover:bg-tabayun-sand/45 hover:text-tabayun-coffee"
          >
            {isAr ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            {isAr ? "العودة" : "Back"}
          </button>

          <SectionHeader
            eyebrow={isAr ? "مركز التنبيهات" : "Alert center"}
            icon={<Bell className="h-4 w-4" />}
            title={isAr ? "تنبيهات قانونية منظمة" : "Organized legal alerts"}
            description={isAr ? "هنا تظهر التحديثات والتحذيرات المهمة التي تساعدك تتجنب الالتباس أثناء رحلتك." : "Updates and important warnings appear here to help you avoid confusion during your visit."}
            className="mb-10"
          />

          <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
            <StatePanel
              title={isAr ? "لا توجد إشعارات حالياً" : "No notifications yet"}
              description={isAr ? "عند وجود تحديثات أو تحذيرات مهمة ستظهر هنا بوضوح مع مستوى الأهمية." : "When important updates or warnings exist, they will appear here with clear priority."}
              action={isAr ? "تصفح الفئات" : "Browse categories"}
              onAction={() => router.push(`/${locale}/categories`)}
              locale={locale}
            />

            <SurfaceCard className="p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-tabayun-sand/52 text-tabayun-coffee">
                  <Bell className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-black text-tabayun-clay/65">{isAr ? "أنواع التنبيهات" : "Alert types"}</p>
                  <h2 className="text-xl font-black text-tabayun-coffee">{isAr ? "ماذا سيصلك؟" : "What you will receive"}</h2>
                </div>
              </div>

              <div className="space-y-3">
                {sampleAlertTypes.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-3xl bg-tabayun-sand/30 p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <Icon className="h-5 w-5 text-tabayun-coffee" />
                        <StatusBadge tone={item.tone}>{isAr ? "تنبيه" : "Alert"}</StatusBadge>
                      </div>
                      <h3 className="font-black text-tabayun-coffee">{item.title}</h3>
                      <p className="mt-1 text-sm font-semibold leading-relaxed text-tabayun-coffee/58">{item.desc}</p>
                    </div>
                  );
                })}
              </div>

              <PrimaryButton href={`/${locale}/profile`} variant="secondary" locale={locale} className="mt-5 w-full">
                {isAr ? "إدارة الملف الشخصي" : "Manage profile"}
              </PrimaryButton>
            </SurfaceCard>
          </div>
        </div>
      </section>

      <Footer />
    </PageShell>
  );
}
