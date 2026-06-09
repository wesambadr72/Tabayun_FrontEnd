"use client";

import React from "react";
import { Globe2, Mail, MessageSquare, Phone, Send } from "lucide-react";
import { PrimaryButton, SectionHeader, StatusBadge, SurfaceCard } from "@/components/ui/tabayun";

interface ContactFormProps {
  dict: any;
  locale: string;
}

export default function ContactForm({ locale }: ContactFormProps) {
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const contactInfo = [
    {
      icon: Mail,
      title: isAr ? "البريد الإلكتروني" : "Email",
      value: "contact@tabayun.sa",
      desc: isAr ? "للاستفسارات العامة والشراكات" : "For general inquiries and partnerships",
    },
    {
      icon: Phone,
      title: isAr ? "خدمة العملاء" : "Customer service",
      value: "+966 50 000 0000",
      desc: isAr ? "قناة دعم مباشرة للمستخدمين" : "Direct support channel for users",
    },
    {
      icon: Globe2,
      title: isAr ? "وسائل التواصل" : "Social media",
      value: "@TabayunSA",
      desc: isAr ? "آخر التحديثات والإعلانات" : "Latest updates and announcements",
    },
  ];

  return (
    <div className="w-full" dir={dir}>
      <SectionHeader
        eyebrow={isAr ? "قنوات التواصل الرسمية" : "Official channels"}
        icon={<MessageSquare className="h-4 w-4" />}
        title={isAr ? "يسعدنا تواصلك" : "We are ready to help"}
        description={
          isAr
            ? "للاستفسارات والشراكات والملاحظات، استخدم إحدى القنوات التالية أو اسأل المساعد الذكي مباشرة."
            : "For inquiries, partnerships, and feedback, use one of the channels below or ask the AI assistant directly."
        }
        className="mb-10"
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {contactInfo.map((info) => {
          const Icon = info.icon;
          return (
            <a
              key={info.title}
              className="group rounded-[30px] border border-tabayun-sand bg-tabayun-pearl p-6 text-center shadow-[0_14px_36px_rgba(44,22,15,0.07)] transition duration-300 hover:-translate-y-1 hover:border-tabayun-gold/60 hover:shadow-[0_26px_70px_rgba(44,22,15,0.14)]"
            >
              <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[22px] bg-tabayun-sand/52 text-tabayun-coffee transition group-hover:bg-tabayun-coffee group-hover:text-tabayun-paper">
                <Icon className="h-7 w-7" />
              </span>
              <h3 className="text-2xl font-black text-tabayun-coffee">{info.title}</h3>
              <p className="mt-3 break-all text-base font-black text-tabayun-clay">{info.value}</p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-tabayun-coffee/55">{info.desc}</p>
            </a>
          );
        })}
      </div>

      <SurfaceCard dark className="mt-8 p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <StatusBadge tone="warning" className="mb-4 border-white/12 bg-white/10 text-tabayun-paper">
              {isAr ? "دعم فوري" : "Instant support"}
            </StatusBadge>
            <h2 className="text-3xl font-black">{isAr ? "هل لديك سؤال عاجل؟" : "Have an urgent question?"}</h2>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-tabayun-paper/58">
              {isAr ? "المساعد الذكي متاح لشرح الأنظمة والمقارنات بسرعة." : "The AI assistant is available to explain regulations and comparisons quickly."}
            </p>
          </div>
          <PrimaryButton href={`/${locale}/chat`} locale={locale} className="bg-tabayun-paper text-tabayun-coffee hover:bg-white">
            <Send className="h-4 w-4" />
            {isAr ? "تحدث مع المساعد" : "Chat with assistant"}
          </PrimaryButton>
        </div>
      </SurfaceCard>
    </div>
  );
}
