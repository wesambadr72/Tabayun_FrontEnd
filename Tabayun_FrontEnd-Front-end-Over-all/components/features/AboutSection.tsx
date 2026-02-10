"use client";
import React from "react";
import Image from "next/image";
import { Scale } from "lucide-react";
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
                <div className="flex flex-col md:flex-row items-center gap-16 relative">

                    {/* Visual Element - Overlapping Cards Effect */}
                    <div className="flex-1 relative h-[500px] w-full animate-in slide-in-from-bottom-8 duration-700">
                        {/* Abstract Shape Background */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-radial from-white/40 to-transparent blur-3xl rounded-full" />

                        {/* Main Image Container with Glassmorphism */}
                        <div className="absolute inset-0 bg-white/30 backdrop-blur-md rounded-[3rem] shadow-2xl overflow-hidden border border-white/40 transform hover:scale-[1.02] transition-transform duration-700">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#3d2e20]/5 to-transparent z-10" />
                            <Image
                                src="/image/saudi.png"
                                alt="About Tabayun"
                                fill
                                className="object-contain p-12 opacity-90 drop-shadow-xl"
                            />
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -right-6 md:right-10 bg-[#3d2e20] text-white p-6 rounded-3xl shadow-xl animate-bounce-slow">
                            <Scale className="w-8 h-8 mb-2" />
                            <span className="block font-bold text-lg">2030</span>
                            <span className="text-xs opacity-80">Vision Aligned</span>
                        </div>
                    </div>

                    {/* Text Content - Cleaner Typography */}
                    <div className="flex-1 space-y-8 animate-in slide-in-from-bottom-8 duration-700 delay-200">
                        <div className="space-y-4">
                            <span className="text-[#3d2e20] font-bold tracking-widest uppercase text-sm opacity-60">
                                {locale === "ar" ? "من نحن" : "Who We Are"}
                            </span>
                            <h2 className="text-5xl md:text-7xl font-black text-[#3d2e20] leading-[0.9]">
                                {locale === "ar" ? "سهولة.. وضوح.. موثوقية" : "Simple. Clear. Trusted."}
                            </h2>
                        </div>
                        <p className="text-xl md:text-2xl text-[#3d2e20]/70 leading-relaxed font-medium">
                            {dict.about.description}
                        </p>

                        <div className="pt-4 border-t border-[#3d2e20]/10">
                            <div className="flex gap-12">
                                <div>
                                    <h3 className="text-3xl font-black text-[#3d2e20]">100+</h3>
                                    <span className="text-sm text-[#3d2e20]/60 font-bold uppercase tracking-wider">{locale === "ar" ? "قانون ونظام" : "Laws & Regs"}</span>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-[#3d2e20]">24/7</h3>
                                    <span className="text-sm text-[#3d2e20]/60 font-bold uppercase tracking-wider">{locale === "ar" ? "تحديث مستمر" : "Updates"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
