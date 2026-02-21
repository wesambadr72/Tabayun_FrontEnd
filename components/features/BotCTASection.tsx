"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { MessageSquare, Send, Sparkles, Bot } from "lucide-react";

export default function BotCTASection() {
    const params = useParams();
    const router = useRouter();
    const locale = (params.locale as string) || "ar";
    const dir = locale === "ar" ? "rtl" : "ltr";

    return (
        <section className="w-full py-20 bg-white" dir={dir}>
            <div className="container mx-auto px-6 md:px-12 max-w-5xl">
                <div className="bg-[#3d2e20] rounded-[2.5rem] p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">

                    {/* Subtle decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center space-y-8">
                        <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                            <Bot className="w-10 h-10" />
                        </div>

                        <div className="space-y-4 max-w-2xl">
                            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                                {locale === 'ar' ? "تحدث مع مساعدك القانوني الذكي" : "Chat with Your Smart Legal Assistant"}
                            </h2>
                            <p className="text-white/60 text-lg font-medium">
                                {locale === 'ar'
                                    ? "إجابات فورية ودقيقة على جميع استفساراتك القانونية في ثوانٍ."
                                    : "Instant and accurate answers to all your legal queries in seconds."}
                            </p>
                        </div>

                        <button
                            onClick={() => router.push(`/${locale}/chat`)}
                            className="bg-white text-[#3d2e20] px-10 py-4 rounded-full font-bold text-lg hover:bg-[#f5f1eb] transition-all hover:scale-105 active:scale-95 flex items-center gap-3 shadow-xl"
                        >
                            <Send className="w-5 h-5" />
                            <span>{locale === 'ar' ? "ابدأ المحادثة الآن" : "Start Chatting Now"}</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
