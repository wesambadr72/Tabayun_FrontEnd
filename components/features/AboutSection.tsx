"use client";
import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import ar from "../../locales/ar/common.json";
import en from "../../locales/en/common.json";

const dictionaries = { ar, en };

export default function AboutSection() {
    const params = useParams();
    const locale = (params.locale as string) || "ar";
    const dict = (dictionaries[locale as keyof typeof dictionaries] || ar);
    const dir = locale === "ar" ? "rtl" : "ltr";

    return (
        <section id="about-section" className="w-full py-20 bg-white" dir={dir}>
            <div className="container mx-auto px-6 md:px-12 max-w-6xl">
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">

                    {/* Content Column */}
                    <div className="flex-1 space-y-6 text-center md:text-start animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h2 className="text-3xl md:text-5xl font-bold text-[#3d2e20] leading-tight">
                            {locale === "ar" ? "وضوح وموثوقية في كل معلومة" : "Clarity and Trust in Every Detail"}
                        </h2>
                        <div className="h-1.5 w-16 bg-[#3d2e20] rounded-full mx-auto md:mx-0 opacity-20" />
                        <p className="text-lg md:text-xl text-[#3d2e20]/70 leading-relaxed font-medium">
                            {dict.about.description}
                        </p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-8 pt-4">
                            <div>
                                <h3 className="text-3xl font-bold text-[#3d2e20]">100+</h3>
                                <p className="text-sm font-semibold text-[#3d2e20]/40 uppercase tracking-widest mt-1">
                                    {locale === "ar" ? "قانون ونظام" : "Laws & Regulations"}
                                </p>
                            </div>
                            <div className="hidden sm:block w-px h-12 bg-[#3d2e20]/10" />
                            <div>
                                <h3 className="text-3xl font-bold text-[#3d2e20]">24/7</h3>
                                <p className="text-sm font-semibold text-[#3d2e20]/40 uppercase tracking-widest mt-1">
                                    {locale === "ar" ? "دعم ذكي" : "AI Support"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Image Column */}
                    <div className="flex-1 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-backwards">
                        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-[#3d2e20]/5">
                            <Image
                                src="/image/saudi.png"
                                alt="Tabayun"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
