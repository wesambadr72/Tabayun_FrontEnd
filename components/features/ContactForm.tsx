"use client";

import React from "react";
import { Mail, Phone, MapPin, Sparkles, Send, Globe } from "lucide-react";

interface ContactFormProps {
  dict: any;
  locale: string;
}

export default function ContactForm({ dict, locale }: ContactFormProps) {
  const dir = locale === "ar" ? "rtl" : "ltr";

  const contactInfo = [
    {
      icon: Mail,
      title: locale === "ar" ? "البريد الإلكتروني" : "Email",
      value: "contact@tabayun.sa",
      link: "mailto:contact@tabayun.sa",
      desc: locale === "ar" ? "تواصل معنا للاستفسارات العامة" : "Contact us for general inquiries"
    },
    {
      icon: Phone,
      title: locale === "ar" ? "الهاتف" : "Phone",
      value: "+966 50 000 0000",
      link: "tel:+966500000000",
      desc: locale === "ar" ? "خدمة العملاء (واتساب/اتصال)" : "Customer Service (WhatsApp/Call)"
    },
    {
      icon: Globe,
      title: locale === "ar" ? "وسائل التواصل" : "Social Media",
      value: "@TabayunSA",
      link: "https://twitter.com/TabayunSA",
      desc: locale === "ar" ? "تابعنا للحصول على آخر التحديثات" : "Follow us for the latest updates"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-12 text-center" dir={dir}>

      {/* Header Section */}
      <div className="space-y-6 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3d2e20]/5 border border-[#3d2e20]/10 text-[#3d2e20] text-sm font-bold">
          <Sparkles className="w-4 h-4" />
          <span>{locale === "ar" ? "قنوات التواصل الرسمية" : "Official Contact Channels"}</span>
        </div>
        <h1 className="text-4xl md:text-7xl font-black text-[#3d2e20] leading-tight">
          {locale === "ar" ? "يسعدنا دائماً تواصلك" : "We are always happy to hear from you"}
        </h1>
        <p className="text-[#3d2e20]/60 text-lg md:text-2xl font-medium leading-relaxed max-w-3xl mx-auto">
          {locale === "ar"
            ? "فريق تباين هنا للإجابة على جميع تساؤلاتك وتلقي اقتراحاتك عبر القنوات التالية:"
            : "Tabayun team is here to answer all your questions and receive your suggestions through the following channels:"}
        </p>
      </div>

      {/* Contact Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200 fill-mode-backwards">
        {contactInfo.map((info, idx) => (
          <a
            key={idx}
            href={info.link}
            className="group relative p-10 bg-white rounded-[2.5rem] border border-[#3d2e20]/5 shadow-xl shadow-[#3d2e20]/5 hover:shadow-2xl hover:border-[#3d2e20]/20 transition-all duration-500 overflow-hidden flex flex-col items-center text-center"
          >
            {/* Hover Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#f5f1eb] to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 space-y-4">
              <div className="w-20 h-20 bg-[#f5f1eb] text-[#3d2e20] rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:bg-[#3d2e20] group-hover:text-white group-hover:rotate-6 transition-all duration-500 shadow-sm mx-auto">
                <info.icon className="w-10 h-10" strokeWidth={1.5} />
              </div>

              <div className="space-y-2">
                <h3 className="font-black text-[#3d2e20] text-2xl md:text-3xl tracking-tight">{info.title}</h3>
                <p className="text-[#3d2e20] font-black text-lg md:text-xl break-all">{info.value}</p>
                <p className="text-[#3d2e20]/40 font-bold text-sm tracking-wide uppercase">{info.desc}</p>
              </div>
            </div>

            {/* Subtle Arrow */}
            <div className="mt-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <div className="bg-[#3d2e20] text-white p-2 rounded-full">
                {locale === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Bottom CTA or Note */}
      <div className="mt-24 p-12 bg-[#3d2e20] rounded-[3rem] text-white relative overflow-hidden animate-in fade-in zoom-in duration-1000 delay-500 fill-mode-backwards">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-start space-y-2">
            <h2 className="text-3xl font-black">{locale === 'ar' ? "هل لديك سؤال عاجل؟" : "Have an urgent question?"}</h2>
            <p className="text-white/60 text-lg font-medium">{locale === 'ar' ? "المساعد الذكي متاح ليلاً ونهاراً لخدمتك." : "AI Assistant is available day and night to serve you."}</p>
          </div>
          <button
            onClick={() => window.location.href = `/${locale}/chat`}
            className="px-10 py-5 bg-white text-[#3d2e20] rounded-full font-black text-xl hover:bg-[#f5f1eb] transition-all hover:scale-105 active:scale-95 shadow-2xl flex items-center gap-3 whitespace-nowrap"
          >
            <Send className="w-5 h-5" />
            <span>{locale === 'ar' ? "تحدث مع المساعد الآن" : "Chat with AI now"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Icons for the bottom CTA (needed internally)
function ArrowRight({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
}
function ArrowLeft({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
}
