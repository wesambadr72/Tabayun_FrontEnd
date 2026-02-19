"use client";

import React from "react";
import { Mail, User, MessageSquare, ArrowRight, ArrowLeft } from "lucide-react";

interface ContactFormProps {
  dict: any;
  locale: string;
}

export default function ContactForm({ dict, locale }: ContactFormProps) {
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <section className="w-full py-12 md:py-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-backwards" dir={dir}>
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="relative bg-[#3d2e20] text-white rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-2xl">
          {/* Artistic blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#523e2b] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-60 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2a1f15] rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-60 pointer-events-none" />

          <div className="relative z-10">
            <div className="text-center mb-10 space-y-4">
              <h1 className="text-3xl md:text-5xl font-black">{dict.contact.title}</h1>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                {dict.contact.desc}
              </p>
            </div>

            <form className="max-w-2xl mx-auto space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80 px-1">{dict.contact.name}</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 pl-10 rtl:pl-4 rtl:pr-10 focus:outline-none focus:bg-white/20 transition-all text-white placeholder-white/30"
                      placeholder={dict.contact.name}
                    />
                    <User className="w-5 h-5 text-white/50 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3" />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80 px-1">{dict.contact.email}</label>
                  <div className="relative">
                    <input
                      type="email"
                      className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 pl-10 rtl:pl-4 rtl:pr-10 focus:outline-none focus:bg-white/20 transition-all text-white placeholder-white/30"
                      placeholder={dict.contact.email}
                    />
                    <Mail className="w-5 h-5 text-white/50 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3" />
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 px-1">{dict.contact.subject}</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 pl-10 rtl:pl-4 rtl:pr-10 focus:outline-none focus:bg-white/20 transition-all text-white placeholder-white/30"
                    placeholder={dict.contact.subject}
                  />
                  <MessageSquare className="w-5 h-5 text-white/50 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3" />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 px-1">{dict.contact.message}</label>
                <textarea
                  rows={5}
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:bg-white/20 transition-all text-white placeholder-white/30 resize-none"
                  placeholder={dict.contact.message}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  className="px-8 py-4 bg-white text-[#3d2e20] rounded-full font-bold hover:bg-[#f5f1eb] transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg"
                >
                  <span>{dict.contact.send}</span>
                  {locale === "ar" ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
