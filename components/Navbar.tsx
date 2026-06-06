"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  Bell,
  BookOpen,
  Check,
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
import { lawService } from "@/services/lawService";
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
    browse: "Categories",
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
  const isAr = locale === "ar";
  const t = labels[locale];
  const isAuthPage = pathname.includes("/auth/");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [navSurface, setNavSurface] = useState<"light" | "dark">("dark");

  const fetchNotifications = async () => {
    if (!authService.getToken()) return;
    try {
      const data = await lawService.getMyNotifications();
      // عرض آخر إشعارين غير مقروءين فقط كما طلب المستخدم
      const unread = data.filter((n: any) => n.is_read === 0);
      setNotifications(unread.slice(0, 2)); 
      setUnreadCount(unread.length);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const handleMarkAsRead = async (notifId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await lawService.markAsRead(notifId);
      // تحديث القائمة محلياً وفورياً
      fetchNotifications();
      // إرسال حدث لتحديث صفحة الإشعارات إذا كانت مفتوحة
      window.dispatchEvent(new CustomEvent('notificationsUpdated'));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  useEffect(() => {
    const token = authService.getToken();
    setIsLoggedIn(!!token);

    if (token) {
      fetchNotifications();
    }

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
        if (error.message === 'Could not validate credentials' || error.message.includes('unauthorized')) {
          setIsLoggedIn(false);
          setUser(null);
        }
      }
    };

    loadUser();

    // Listen for profile updates
    const handleUpdate = () => {
      const updatedUser = authService.getUser();
      if (updatedUser) setUser({ ...updatedUser });
      fetchNotifications();
    };

    window.addEventListener('userUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('notificationsUpdated', fetchNotifications);

    return () => {
      window.removeEventListener('userUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('notificationsUpdated', fetchNotifications);
    };
  }, [pathname]);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsLangOpen(false);
    setIsProfileOpen(false);
    setIsNotificationsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const sampleSurface = () => {
      const navElements = Array.from(document.querySelectorAll<HTMLElement>("[data-adaptive-nav]"));
      const previousPointerEvents = navElements.map((element) => element.style.pointerEvents);

      navElements.forEach((element) => {
        element.style.pointerEvents = "none";
      });

      const probeX = Math.round(window.innerWidth / 2);
      const probeY = window.innerWidth < 768 ? 28 : 44;
      const elements = document.elementsFromPoint(probeX, probeY);
      const toneElement = elements.find((element) => element instanceof HTMLElement && element.dataset.navTone) as
        | HTMLElement
        | undefined;

      navElements.forEach((element, index) => {
        element.style.pointerEvents = previousPointerEvents[index] || "";
      });

      setNavSurface(toneElement?.dataset.navTone === "dark" ? "dark" : "light");
    };

    sampleSurface();
    window.addEventListener("scroll", sampleSurface, { passive: true });
    window.addEventListener("resize", sampleSurface);
    
    // Also sample when pathname changes
    const observer = new MutationObserver(sampleSurface);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", sampleSurface);
      window.removeEventListener("resize", sampleSurface);
      observer.disconnect();
    };
  }, []);

  const primaryHome = isLoggedIn ? `/${locale}/dashboard` : `/${locale}`;
  const profileHref = isLoggedIn ? `/${locale}/profile` : `/${locale}/auth/login`;

  const desktopLinks = useMemo(
    () =>
      isLoggedIn
        ? [
            { href: primaryHome, label: t.home, match: ["/dashboard"], exactHome: true },
            { href: `/${locale}/categories`, label: t.browse, match: ["/categories", "/laws"] },
            { href: `/${locale}/search`, label: t.search, match: ["/search"] },
            { href: `/${locale}/chat`, label: t.assistant, match: ["/chat"] },
            { href: `/${locale}/contact`, label: t.contact, match: ["/contact"] },
          ]
        : [
            { href: `/${locale}`, label: t.home, match: [], exactHome: true },
            { href: `/${locale}/contact`, label: t.contact, match: ["/contact"] },
          ],
    [isLoggedIn, locale, primaryHome, t]
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

  const isLightSurface = navSurface === "light";
  const navShellClass = isLightSurface
    ? "border-white/40 bg-white/45 text-[#2C160F] shadow-[0_8px_32px_rgba(44,22,15,0.08)] backdrop-blur-[18px]"
    : "border-white/10 bg-[rgba(32,11,5,0.45)] text-[#F7F2EC] shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur-[18px]";
  const navMutedClass = isLightSurface ? "text-[#2C160F]/72 hover:bg-[#2C160F] hover:text-[#F7F2EC] hover:scale-105" : "text-[#F7F2EC]/86 hover:bg-[#F7F2EC] hover:text-[#2C160F] hover:scale-105";
  const navActiveClass = isLightSurface ? "bg-[#2C160F] text-[#F7F2EC] shadow-md shadow-[#2C160F]/10" : "bg-[#F7F2EC] text-[#2C160F] shadow-lg shadow-black/10";
  const iconPillClass = isLightSurface ? "bg-[#2C160F] text-[#F7F2EC]" : "bg-[#F7F2EC] text-[#2C160F]";

  return (
    <>
      <AccessibilityControls locale={locale} />

      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:hidden" dir={dir} data-adaptive-nav>
        <div className={`mx-auto flex h-14 max-w-md items-center justify-between rounded-[22px] border px-3 backdrop-blur-xl transition-colors duration-300 ${navShellClass}`}>
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl transition active:scale-95"
            aria-label={t.menu}
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href={primaryHome} className="flex items-center gap-2">
            <span className="tabayun-display text-2xl font-black leading-none">{locale === "ar" ? "تبايــن" : t.brand}</span>
            <span className={`flex h-8 w-8 items-center justify-center rounded-xl shadow-lg shadow-[#2C160F]/15 ${iconPillClass}`}>
              <Scale className="h-4 w-4" />
            </span>
          </Link>

          <Link
            href={isLoggedIn ? `/${locale}/notifications` : `/${locale}/auth/login`}
            className="relative flex h-10 w-10 items-center justify-center rounded-2xl transition active:scale-95"
            aria-label={isLoggedIn ? t.notifications : t.login}
          >
            {isLoggedIn ? <Bell className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
            {isLoggedIn && unreadCount > 0 && <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#8E2C1D]" />}
          </Link>
        </div>
      </header>

      <div className="fixed inset-x-0 top-6 z-50 hidden justify-center px-4 md:flex" dir={dir} data-adaptive-nav>
        <nav className={`flex w-full max-w-6xl items-center justify-between rounded-full border px-5 py-3 backdrop-blur-xl transition-colors duration-300 ${navShellClass}`}>
          <Link href={primaryHome} className="flex items-center gap-3">
            <span className={`flex h-10 w-10 items-center justify-center rounded-full ${iconPillClass}`}>
              <Scale className="h-5 w-5" />
            </span>
            <span className="tabayun-display text-2xl font-black">{locale === "ar" ? "تبايــن" : t.brand}</span>
          </Link>

          <div className="flex items-center gap-2 text-sm font-black">
            {desktopLinks.map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className={`rounded-full px-4 py-2 transition ${
                  isActive(item) ? navActiveClass : navMutedClass
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
                className={`flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-bold transition hover:scale-105 ${
                  isLightSurface ? "border-[#2C160F]/12 bg-[#2C160F]/6 hover:bg-[#2C160F] hover:text-[#F7F2EC]" : "border-white/15 bg-white/8 hover:bg-white/14"
                }`}
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
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition hover:scale-110 active:scale-95 ${
                    isLightSurface 
                    ? "border-[#2C160F]/12 bg-[#2C160F]/6 hover:bg-[#2C160F] hover:text-[#F7F2EC] shadow-sm" 
                    : "border-white/15 bg-white/8 hover:bg-white/18"
                  }`}
                  aria-label={t.notifications}
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#E56B55]" />}
                </button>

                {isNotificationsOpen && (
                  <div className="absolute end-0 top-full mt-3 w-80 rounded-2xl border border-[#E6D7C8] bg-[#F7F2EC] p-4 text-[#2C160F] shadow-2xl z-[100]">
                    <div className="flex items-center justify-between mb-4 px-1">
                      <h3 className="font-black text-sm">{t.notifications}</h3>
                      {unreadCount > 0 && (
                        <span className="text-[10px] bg-[#2C160F] text-white px-2 py-0.5 rounded-full font-bold">
                          {unreadCount} {isAr ? "جديد" : "New"}
                        </span>
                      )}
                    </div>

                    {notifications.length > 0 ? (
                      <div className="mb-4 space-y-2">
                        {notifications.map((notif) => (
                          <div key={notif.id} className="relative group rounded-xl bg-white border border-[#E6D7C8]/50 p-3 transition hover:border-[#2C160F]/20 shadow-sm">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-black line-clamp-1 text-[#2C160F]">{notif.title}</p>
                                <p className="mt-1 text-[10px] font-bold text-[#2C160F]/60 line-clamp-2 leading-relaxed">{notif.message}</p>
                              </div>
                              <button
                                onClick={(e) => handleMarkAsRead(notif.id, e)}
                                className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg bg-[#2C160F]/5 text-[#2C160F]/40 hover:bg-[#2C160F] hover:text-white transition-all shadow-sm active:scale-95"
                                title={isAr ? "تحديد كمقروء" : "Mark as read"}
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-[#2C160F]/20">
                          <Bell className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-bold text-[#2C160F]/40 max-w-[180px] mx-auto leading-relaxed">
                          {t.noNotifications}
                        </p>
                      </div>
                    )}
                    <Link
                      href={`/${locale}/notifications`}
                      className="block w-full rounded-xl bg-[#2C160F] px-4 py-3 text-center text-sm font-black text-[#F7F2EC] hover:bg-[#2C160F]/90 transition-all shadow-lg active:scale-[0.98]"
                      onClick={() => setIsNotificationsOpen(false)}
                    >
                      {isAr ? "عرض كل التنبيهات" : "View all alerts"}
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
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition hover:scale-110 ${
                  isLightSurface ? "border-[#2C160F]/12 bg-[#2C160F]/6 hover:bg-[#2C160F] hover:text-[#F7F2EC]" : "border-white/25 bg-white/8 hover:bg-white/14"
                }`}
                aria-label={isLoggedIn ? t.profile : t.login}
              >
                {isLoggedIn ? (
                  user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <User className="h-4 w-4" />
                  )
                ) : (
                  <LogIn className="h-4 w-4" />
                )}
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

      {isLoggedIn && (
        <nav
          className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-2 md:hidden"
          dir={dir}
        >
          <div className="mx-auto grid max-w-md grid-cols-5 gap-1 rounded-[24px] border border-white/40 bg-white/45 p-1.5 shadow-[0_-14px_40px_rgba(44,22,15,0.08)] backdrop-blur-[18px]">
            {bottomLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-[18px] px-1 py-2 text-[10px] font-black transition ${
                    active ? "bg-[#2C160F] text-[#F7F2EC] shadow-lg shadow-[#2C160F]/16" : "text-[#2C160F]/72 active:bg-[#2C160F]/8"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="w-full truncate text-center">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      <div
        className={`fixed inset-0 z-[60] bg-[#2C160F]/45 backdrop-blur-sm transition md:hidden ${
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
            {(isLoggedIn
              ? [
                  { href: `/${locale}/search`, label: t.search, icon: Search },
                  { href: `/${locale}/contact`, label: t.contact, icon: MessageSquare },
                  { href: `/${locale}/notifications`, label: t.notifications, icon: Bell, badge: unreadCount > 0 },
                  ...(user?.is_admin ? [{ href: `/${locale}/admin`, label: t.admin, icon: LayoutDashboard }] : []),
                ]
              : [{ href: `/${locale}/contact`, label: t.contact, icon: MessageSquare }]
            ).map((item: any) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3 text-sm font-black shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 text-[#2C160F]" />
                  {item.label}
                </div>
                {item.badge && (
                  <span className="h-2 w-2 rounded-full bg-[#8E2C1D]" />
                )}
              </Link>
            ))}
          </div>

          <div className="mt-7 rounded-3xl bg-[#E6D7C8]/45 p-3">
            <p className="mb-2 px-1 text-xs font-black text-[#2C160F]/70">{t.language}</p>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLangChange(lang.code)}
                  className={`rounded-2xl px-3 py-3 text-sm font-black ${
                    locale === lang.code ? "bg-[#2C160F] text-[#F7F2EC]" : "bg-white/75 text-[#2C160F]"
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
