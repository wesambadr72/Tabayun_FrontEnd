"use client";
import React from "react";
import { Mail, Send, ArrowRight, ArrowLeft } from "lucide-react";
import ar from "../../locales/ar/common.json";
import en from "../../locales/en/common.json";
import { useParams } from "next/navigation";

const dictionaries = { ar, en };

export default function ContactSection() {
    const params = useParams();
    const locale = (params.locale as string) || "ar";
    const dict = (dictionaries[locale as keyof typeof dictionaries] || ar);
    const dir = locale === "ar" ? "rtl" : "ltr";

    return (
        <section className="w-full py-24 bg-transparent" dir={dir}>
            <div className="container mx-auto px-4 md:px-8 max-w-5xl">
                <div className="relative bg-[#3d2e20] text-white rounded-[3rem] p-12 md:p-24 overflow-hidden shadow-[0_40px_100px_-20px_rgba(61,46,32,0.3)]">

                    {/* Artistic blobs */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#523e2b] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-60" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2a1f15] rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-60" />

                    <div className="relative z-10 flex flex-col items-center text-center space-y-10">
                        <div className="space-y-6">
                            <h2 className="text-4xl md:text-7xl font-black tracking-tight">{dict.contact.title}</h2>
                            <p className="text-white/70 text-lg md:text-2xl max-w-2xl mx-auto font-medium leading-relaxed">
                                {dict.contact.desc}
                            </p>
                        </div>

                        <div className="w-full max-w-xl bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/10 flex items-center focus-within:bg-white/15 transition-colors">
                            <div className="pl-6 pr-4 opacity-50">
                                <Mail className="w-6 h-6" />
                            </div>
                            <input
                                type="email"
                                placeholder={dict.contact.email}
                                className="flex-1 bg-transparent border-none text-white placeholder-white/40 focus:outline-none h-12 md:h-14 text-lg"
                            />
                            <button className="h-12 md:h-14 px-8 md:px-10 bg-white text-[#3d2e20] rounded-full font-bold hover:bg-[#f5f1eb] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg">
                                <span>{dict.contact.send}</span>
                                {locale === "ar" ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
