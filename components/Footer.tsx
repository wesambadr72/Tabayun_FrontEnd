"use client";
import React from "react";
import Link from "next/link";
import { Scale, Heart } from "lucide-react";
import ar from "../locales/ar/common.json";
import en from "../locales/en/common.json";
import { useParams } from "next/navigation";

const dictionaries = { ar, en };

export default function Footer() {
    const params = useParams();
    const locale = (params.locale as string) || "ar";
    const dict = (dictionaries[locale as keyof typeof dictionaries] || ar);
    const dir = locale === "ar" ? "rtl" : "ltr";

    return (
        <footer className="w-full bg-transparent py-12" dir={dir}>
            <div className="container mx-auto px-4 md:px-8 border-t border-[#3d2e20]/10 pt-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                    {/* Logo & Rights */}
                    <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                        <div className="p-2 bg-[#3d2e20] rounded-full text-white">
                            <Scale className="w-4 h-4" />
                        </div>
                        <span className="text-[#3d2e20] font-bold text-sm tracking-wide">
                            {dict.footer.rights}
                        </span>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-8">
                        <Link href="#" className="text-[#3d2e20]/60 hover:text-[#3d2e20] text-sm font-bold transition-colors uppercase tracking-wider">
                            {dict.footer.links.privacy}
                        </Link>
                        <Link href="#" className="text-[#3d2e20]/60 hover:text-[#3d2e20] text-sm font-bold transition-colors uppercase tracking-wider">
                            {dict.footer.links.terms}
                        </Link>
                    </div>

                </div>
            </div>
        </footer>
    );
}
