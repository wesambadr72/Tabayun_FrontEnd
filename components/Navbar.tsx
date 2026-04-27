"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import ar from "../locales/ar/common.json";
import en from "../locales/en/common.json";
import { Menu, X, Globe, User as UserIcon, LogOut, ChevronRight, ChevronLeft, MessageSquare, Bell, LayoutDashboard } from "lucide-react";

import { authService } from "@/services/authService";

const dictionaries = { ar, en };

export default function Navbar() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = (params.locale as string) || "ar";
  const dict = (dictionaries[locale as keyof typeof dictionaries] || ar).navbar;

  // الاتجاه يعتمد على اللغة المختارة
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  // فحص هل نحن في صفحات تسجيل الدخول أو التسجيل
  const isAuthPage = pathname.includes('/auth/');

  // حالة تسجيل الدخول الفعلية
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = authService.getToken();
    setIsLoggedIn(!!token);
    
    const loadUser = async () => {
      if (token) {
        // Try to get cached user first
        const cachedUser = authService.getUser();
        if (cachedUser) setUser(cachedUser);
        
        try {
          // Then fetch fresh user data to ensure admin status is correct
          const freshUser = await authService.getMe();
          setUser(freshUser);
        } catch (err) {
          console.error("Navbar: Failed to fetch fresh user data", err);
        }
      } else {
        setUser(null);
      }
    };

    loadUser();
  }, [pathname]);

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  if (isAuthPage) return null;

  const languages = [
    { name: "العربية", code: "ar" },
    { name: "English", code: "en" },
  ];

  const currentLangName = languages.find(l => l.code === locale)?.name || "العربية";

  const handleLangChange = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    router.push(newPath);
    setIsLangOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-4" dir={dir}>
      <nav className="flex justify-between items-center w-full max-w-6xl bg-[#3d2e20]/95 md:backdrop-blur-md border border-white/10 px-4 md:px-8 py-2 md:py-3 rounded-full shadow-2xl text-white transition-all duration-300">

        {/* القسم الأيمن (في RTL) / الأيسر (في LTR): اللوجو والروابط (للديسكتاب) */}
        <div className="flex items-center gap-4 md:gap-12">
          <span className="text-2xl md:text-3xl font-black tracking-wider uppercase cursor-default">
            {dict.brand}
          </span>

          {/* روابط الديسكتاب فقط */}
          <div className="hidden md:flex items-center gap-8 text-xl font-bold">
            {isLoggedIn && (
              <>
                <Link
                  href={`/${locale}/dashboard`}
                  className={`hover:opacity-70 transition ${pathname.includes('/dashboard') && !pathname.includes('/categories') ? 'border-b-2 border-white' : ''} pb-0.5 font-bold`}
                >
                  {dict.home}
                </Link>
                <Link
                  href={`/${locale}/categories`}
                  className={`hover:opacity-70 transition ${pathname.includes('/categories') ? 'border-b-2 border-white' : ''} font-bold`}
                >
                  {dict.browse}
                </Link>
              </>
            )}

            <Link
              href={`/${locale}/chat`}
              className={`hover:opacity-70 transition ${pathname.includes('/chat') ? 'border-b-2 border-white' : ''} font-bold`}
            >
              {(dict as any).assistant}
            </Link>

            <Link
              href={`/${locale}/contact`}
              className={`hover:opacity-70 transition ${pathname === `/${locale}/contact` ? 'border-b-2 border-white' : ''} font-bold`}
            >
              {dict.contact}
            </Link>
          </div>
        </div>

        {/* القسم الأيسر للديسكتاب والهمبرغر للموبايل */}
        <div className="flex items-center gap-2 md:gap-6">

          {/* أزرار الديسكتاب فقط */}
          <div className="hidden md:flex items-center gap-6">
            {/* 1. زر اللغة */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsLangOpen(!isLangOpen);
                  setIsProfileOpen(false);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center justify-center gap-2 h-10 px-4 rounded-full bg-white/10 hover:bg-white/20 transition border border-white/20 group"
              >
                <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="text-sm font-bold">{currentLangName}</span>
              </button>

              {isLangOpen && (
                <div className={`absolute top-full mt-3 ${dir === 'rtl' ? 'left-0' : 'right-0'} w-32 bg-[#1a1510]/95 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2`}>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLangChange(lang.code)}
                      className={`w-full text-center px-4 py-3 text-sm transition-colors border-b border-white/5 last:border-0 hover:bg-white/10 ${locale === lang.code ? 'text-white font-bold' : 'text-white/60'}`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 1.5. أيقونة الإشعارات (تظهر فقط إذا كان مسجل الدخول) */}
            {isLoggedIn && (
              <div className="relative">
                <button
                  onClick={() => {
                    setIsNotificationsOpen(!isNotificationsOpen);
                    setIsProfileOpen(false);
                    setIsLangOpen(false);
                  }}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/20 transition cursor-pointer relative"
                >
                  <Bell className="w-5 h-5 text-white" />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {isNotificationsOpen && (
                  <div className={`absolute top-full mt-3 ${dir === 'rtl' ? 'left-1/2 -translate-x-1/2' : 'right-1/2 translate-x-1/2'} w-64 md:w-80 bg-[#1a1510]/95 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 p-4`}>
                    <div className="text-white/60 text-sm text-center py-4 border-b border-white/10 mb-2">
                       {locale === 'ar' ? 'لا توجد إشعارات جديدة حالياً' : 'No new notifications right now'}
                    </div>
                    <Link
                      href={`/${locale}/notifications`}
                      onClick={() => setIsNotificationsOpen(false)}
                      className="block w-full text-center px-4 py-2 mt-2 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm font-bold transition-colors"
                    >
                      {locale === 'ar' ? 'عرض جميع الاشعارات' : 'View all notifications'}
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* 2. أيقونة البروفايل */}
            <div className="relative">
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    router.push(`/${locale}/auth/login`);
                  } else {
                    setIsProfileOpen(!isProfileOpen);
                    setIsLangOpen(false);
                    setIsNotificationsOpen(false);
                  }
                }}
                className="w-10 h-10 rounded-full border border-white/50 flex items-center justify-center hover:bg-white/20 transition cursor-pointer"
              >
                <UserIcon className="w-6 h-6" />
              </button>

              {isLoggedIn && isProfileOpen && (
                <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-48 bg-[#1a1510]/95 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2">
                  <Link
                    href={`/${locale}/profile`}
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-white/80 hover:bg-white/10 transition-colors border-b border-white/5"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>{dict.profile || "الملف الشخصي"}</span>
                  </Link>

                  {user?.is_admin && (
                    <Link
                      href={`/${locale}/admin`}
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-white/80 hover:bg-white/10 transition-colors border-b border-white/5"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>{locale === 'ar' ? 'لوحة التحكم' : 'Admin Panel'}</span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      authService.logout();
                      router.push(`/${locale}/auth/login`);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-400/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{dict.logout || "تسجيل الخروج"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* زر القائمة الجانبية للموبايل فقط */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-full bg-white/10 border border-white/20 active:scale-90 transition-transform"
          >
            <Menu className="w-8 h-8 text-white" />
          </button>
        </div>

      </nav>

      {/* القائمة الجانبية للموبايل (Mobile Sidebar Overlay) */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-500 bg-black/60 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`absolute top-0 ${dir === 'rtl' ? 'left-0' : 'right-0'} w-[80%] max-w-[300px] h-full bg-[#1a1510] shadow-2xl transition-transform duration-500 flex flex-col p-6 ${isMobileMenuOpen ? 'translate-x-0' : (dir === 'rtl' ? '-translate-x-full' : 'translate-x-full')}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header of Sidebar */}
          <div className="flex items-center justify-between mb-10">
            <span className="text-2xl font-black text-white cursor-default">{dict.brand}</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-full bg-white/5 border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-4 mb-auto text-white">
            {isLoggedIn && (
              <>
                <Link
                  href={`/${locale}/dashboard`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-colors ${pathname.includes('/dashboard') && !pathname.includes('/categories') ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5'}`}
                >
                  <span className="text-lg font-bold">{dict.home}</span>
                  {dir === 'rtl' ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </Link>
                <Link
                  href={`/${locale}/categories`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-colors ${pathname.includes('/categories') ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5'}`}
                >
                  <span className="text-lg font-bold">{dict.browse}</span>
                  {dir === 'rtl' ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </Link>
              </>
            )}

            <Link
              href={`/${locale}/chat`}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center justify-between p-4 rounded-2xl transition-colors ${pathname.includes('/chat') ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5'}`}
            >
              <span className="text-lg font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                {(dict as any).assistant}
              </span>
              {dir === 'rtl' ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </Link>

            <Link
              href={`/${locale}/contact`}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center justify-between p-4 rounded-2xl transition-colors ${pathname === `/${locale}/contact` ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5'}`}
            >
              <span className="text-lg font-bold">{dict.contact}</span>
              {dir === 'rtl' ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </Link>
          </div>

          {/* Bottom Actions (Language & Profile) */}
          <div className="mt-auto space-y-4 pt-6 border-t border-white/10">
            {/* Language Selection */}
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLangChange(lang.code)}
                  className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${locale === lang.code ? 'bg-white text-[#3d2e20]' : 'bg-white/5 text-white/40 border border-white/10'}`}
                >
                  {lang.name}
                </button>
              ))}
            </div>

            {/* Profile & Logout */}
            {!isLoggedIn ? (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push(`/${locale}/auth/login`);
                }}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold w-full text-right"
              >
                <UserIcon className="w-5 h-5" />
                <span>{(dict as any).login || (locale === 'ar' ? "تسجيل الدخول" : "Login")}</span>
              </button>
            ) : (
              <>
                <Link
                  href={`/${locale}/profile`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold"
                >
                  <UserIcon className="w-5 h-5" />
                  <span>{dict.profile || "الملف الشخصي"}</span>
                </Link>

                {user?.is_admin && (
                  <Link
                    href={`/${locale}/admin`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>{locale === 'ar' ? 'لوحة التحكم' : 'Admin Panel'}</span>
                  </Link>
                )}

                <Link
                  href={`/${locale}/notifications`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold relative"
                >
                  <Bell className="w-5 h-5" />
                  <span>{locale === 'ar' ? 'الإشعارات' : 'Notifications'}</span>
                  <span className="w-2 h-2 bg-red-500 rounded-full ml-auto mr-auto"></span>
                </Link>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    authService.logout();
                    router.push(`/${locale}/auth/login`);
                  }}
                  className="flex items-center gap-3 w-full p-4 rounded-xl bg-red-400/10 text-red-400 font-bold"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{dict.logout || "تسجيل الخروج"}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
