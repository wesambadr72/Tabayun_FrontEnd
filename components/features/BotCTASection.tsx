"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Bot, CheckCircle2, Send, Sparkles } from "lucide-react";
import { PrimaryButton, SurfaceCard } from "@/components/ui/tabayun";

export default function BotCTASection() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "ar";
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  return (
    <section className="w-full bg-tabayun-paper py-20 md:py-28" dir={dir}>
      <div className="tabayun-container">
        <SurfaceCard dark className="p-7 md:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[28px] border border-white/10 bg-white/7 p-5">
              <div className="rounded-[24px] bg-tabayun-paper p-5 text-tabayun-coffee">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tabayun-coffee text-tabayun-paper">
                      <Bot className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="text-lg font-black">{isAr ? "مساعد تباين" : "Tabayun Assistant"}</p>
                      <p className="text-xs font-bold text-tabayun-coffee/45">{isAr ? "متصل الآن" : "Online now"}</p>
                    </div>
                  </div>
                  <span className="h-2.5 w-2.5 rounded-full bg-tabayun-success" />
                </div>
                <div className="space-y-3">
                  <div className="max-w-[86%] rounded-3xl rounded-tl-md bg-tabayun-sand/58 p-4 text-sm font-semibold leading-relaxed">
                    {isAr
                      ? "هل حمل رخصة القيادة الدولية كافٍ داخل السعودية؟"
                      : "Is an international driving permit enough in Saudi Arabia?"}
                  </div>
                  <div className="ms-auto max-w-[90%] rounded-3xl rounded-tr-md bg-tabayun-coffee p-4 text-sm font-semibold leading-relaxed text-tabayun-paper">
                    {isAr
                      ? "يعتمد على مدة الزيارة ونوع الرخصة. سأعرض لك الخلاصة والمصدر والخطوة الآمنة."
                      : "It depends on visit duration and license type. I can show the summary, source, and safest next step."}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-black text-tabayun-paper/78">
                <Sparkles className="h-4 w-4 text-tabayun-gold" />
                {isAr ? "إجابات مختصرة قابلة للتصرف" : "Action-ready short answers"}
              </div>
              <div className="space-y-4">
                <h2 className="text-balance text-4xl font-black leading-tight md:text-6xl">
                  {isAr ? "اسأل قبل أن تتصرف" : "Ask before you act"}
                </h2>
                <p className="max-w-2xl text-base font-semibold leading-relaxed text-tabayun-paper/62 md:text-lg">
                  {isAr
                    ? "المساعد الذكي يختصر الأنظمة، يقارنها ببلد السائح، ويبرز التحذيرات المهمة دون إرباك."
                    : "The AI assistant summarizes regulations, compares them with a visitor's country, and surfaces important warnings without clutter."}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[isAr ? "مصدر واضح" : "Clear source", isAr ? "تحذير فوري" : "Instant warning", isAr ? "خطوة تالية" : "Next step"].map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-2xl bg-white/8 px-4 py-3 text-sm font-black text-tabayun-paper/76">
                    <CheckCircle2 className="h-4 w-4 text-tabayun-gold" />
                    {item}
                  </div>
                ))}
              </div>
              <PrimaryButton onClick={() => router.push(`/${locale}/chat`)} locale={locale} className="min-h-14 bg-tabayun-paper px-7 text-base text-tabayun-coffee hover:bg-white">
                <Send className="h-4 w-4" />
                {isAr ? "ابدأ المحادثة الآن" : "Start chatting now"}
              </PrimaryButton>
            </div>
          </div>
        </SurfaceCard>
      </div>
    </section>
  );
}
