"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  Bell,
  BookOpen,
  Globe2,
  Heart,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  MessageSquare,
  Scale,
  Search,
  User,
  X,
} from "lucide-react";
import { authService } from "@/services/authService";
import AccessibilityControls from "@/components/AccessibilityControls";

const labels = {
  ar: {
    brand: "تباين",
    home: "الرئيسية",
    browse: "الأقسام",
    search: "البحث",
    assistant: "المساعد",
    contact: "تواصل",
    profile: "ملفي الشخصي",
    favorites: "المفضلة",
    notifications: "الإشعارات",
    login: "دخول",
    logout: "خروج",
    admin: "لوحة التحكم",
    menu: "القائمة",
    language: "اللغة",
    noNotifications: "لا توجد إشعارات جديدة حالياً",
  },
  en: {
    brand: "Tabayun",
    home: "Home",
    browse: "Browse",
    search: "Search",
    assistant: "Assistant",
    contact: "Contact",
    profile: "Profile",
    favorites: "Favorites",
    notifications: "Notifications",
    login: "Login",
    logout: "Logout",
    admin: "Admin",
    menu: "Menu",
    language: "Language",
    noNotifications: "No new notifications right now",
  },
};

const languages = [
  { name: "العربية", code: "ar" },
  { name: "English", code: "en" },
];

