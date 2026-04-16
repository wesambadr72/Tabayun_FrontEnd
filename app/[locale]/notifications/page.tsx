"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Bell } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function NotificationsPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "ar";
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center overflow-x-hidden bg-[#f5f1eb]" dir={dir}>
      <Navbar />
      
      <div className="relative z-20 w-full flex flex-col items-center pt-40 md:pt-48 pb-20 px-4 max-w-4xl">
        <button 
          onClick={() => router.back()}
          className="self-start flex items-center gap-2 text-[#3d2e20]/60 hover:text-[#3d2e20] mb-8 transition-colors"
        >
          {isAr ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          <span className="font-medium">{isAr ? "العودة" : "Back"}</span>
        </button>

        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full">
          <h1 className="text-4xl md:text-5xl font-black text-[#3d2e20] mb-4 tracking-tight flex justify-center items-center gap-4">
            <Bell className="w-10 h-10 text-[#3d2e20]" />
            {isAr ? "الإشعارات" : "Notifications"}
          </h1>
          <p className="text-[#3d2e20]/60 text-lg font-regular">
            {isAr ? "جميع التنبيهات والإشعارات الخاصة بحسابك" : "All alerts and notifications for your account"}
          </p>
        </div>

        {/* Empty State */}
        <div className="w-full bg-white rounded-[2rem] shadow-xl shadow-[#3d2e20]/5 border border-[#3d2e20]/10 p-12 text-center animate-in fade-in slide-in-from-bottom-12 duration-700 delay-150">
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-24 h-24 bg-[#f5f1eb] rounded-full flex items-center justify-center shadow-inner mb-6">
              <Bell className="w-10 h-10 text-[#3d2e20]/30" />
            </div>
            <h3 className="text-2xl font-bold text-[#3d2e20] mb-2">
              {isAr ? "لا توجد إشعارات حالياً" : "No notifications yet"}
            </h3>
            <p className="text-[#3d2e20]/60 text-lg max-w-sm mx-auto">
              {isAr ? "ستظهر هنا أي تنبيهات جديدة خاصة بالتحديثات أو حسابك الشخصي." : "Any new alerts about updates or your personal account will appear here."}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
