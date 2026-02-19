"use client";
import React from "react";
import Image from "next/image";
import ar from "../../locales/ar/common.json";
import en from "../../locales/en/common.json";
import { useParams } from "next/navigation";

const dictionaries = { ar, en };

export default function AboutSection() {
    const params = useParams();
    const locale = (params.locale as string) || "ar";
    const dict = (dictionaries[locale as keyof typeof dictionaries] || ar);
    const dir = locale === "ar" ? "rtl" : "ltr";

    return (
        <section id="about-section" className="w-full py-24 bg-transparent" dir={dir}>
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">

                    {/* Image - Simple & Clean */}
                    <div className="flex-1 w-full max-w-lg">
                        <div className="relative aspect-square md:aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl">
                            <Image
                                src="/image/saudi.png" // Placeholder - should be a relevant image
                                alt="About Tabayun"
                                fill
                                className="object-cover"
                            />
                            {/* Subtle Overlay */}
                            <div className="absolute inset-0 bg-black/10" />
                        </div>
                    </div>

                    {/* Content - Typography Focused */}
                    <div className="flex-1 space-y-8 text-center md:text-start">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-6xl font-black text-[#3d2e20] leading-tight">
                                {locale === "ar" ? "وضوح.. وموثوقية" : "Clarity & Trust"}
                            </h2>
                            <div className="h-2 w-24 bg-[#3d2e20] rounded-full mx-auto md:mx-0 opacity-20" />
                        </div>

                        <p className="text-xl text-[#3d2e20]/80 leading-relaxed font-medium">
                            {dict.about.description}
                        </p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-8 pt-4">
                            <div>
                                <h3 className="text-4xl font-black text-[#3d2e20]">100+</h3>
                                <p className="text-sm font-bold text-[#3d2e20]/50 mt-1">{locale === "ar" ? "قانون ونظام" : "Laws & Regulations"}</p>
                            </div>
                            <div className="w-px h-16 bg-[#3d2e20]/10" />
                            <div>
                                <h3 className="text-4xl font-black text-[#3d2e20]">24/7</h3>
                                <p className="text-sm font-bold text-[#3d2e20]/50 mt-1">{locale === "ar" ? "مساعد ذكي" : "AI Assistant"}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