export default function Navbar() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = params.locale === "en" ? "en" : "ar";
  const dir = locale === "ar" ? "rtl" : "ltr";
  const t = labels[locale];
  const isAuthPage = pathname.includes("/auth/");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    const token = authService.getToken();
    setIsLoggedIn(!!token);

    const loadUser = async () => {
      if (!token) {
        setUser(null);
        return;
      }

      const cachedUser = authService.getUser();
      if (cachedUser) setUser(cachedUser);

      try {
        const freshUser = await authService.getMe();
        setUser(freshUser);
      } catch (error: any) {
        console.error("Navbar: failed to refresh user", error);
        // If credentials failed, update the UI state immediately
        if (error.message === 'Could not validate credentials') {
          setIsLoggedIn(false);
          setUser(null);
        }
      }
    };

    loadUser();
    setIsMenuOpen(false);
    setIsLangOpen(false);
    setIsProfileOpen(false);
    setIsNotificationsOpen(false);
  }, [pathname]);

  const primaryHome = isLoggedIn ? `/${locale}/dashboard` : `/${locale}`;
  const profileHref = isLoggedIn ? `/${locale}/profile` : `/${locale}/auth/login`;

  const desktopLinks = useMemo(
    () => [
      { href: primaryHome, label: t.home, match: ["/dashboard"], exactHome: true },
      { href: `/${locale}/categories`, label: t.browse, match: ["/categories", "/laws"] },
      { href: `/${locale}/search`, label: t.search, match: ["/search"] },
      { href: `/${locale}/chat`, label: t.assistant, match: ["/chat"] },
      { href: `/${locale}/contact`, label: t.contact, match: ["/contact"] },
    ],
    [locale, primaryHome, t]
  );

  const bottomLinks = [
    { href: primaryHome, label: t.home, icon: Home, match: ["/dashboard"], exactHome: true },
    { href: `/${locale}/categories`, label: t.browse, icon: BookOpen, match: ["/categories", "/laws"] },
    { href: `/${locale}/chat`, label: t.assistant, icon: MessageSquare, match: ["/chat"] },
    { href: isLoggedIn ? `/${locale}/profile/favorites` : `/${locale}/auth/login`, label: t.favorites, icon: Heart, match: ["/profile/favorites"] },
    { href: profileHref, label: isLoggedIn ? t.profile : t.login, icon: User, match: ["/profile", "/auth/login"] },
  ];

  if (isAuthPage) return null;

  const isActive = (item: { href: string; match: string[]; exactHome?: boolean }) => {
    if (item.exactHome && pathname === `/${locale}`) return item.href === `/${locale}`;
    if (item.exactHome && pathname.includes("/dashboard")) return item.href.includes("/dashboard");
    return item.match.some((segment) => pathname.includes(segment));
  };

  const handleLangChange = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  const logout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUser(null);
    router.push(`/${locale}/auth/login`);
  };

  return (
    <>
      <AccessibilityControls locale={locale} />

      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:hidden" dir={dir}>
        <div className="mx-auto flex h-14 max-w-md items-center justify-between rounded-[22px] border border-white/75 bg-[#F7F2EC]/88 px-3 shadow-[0_14px_40px_rgba(44,22,15,0.12)] backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl text-[#2C160F] transition active:scale-95"
            aria-label={t.menu}
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href={primaryHome} className="flex items-center gap-2">
            <span className="text-2xl font-black leading-none text-[#2C160F]">{t.brand}</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2C160F] text-[#F7F2EC] shadow-lg shadow-[#2C160F]/15">
              <Scale className="h-4 w-4" />
            </span>
          </Link>

          <Link
            href={isLoggedIn ? `/${locale}/notifications` : `/${locale}/auth/login`}
            className="relative flex h-10 w-10 items-center justify-center rounded-2xl text-[#2C160F] transition active:scale-95"
            aria-label={t.notifications}
          >
            <Bell className="h-5 w-5" />
            {isLoggedIn && <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#8E2C1D]" />}
          </Link>
        </div>
      </header>

      <div className="fixed inset-x-0 top-6 z-50 hidden justify-center px-4 md:flex" dir={dir}>
        <nav className="flex w-full max-w-6xl items-center justify-between rounded-full border border-white/15 bg-[#2C160F]/95 px-5 py-3 text-[#F7F2EC] shadow-2xl backdrop-blur-xl">
          <Link href={primaryHome} className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9B19C]/14 text-[#E6D7C8]">
              <Scale className="h-5 w-5" />
            </span>
            <span className="text-2xl font-black">{t.brand}</span>
          </Link>

          <div className="flex items-center gap-2 text-sm font-black">
            {desktopLinks.map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className={`rounded-full px-4 py-2 transition ${
                  isActive(item)
                    ? "bg-[#F7F2EC] text-[#2C160F]"
                    : "text-[#F7F2EC]/72 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsLangOpen((current) => !current);
                  setIsProfileOpen(false);
                  setIsNotificationsOpen(false);
                }}
                className="flex h-10 items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 text-sm font-bold transition hover:bg-white/14"
              >
                <Globe2 className="h-4 w-4" />
                {languages.find((lang) => lang.code === locale)?.name}
              </button>

              {isLangOpen && (
                <div className="absolute end-0 top-full mt-3 w-36 overflow-hidden rounded-2xl border border-[#E6D7C8] bg-[#F7F2EC] p-1 text-[#2C160F] shadow-2xl">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleLangChange(lang.code)}
                      className={`w-full rounded-xl px-3 py-2 text-sm font-black transition ${
                        locale === lang.code ? "bg-[#2C160F] text-[#F7F2EC]" : "hover:bg-[#E6D7C8]/55"
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isLoggedIn && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsNotificationsOpen((current) => !current);
                    setIsLangOpen(false);
                    setIsProfileOpen(false);
                  }}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/8 transition hover:bg-white/14"
                  aria-label={t.notifications}
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#E56B55]" />
                </button>

                {isNotificationsOpen && (
                  <div className="absolute end-0 top-full mt-3 w-72 rounded-2xl border border-[#E6D7C8] bg-[#F7F2EC] p-4 text-[#2C160F] shadow-2xl">
                    <p className="rounded-xl bg-[#E6D7C8]/45 px-4 py-5 text-center text-sm font-bold text-[#5B3422]/70">
                      {t.noNotifications}
                    </p>
                    <Link
                      href={`/${locale}/notifications`}
                      className="mt-3 block rounded-xl bg-[#2C160F] px-4 py-3 text-center text-sm font-black text-[#F7F2EC]"
                    >
                      {t.notifications}
                    </Link>
                  </div>
                )}
              </div>
            )}

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  if (!isLoggedIn) {
                    router.push(`/${locale}/auth/login`);
                    return;
                  }
                  setIsProfileOpen((current) => !current);
                  setIsLangOpen(false);
                  setIsNotificationsOpen(false);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/8 transition hover:bg-white/14"
                aria-label={isLoggedIn ? t.profile : t.login}
              >
                {isLoggedIn ? <User className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
              </button>

              {isLoggedIn && isProfileOpen && (
                <div className="absolute left-1/2 top-full mt-3 w-44 -translate-x-1/2 overflow-hidden rounded-2xl border border-[#E6D7C8] bg-[#F7F2EC] p-1 text-[#2C160F] shadow-2xl">
                  <Link href={`/${locale}/profile`} className="flex items-center justify-center gap-3 rounded-xl px-3 py-3 text-sm font-black hover:bg-[#E6D7C8]/55" onClick={() => setIsProfileOpen(false)}>
                    <User className="h-4 w-4" />
                    {t.profile}
                  </Link>
                  {user?.is_admin && (
                    <Link href={`/${locale}/admin`} className="flex items-center justify-center gap-3 rounded-xl px-3 py-3 text-sm font-black hover:bg-[#E6D7C8]/55" onClick={() => setIsProfileOpen(false)}>
                      <LayoutDashboard className="h-4 w-4" />
                      {t.admin}
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                    }}
                    className="flex w-full items-center justify-center gap-3 rounded-xl px-3 py-3 text-sm font-black text-[#8E2C1D] hover:bg-[#8E2C1D]/10"
                  >
                    <LogOut className="h-4 w-4" />
                    {t.logout}
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-2 md:hidden"
        dir={dir}
      >
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1 rounded-[24px] border border-white/80 bg-[#F7F2EC]/92 p-1.5 shadow-[0_-14px_40px_rgba(44,22,15,0.14)] backdrop-blur-xl">
          {bottomLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-[18px] px-1 py-2 text-[10px] font-black transition ${
                  active ? "bg-[#2C160F] text-[#F7F2EC] shadow-lg shadow-[#2C160F]/16" : "text-[#5B3422]/62 active:bg-[#E6D7C8]/60"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="w-full truncate text-center">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[60] bg-[#1F1A17]/45 backdrop-blur-sm transition md:hidden ${
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <aside
          className={`absolute top-0 h-full w-[82%] max-w-xs bg-[#F7F2EC] p-5 text-[#2C160F] shadow-2xl transition-transform duration-300 ${
            dir === "rtl" ? "right-0" : "left-0"
          } ${isMenuOpen ? "translate-x-0" : dir === "rtl" ? "translate-x-full" : "-translate-x-full"}`}
          onClick={(event) => event.stopPropagation()}
          dir={dir}
        >
          <div className="mb-7 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2C160F] text-[#F7F2EC]">
                <Scale className="h-5 w-5" />
              </span>
              <span className="text-2xl font-black">{t.brand}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E6D7C8]/60"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-2">
            {[
              { href: `/${locale}/search`, label: t.search, icon: Search },
              { href: `/${locale}/contact`, label: t.contact, icon: MessageSquare },
              { href: isLoggedIn ? `/${locale}/notifications` : `/${locale}/auth/login`, label: t.notifications, icon: Bell },
              ...(user?.is_admin ? [{ href: `/${locale}/admin`, label: t.admin, icon: LayoutDashboard }] : []),
            ].map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 text-sm font-black shadow-sm"
              >
                <item.icon className="h-4 w-4 text-[#5B3422]" />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-7 rounded-3xl bg-[#E6D7C8]/45 p-3">
            <p className="mb-2 px-1 text-xs font-black text-[#5B3422]/70">{t.language}</p>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLangChange(lang.code)}
                  className={`rounded-2xl px-3 py-3 text-sm font-black ${
                    locale === lang.code ? "bg-[#2C160F] text-[#F7F2EC]" : "bg-white/75 text-[#5B3422]"
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          <div className="absolute inset-x-5 bottom-5">
            {isLoggedIn ? (
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#8E2C1D]/10 px-4 py-3 text-sm font-black text-[#8E2C1D]"
              >
                <LogOut className="h-4 w-4" />
                {t.logout}
              </button>
            ) : (
              <Link
                href={`/${locale}/auth/login`}
                onClick={() => setIsMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2C160F] px-4 py-3 text-sm font-black text-[#F7F2EC]"
              >
                <LogIn className="h-4 w-4" />
                {t.login}
              </Link>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
