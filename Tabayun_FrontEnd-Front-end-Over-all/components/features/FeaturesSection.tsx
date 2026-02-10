"use client";
import React from "react";
import { Search, Globe, Zap, Eye, Trophy, Shield, Clock, BookOpen } from "lucide-react";
import ar from "../../locales/ar/common.json";
import en from "../../locales/en/common.json";
import { useParams } from "next/navigation";

const dictionaries = { ar, en };

export default function FeaturesSection() {
    const params = useParams();
    const locale = (params.locale as string) || "ar";
    const dict = (dictionaries[locale as keyof typeof dictionaries] || ar);
    const dir = locale === "ar" ? "rtl" : "ltr";

    const features = [
        { icon: Search, title: dict.features.items.easy, desc: "Find exactly what you need in seconds.", delay: "0" },
        { icon: Globe, title: dict.features.items.compare, desc: "See how Saudi law differs globally.", delay: "100" },
        { icon: Eye, title: dict.features.items.visual, desc: "Infographics making complexity simple.", delay: "200" },
        { icon: Zap, title: dict.features.items.fast, desc: "Real-time updates on regulations.", delay: "300" },
    ];

    return (
        <section className="w-full py-24 bg-transparent" dir={dir}>
            <div className="container mx-auto px-4 md:px-8">
                <div className="text-center max-w-4xl mx-auto mb-20 space-y-6">
                    <h2 className="text-5xl md:text-7xl font-black text-[#3d2e20] tracking-tight">{dict.features.title}</h2>
                    <p className="text-xl text-[#3d2e20]/60 font-medium">
                        {locale === "ar" ? "كل ما تحتاجه لفهم الأنظمة في مكان واحد" : "Everything you need to understand regulations in one place"}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative p-8 bg-white/40 backdrop-blur-sm rounded-[2rem] border border-white/50 hover:bg-white transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
                        >
                            {/* Hover Decoration */}
                            <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#3d2e20]/5 rounded-full blur-2xl group-hover:bg-[#3d2e20]/10 transition-colors duration-500" />

                            <div className="relative z-10 flex flex-col items-start gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-[#3d2e20] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                                    <feature.icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-[#3d2e20] leading-tight">{feature.title}</h3>
                                    <p className="text-sm text-[#3d2e20]/60 font-medium leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
