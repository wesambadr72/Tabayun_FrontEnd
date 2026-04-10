"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { User as UserIcon, Mail, Globe, Languages, Heart, LogOut, Camera, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { authService } from "@/services/authService";
import { User } from "@/types/auth";
import ar from "@/locales/ar/common.json";
import en from "@/locales/en/common.json";

const dictionaries = { ar, en };

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "ar";
  const commonDict = dictionaries[locale as keyof typeof dictionaries] || ar;
  const profileDict = commonDict.auth?.profile || {};
  const dir = locale === "ar" ? "rtl" : "ltr";

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        // Try getting from localStorage first
        const cachedUser = authService.getUser();
        if (cachedUser) {
          setUser(cachedUser);
        }
        
        // Refresh from server
        const freshUser = await authService.getMe();
        setUser(freshUser);
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const profileItems = [
    {
      label: profileDict.name || (locale === 'ar' ? 'الاسم' : 'Name'),
      value: user?.full_name || profileDict.userName || (locale === 'ar' ? 'جاري التحميل...' : 'Loading...'),
      icon: UserIcon
    },
    {
      label: profileDict.email || (locale === 'ar' ? 'البريد الالكتروني' : 'Email'),
      value: user?.email || 'user@gmail.com',
      icon: Mail
    },
    {
      label: profileDict.country || (locale === 'ar' ? 'الدولة' : 'Country'),
      value: user?.country || (locale === 'ar' ? 'ألمانيا' : 'Germany'),
      icon: Globe
    },
    {
      label: profileDict.language || (locale === 'ar' ? 'اللغة' : 'Language'),
      value: user?.language || (locale === 'ar' ? 'عربي' : 'Arabic'),
      icon: Languages
    },
    {
      label: profileDict.favorites || (locale === 'ar' ? 'المفضلة' : 'Favorites'),
      value: profileDict.lawsCount || (locale === 'ar' ? '7 قوانين' : '7 Laws'),
      icon: Heart
    },
  ];

  const handleLogout = () => {
    authService.logout();
    router.push(`/${locale}/auth/login`);
  };

  if (loading && !user) {
    return (
      <main className="min-h-screen bg-[#f5f1eb] flex flex-col items-center justify-center">
        <Navbar />
        <Loader2 className="w-12 h-12 text-[#3d2e20] animate-spin" />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center overflow-x-hidden bg-[#f5f1eb]" dir={dir}>
      <Navbar />

      <div className="relative z-20 w-full flex flex-col items-center pt-40 md:pt-48 pb-20 px-4">

        {/* Header Section */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-4xl md:text-5xl font-black text-[#3d2e20] mb-4 font-bold tracking-tight">
            {profileDict.title || (locale === "ar" ? "الملف الشخصي" : "Profile")}
          </h1>
          <p className="text-[#3d2e20]/60 text-lg font-regular">
            {locale === "ar" ? "إدارة معلومات حسابك الشخصي" : "Manage your personal account information"}
          </p>
        </div>

        {/* Profile Card */}
        <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-xl shadow-[#3d2e20]/5 border border-[#3d2e20]/10 overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-700 delay-150 fill-mode-backwards p-8 md:p-12">

          {/* Profile Image Section */}
          <div className="flex flex-col items-center mb-12 relative group cursor-pointer">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#f5f1eb] shadow-lg overflow-hidden bg-[#f5f1eb] flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/image/profile.svg" // Fallback or placeholder
                alt="Profile"
                width={160}
                height={160}
                className="object-cover p-2 opacity-80"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>

            <button className="flex items-center gap-2 text-[#3d2e20] font-bold text-sm md:text-base hover:text-[#3d2e20]/70 transition-colors bg-[#f5f1eb] px-4 py-2 rounded-full">
              <Camera className="w-4 h-4" />
              {profileDict.changePhoto || "تغيير الصورة"}
            </button>
          </div>

          {/* Info List */}
          <div className="space-y-6">
            {profileItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-[#f5f1eb]/50 transition-colors group border-b border-[#f5f1eb] last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-[#f5f1eb] text-[#3d2e20] group-hover:bg-[#3d2e20] group-hover:text-white transition-colors duration-300">
                    <item.icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-[#3d2e20]/50 font-medium">
                      {item.label}
                    </span>
                    <span className="text-lg md:text-xl font-bold text-[#3d2e20]">
                      {item.value}
                    </span>
                  </div>
                </div>

                {locale === "ar" ? (
                  <ChevronLeft className="w-5 h-5 text-[#3d2e20]/30 group-hover:text-[#3d2e20] transition-colors" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-[#3d2e20]/30 group-hover:text-[#3d2e20] transition-colors" />
                )}
              </div>
            ))}
          </div>

          {/* Logout Button */}
          <div className="mt-12 pt-8 border-t border-[#f5f1eb] flex justify-center">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 text-red-500 hover:text-red-600 font-bold text-lg transition-all hover:bg-red-50 px-8 py-3 rounded-xl w-full justify-center group"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
              {profileDict.logout || "تسجيل الخروج"}
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
