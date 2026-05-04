"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { User as UserIcon, Mail, Globe, Languages, Heart, LogOut, Camera, ChevronLeft, ChevronRight, Loader2, Lock, X, Eye, EyeOff, LayoutDashboard } from "lucide-react";
import Navbar from "@/components/Navbar";
import { authService } from "@/services/authService";
import { lawService } from "@/services/lawService";
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
  const [editingField, setEditingField] = useState<string | null>(null);
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [formValues, setFormValues] = useState({ 
    name: "", 
    email: "", 
    country: "", 
    language: "", 
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showForgotDialog, setShowForgotDialog] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Try getting from localStorage first for instant display
        const cachedUser = authService.getUser();
        if (cachedUser) {
          setUser(cachedUser);
        }
        
        // Refresh with fresh data from server
        const [freshUser, countries] = await Promise.all([
          authService.getMe(),
          lawService.getAvailableCountries().catch(() => [] as string[])
        ]);
        
        setUser(freshUser);
        if (countries) {
          setAvailableCountries(countries.includes('sa') ? countries : ['sa', ...countries]);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
        // If it fails and we have no cached user, redirect to login
        if (!authService.getUser()) {
          router.push(`/${locale}/auth/login`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locale, router]);

  const handleEditToggle = (field: string, currentValue: string) => {
    if (editingField === field) {
      setEditingField(null);
      setErrors({});
      setSuccessMessage(null);
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } else {
      setEditingField(field);
      setErrors({});
      setSuccessMessage(null);
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setFormValues({ 
        ...formValues, 
        [field]: currentValue, 
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    }
  };

  const handleUpdate = async (field: string) => {
    try {
      setErrors({});
      setIsUpdating(true);
      let payload: any = {};
      
      if (field === 'name') {
        if (!formValues.name) {
          setErrors({ name: locale === 'ar' ? 'الاسم مطلوب' : 'Name is required' });
          setIsUpdating(false);
          return;
        }
        payload = { full_name: formValues.name };
      } else if (field === 'email') {
        const newErrors: any = {};
        if (!formValues.email) newErrors.email = locale === 'ar' ? 'البريد مطلوب' : 'Email is required';
        if (!formValues.currentPassword) newErrors.currentPassword = locale === 'ar' ? 'كلمة المرور الحالية مطلوبة' : 'Current password is required';
        
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          setIsUpdating(false);
          return;
        }
        payload = { email: formValues.email, current_password: formValues.currentPassword };
      } else if (field === 'password') {
        const newErrors: any = {};
        if (!formValues.currentPassword) newErrors.currentPassword = locale === 'ar' ? 'كلمة المرور الحالية مطلوبة' : 'Current password is required';
        if (!formValues.newPassword) newErrors.newPassword = locale === 'ar' ? 'كلمة المرور الجديدة مطلوبة' : 'New password is required';
        if (formValues.newPassword && formValues.newPassword !== formValues.confirmPassword) {
          newErrors.confirmPassword = locale === 'ar' ? 'كلمة المرور الجديدة غير متطابقة' : 'New passwords do not match';
        }
        
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          setIsUpdating(false);
          return;
        }
        payload = { password: formValues.newPassword, current_password: formValues.currentPassword };
      } else if (field === 'country') {
        payload = { country: formValues.country };
      } else if (field === 'language') {
        payload = { language: formValues.language };
      }

      const updatedUser = await authService.updateProfile(payload);
      setUser(updatedUser);
      setErrors({});
      setSuccessMessage(locale === 'ar' ? 'تم التحديث بنجاح' : 'Updated successfully');
      
      // Clear success message and close editor after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
        setEditingField(null);
      }, 3000);
      
      if (field === 'language' && formValues.language !== locale) {
        router.push(`/${formValues.language}/profile`);
      }
    } catch (error: any) {
      const msg = error.message || (locale === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred');
      setErrors({ general: msg });
    } finally {
      setIsUpdating(false);
    }
  };

  const profileItems = [
    {
      id: 'name',
      label: profileDict.name || (locale === 'ar' ? 'الاسم' : 'Name'),
      value: user?.full_name || (locale === 'ar' ? 'غير متوفر' : 'N/A'),
      icon: UserIcon,
      onClick: () => handleEditToggle('name', user?.full_name || '')
    },
    {
      id: 'email',
      label: profileDict.email || (locale === 'ar' ? 'البريد الالكتروني' : 'Email'),
      value: user?.email || 'N/A',
      icon: Mail,
      onClick: () => handleEditToggle('email', user?.email || '')
    },
    {
      id: 'password',
      label: locale === 'ar' ? 'تغيير كلمة المرور' : 'Change Password',
      value: '••••••••',
      icon: Lock,
      onClick: () => handleEditToggle('password', '')
    },
    {
      id: 'country',
      label: profileDict.country || (locale === 'ar' ? 'الدولة' : 'Country'),
      value: user?.country || (locale === 'ar' ? 'غير محدد' : 'N/A'),
      icon: Globe,
      onClick: () => handleEditToggle('country', user?.country || 'sa')
    },
    {
      id: 'language',
      label: profileDict.language || (locale === 'ar' ? 'اللغة' : 'Language'),
      value: user?.language || (locale === 'ar' ? 'عربي' : 'Arabic'),
      icon: Languages,
      onClick: () => handleEditToggle('language', user?.language || locale)
    },
    {
      id: 'favorites',
      label: profileDict.favorites || (locale === 'ar' ? 'المفضلة' : 'Favorites'),
      value: (locale === 'ar' ? 'قوانين محفوظة' : 'Saved Laws'),
      icon: Heart,
      href: `/${locale}/profile/favorites`
    },
    ...(user?.is_admin ? [{
      id: 'admin',
      label: locale === 'ar' ? 'لوحة التحكم' : 'Admin Panel',
      value: locale === 'ar' ? 'إدارة النظام' : 'System Management',
      icon: LayoutDashboard,
      href: `/${locale}/admin`
    }] : []),
  ];

  const handleLogout = () => {
    authService.logout();
    router.push(`/${locale}/auth/login`);
  };

  if (loading && !user) {
    return (
      <main className="min-h-screen bg-[#f5f1eb] flex flex-col items-center justify-center">
        <Navbar />
        <Loader2 className="w-12 h-12 text-[#2C160F] animate-spin" />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center overflow-x-hidden bg-[#f5f1eb]" dir={dir}>
      <Navbar />

      <div className="relative z-20 w-full flex flex-col items-center pt-40 md:pt-48 pb-20 px-4">

        {/* Header Section */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-4xl md:text-5xl font-black text-[#2C160F] mb-4 font-bold tracking-tight">
            {profileDict.title || (locale === "ar" ? "الملف الشخصي" : "Profile")}
          </h1>
          <p className="text-[#2C160F]/60 text-lg font-regular">
            {locale === "ar" ? "إدارة معلومات حسابك الشخصي" : "Manage your personal account information"}
          </p>
        </div>

        {/* Profile Card */}
        <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-xl shadow-[#2C160F]/5 border border-[#2C160F]/10 overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-700 delay-150 fill-mode-backwards p-8 md:p-12">

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

            <button className="flex items-center gap-2 text-[#2C160F] font-bold text-sm md:text-base hover:text-[#2C160F]/70 transition-colors bg-[#f5f1eb] px-4 py-2 rounded-full">
              <Camera className="w-4 h-4" />
              {profileDict.changePhoto || "تغيير الصورة"}
            </button>
          </div>

          {/* Info List */}
          <div className="space-y-6">
            {profileItems.map((item, index) => {
              const content = (
                <>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-[#f5f1eb] text-[#2C160F] group-hover:bg-[#2C160F] group-hover:text-white transition-colors duration-300">
                      <item.icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-[#2C160F]/50 font-medium">
                        {item.label}
                      </span>
                      <span className="text-lg md:text-xl font-bold text-[#2C160F]">
                        {item.value}
                      </span>
                    </div>
                  </div>

                  {locale === "ar" ? (
                    <ChevronLeft className="w-5 h-5 text-[#2C160F]/30 group-hover:text-[#2C160F] transition-colors" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-[#2C160F]/30 group-hover:text-[#2C160F] transition-colors" />
                  )}
                </>
              );

              const className = `flex items-center w-full justify-between p-4 rounded-2xl hover:bg-[#f5f1eb]/50 transition-colors group border-b border-[#f5f1eb] last:border-0 ${item.href || item.onClick ? 'cursor-pointer' : ''}`;

              if (item.href) {
                return (
                  <Link href={item.href} key={index} className={className}>
                    {content}
                  </Link>
                );
              }

              return (
                <div key={index} className="flex flex-col">
                  <div onClick={item.onClick} className={className}>
                    {content}
                  </div>
                  {item.id && editingField === item.id && (
                    <div className="p-6 bg-[#f5f1eb]/30 rounded-2xl border border-[#f5f1eb] mt-2 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                      
                      {successMessage && (
                        <div className="bg-green-50 text-green-600 px-4 py-3 rounded-xl text-sm font-bold border border-green-100 flex items-center gap-2 animate-in zoom-in-95 duration-300">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          {successMessage}
                        </div>
                      )}

                      {errors.general && (
                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold border border-red-100">
                          {errors.general}
                        </div>
                      )}

                      {item.id === 'name' && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-[#2C160F]/70">
                            {locale === 'ar' ? 'تغيير الاسم:' : 'Change Name:'}
                          </label>
                          <input 
                            type="text" 
                            value={formValues.name} 
                            onChange={e => {
                              setFormValues({...formValues, name: e.target.value});
                              if (errors.name) setErrors({...errors, name: ""});
                            }} 
                            className={`w-full bg-white border ${errors.name ? 'border-red-500' : 'border-[#2C160F]/10'} rounded-xl px-4 py-3 text-[#2C160F] focus:outline-none focus:border-[#2C160F]/30 transition-colors`} 
                            placeholder={locale === 'ar' ? 'أدخل الاسم الجديد' : 'Enter new name'} 
                          />
                          {errors.name && <p className="text-red-500 text-xs font-bold">{errors.name}</p>}
                        </div>
                      )}
                      
                      {item.id === 'email' && (
                        <>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-[#2C160F]/70">
                              {locale === 'ar' ? 'تغيير البريد الالكتروني:' : 'Change Email:'}
                            </label>
                            <input 
                              type="email" 
                              value={formValues.email} 
                              onChange={e => {
                                setFormValues({...formValues, email: e.target.value});
                                if (errors.email) setErrors({...errors, email: ""});
                              }} 
                              className={`w-full bg-white border ${errors.email ? 'border-red-500' : 'border-[#2C160F]/10'} rounded-xl px-4 py-3 text-[#2C160F] focus:outline-none focus:border-[#2C160F]/30 transition-colors`} 
                              placeholder={locale === 'ar' ? 'أدخل البريد الجديد' : 'Enter new email'} 
                            />
                            {errors.email && <p className="text-red-500 text-xs font-bold">{errors.email}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-[#2C160F]/70">
                              {locale === 'ar' ? 'كلمة المرور لتأكيد التغيير:' : 'Password to confirm change:'}
                            </label>
                            <div className="relative">
                              <input 
                                type={showCurrentPassword ? "text" : "password"} 
                                value={formValues.currentPassword} 
                                onChange={e => {
                                  setFormValues({...formValues, currentPassword: e.target.value});
                                  if (errors.currentPassword) setErrors({...errors, currentPassword: ""});
                                }} 
                                className={`w-full bg-white border ${errors.currentPassword ? 'border-red-500' : 'border-[#2C160F]/10'} rounded-xl px-4 py-3 pe-12 text-[#2C160F] focus:outline-none focus:border-[#2C160F]/30 transition-colors`} 
                                placeholder="••••••••" 
                              />
                              <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className={`absolute inset-y-0 ${locale === 'ar' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center text-[#2C160F]/30 hover:text-[#2C160F]/60 transition-colors`}
                              >
                                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                            {errors.currentPassword && <p className="text-red-500 text-xs font-bold">{errors.currentPassword}</p>}
                            <div className="flex justify-start">
                              <button 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  setForgotEmail(user?.email || "");
                                  setShowForgotDialog(true); 
                                }}
                                className="text-xs font-bold text-blue-600 hover:underline"
                              >
                                {locale === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                              </button>
                            </div>
                          </div>
                        </>
                      )}

                      {item.id === 'password' && (
                        <>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-[#2C160F]/70">
                              {locale === 'ar' ? 'كلمة المرور الحالية:' : 'Current Password:'}
                            </label>
                            <div className="relative">
                              <input 
                                type={showCurrentPassword ? "text" : "password"} 
                                value={formValues.currentPassword} 
                                onChange={e => {
                                  setFormValues({...formValues, currentPassword: e.target.value});
                                  if (errors.currentPassword) setErrors({...errors, currentPassword: ""});
                                }} 
                                className={`w-full bg-white border ${errors.currentPassword ? 'border-red-500' : 'border-[#2C160F]/10'} rounded-xl px-4 py-3 pe-12 text-[#2C160F] focus:outline-none focus:border-[#2C160F]/30 transition-colors`} 
                                placeholder="••••••••" 
                              />
                              <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className={`absolute inset-y-0 ${locale === 'ar' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center text-[#2C160F]/30 hover:text-[#2C160F]/60 transition-colors`}
                              >
                                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                            {errors.currentPassword && <p className="text-red-500 text-xs font-bold">{errors.currentPassword}</p>}
                            <div className="flex justify-start">
                              <button 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  setForgotEmail(user?.email || "");
                                  setShowForgotDialog(true); 
                                }}
                                className="text-xs font-bold text-blue-600 hover:underline"
                              >
                                {locale === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                              </button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-[#2C160F]/70">
                              {locale === 'ar' ? 'كلمة المرور الجديدة:' : 'New Password:'}
                            </label>
                            <div className="relative">
                              <input 
                                type={showNewPassword ? "text" : "password"} 
                                value={formValues.newPassword} 
                                onChange={e => {
                                  setFormValues({...formValues, newPassword: e.target.value});
                                  if (errors.newPassword) setErrors({...errors, newPassword: ""});
                                }} 
                                className={`w-full bg-white border ${errors.newPassword ? 'border-red-500' : 'border-[#2C160F]/10'} rounded-xl px-4 py-3 pe-12 text-[#2C160F] focus:outline-none focus:border-[#2C160F]/30 transition-colors`} 
                                placeholder="••••••••" 
                              />
                              <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className={`absolute inset-y-0 ${locale === 'ar' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center text-[#2C160F]/30 hover:text-[#2C160F]/60 transition-colors`}
                              >
                                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                            {errors.newPassword && <p className="text-red-500 text-xs font-bold">{errors.newPassword}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-[#2C160F]/70">
                              {locale === 'ar' ? 'تكرار كلمة المرور الجديدة:' : 'Confirm New Password:'}
                            </label>
                            <div className="relative">
                              <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                value={formValues.confirmPassword} 
                                onChange={e => {
                                  setFormValues({...formValues, confirmPassword: e.target.value});
                                  if (errors.confirmPassword) setErrors({...errors, confirmPassword: ""});
                                }} 
                                className={`w-full bg-white border ${errors.confirmPassword ? 'border-red-500' : 'border-[#2C160F]/10'} rounded-xl px-4 py-3 pe-12 text-[#2C160F] focus:outline-none focus:border-[#2C160F]/30 transition-colors`} 
                                placeholder="••••••••" 
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className={`absolute inset-y-0 ${locale === 'ar' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center text-[#2C160F]/30 hover:text-[#2C160F]/60 transition-colors`}
                              >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                            {errors.confirmPassword && <p className="text-red-500 text-xs font-bold">{errors.confirmPassword}</p>}
                          </div>
                        </>
                      )}

                      {item.id === 'country' && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-[#2C160F]/70">
                            {locale === 'ar' ? 'اختر الدولة الجديدة:' : 'Select new Country:'}
                          </label>
                          <select value={formValues.country} onChange={e => setFormValues({...formValues, country: e.target.value})} className="w-full bg-white border border-[#2C160F]/10 rounded-xl px-4 py-3 text-[#2C160F] focus:outline-none focus:border-[#2C160F]/30 transition-colors appearance-none">
                            {availableCountries.map(c => (
                              <option key={c} value={c}>{c === 'sa' ? (locale === 'ar' ? 'السعودية' : 'Saudi Arabia') : c.toUpperCase()}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {item.id === 'language' && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-[#2C160F]/70">
                            {locale === 'ar' ? 'اختر اللغة الجديدة:' : 'Select new Language:'}
                          </label>
                          <select value={formValues.language} onChange={e => setFormValues({...formValues, language: e.target.value})} className="w-full bg-white border border-[#2C160F]/10 rounded-xl px-4 py-3 text-[#2C160F] focus:outline-none focus:border-[#2C160F]/30 transition-colors appearance-none">
                            <option value="ar">العربية (Arabic)</option>
                            <option value="en">English (الإنجليزية)</option>
                          </select>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center gap-3 justify-end pt-2 border-t border-[#2C160F]/5 mt-4">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setEditingField(null); }}
                          className="px-6 py-2.5 rounded-xl font-bold text-[#2C160F]/70 bg-white border border-[#2C160F]/10 hover:bg-[#f5f1eb] transition-colors mt-4"
                        >
                          {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleUpdate(item.id || ''); }}
                          disabled={isUpdating}
                          className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#2C160F] hover:bg-[#2C160F]/90 transition-colors mt-4 disabled:opacity-50"
                        >
                          {isUpdating ? (locale === 'ar' ? 'جاري التحديث...' : 'Updating...') : (locale === 'ar' ? 'تنفيذ وتأكيد التغيير' : 'Confirm Change')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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

      {/* Forgot Password Dialog */}
      {showForgotDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-[#2C160F]">
                  {locale === 'ar' ? 'إعادة تعيين كلمة المرور' : 'Reset Password'}
                </h3>
                <button 
                  onClick={() => setShowForgotDialog(false)}
                  className="p-2 hover:bg-[#f5f1eb] rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-[#2C160F]/40" />
                </button>
              </div>
              
              <p className="text-[#2C160F]/60 mb-6">
                {locale === 'ar' 
                  ? 'سوف نقوم بإرسال رابط لإعادة تعيين كلمة المرور على بريدك المسجل.' 
                  : 'We will send a password reset link to your registered email.'}
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#2C160F]">
                    {locale === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-[#2C160F]/30">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      value={forgotEmail}
                      readOnly
                      placeholder="example@email.com"
                      className="w-full bg-[#f5f1eb] border-2 border-transparent rounded-2xl ps-12 pe-4 py-4 text-[#2C160F]/50 cursor-not-allowed focus:outline-none transition-all"
                      dir="ltr"
                    />
                  </div>
                </div>

                <button
                  onClick={async () => {
                    setIsSendingReset(true);
                    setErrors({});
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    setIsSendingReset(false);
                    setSuccessMessage(locale === 'ar' 
                      ? 'تم إرسال تعليمات إعادة تعيين كلمة المرور إلى بريدك الإلكتروني' 
                      : 'Password reset instructions have been sent to your email');
                    
                    setTimeout(() => {
                      setShowForgotDialog(false);
                      setForgotEmail("");
                      setSuccessMessage(null);
                    }, 3000);
                  }}
                  disabled={isSendingReset}
                  className="w-full py-4 rounded-2xl font-black text-white bg-[#2C160F] hover:bg-[#2C160F]/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSendingReset ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    locale === 'ar' ? 'إرسال رابط التعيين' : 'Send Reset Link'
                  )}
                </button>
                
                {errors.forgot && <p className="text-red-500 text-xs font-bold text-center mt-2">{errors.forgot}</p>}
                {successMessage && !editingField && (
                  <p className="text-green-600 text-xs font-bold text-center mt-2">{successMessage}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
