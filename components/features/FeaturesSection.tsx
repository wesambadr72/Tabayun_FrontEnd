"use client";
import React from "react";
import { Search, Globe, Zap, Eye } from "lucide-react";
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
        { icon: Search, title: dict.features.items.easy, desc: dict.features.items.easyDesc },
        { icon: Globe, title: dict.features.items.compare, desc: dict.features.items.compareDesc },
        { icon: Eye, title: dict.features.items.visual, desc: dict.features.items.visualDesc },
        { icon: Zap, title: dict.features.items.fast, desc: dict.features.items.fastDesc },
    ];

    return (
        <section className="w-full py-24 bg-[#3d2e20] text-white" dir={dir}>
            <div className="container mx-auto px-4 md:px-8">

                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                    <h2 className="text-4xl md:text-6xl font-black">{dict.features.title}</h2>
                    <p className="text-white/60 text-xl font-medium">
                        {locale === "ar" ? "نقدم لك تجربة قانونية فريدة ومبسطة" : "Simplified Legal Experience"}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-start space-y-4 group">
                            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-[#3d2e20] transition-all duration-300">
                                <feature.icon className="w-8 h-8" strokeWidth={1.5} />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold">{feature.title}</h3>
                                <p className="text-white/60 leading-relaxed font-medium">
                                    {feature.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
