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
        <section className="w-full py-20 bg-[#f5f1eb]" dir={dir}>
            <div className="container mx-auto px-6 md:px-12 max-w-6xl">

                <div className="text-center max-w-2xl mx-auto mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h2 className="text-3xl md:text-5xl font-bold text-[#3d2e20]">{dict.features.title}</h2>
                    <p className="text-[#3d2e20]/60 text-lg md:text-xl font-medium">
                        {locale === "ar" ? "تجربة قانونية مبسطة وحديثة" : "A Simplified and Modern Legal Experience"}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-backwards">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center text-center p-8 bg-white rounded-3xl border border-[#3d2e20]/5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 rounded-2xl bg-[#f5f1eb] text-[#3d2e20] flex items-center justify-center mb-6">
                                <feature.icon className="w-7 h-7" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-[#3d2e20] mb-3">{feature.title}</h3>
                            <p className="text-[#3d2e20]/60 text-sm leading-relaxed font-medium">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
