"use client";

import React, { useState, useEffect, use } from "react";
import { 
  Bot, 
  Settings, 
  MessageSquare, 
  FileText, 
  Key, 
  Cpu, 
  Save, 
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  X,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Loader2
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { adminService } from "@/services/adminService";
import { SystemConfig } from "@/types/admin";

export default function AiSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [welcomeLang, setWelcomeLang] = useState("ar");
  const [showApiKey, setShowApiKey] = useState(false);
  const [showToggleModal, setShowToggleModal] = useState(false);

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        setLoading(true);
        const data = await adminService.getConfigs();
        setConfigs(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch configurations");
      } finally {
        setLoading(false);
      }
    };
    fetchConfigs();
  }, []);

  const handleUpdateConfig = async (key: string, value: string) => {
    try {
      setIsSaving(key);
      const config = configs.find(c => c.key === key);
      const description = config?.description || "";
      await adminService.updateConfig(key, value, description);
      setConfigs(prev => prev.map(c => c.key === key ? { ...c, value } : c));
      setShowSuccess(key);
      setTimeout(() => setShowSuccess(null), 3000);
    } catch (err: any) {
      console.error("Failed to update config", err);
      alert(isAr ? "فشل تحديث الإعداد" : "Failed to update configuration");
    } finally {
      setIsSaving(null);
    }
  };

  const getConfigValue = (key: string, defaultValue: string = "") => {
    return configs.find(c => c.key === key)?.value || defaultValue;
  };

  const isAiEnabled = getConfigValue("ai_enabled", "true") === "true";

  const renderMaskedKey = (key: string) => {
    if (!key) return "";
    if (showApiKey || key.length <= 8) return key;
    return "•".repeat(key.length - 8) + key.slice(-8);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f1eb] flex flex-col" dir={dir}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#2C160F]/20" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f1eb] flex flex-col" dir={dir}>
      <Navbar />

      <div className="flex-1 pt-32 px-4 pb-24 md:pt-36 md:px-6 lg:pt-40 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Breadcrumb & Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <Link href={`/${locale}/admin`} className="inline-flex items-center gap-2 text-[#2C160F]/50 hover:text-[#2C160F] mb-2 transition-colors text-sm font-bold">
                {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                {isAr ? "العودة للوحة التحكم" : "Back to Dashboard"}
              </Link>
              <h1 className="text-3xl font-black text-[#2C160F] flex items-center gap-3">
                <Bot className="w-8 h-8 text-[#2C160F]/40" />
                {isAr ? "إعدادات المساعد الذكي" : "AI Assistant Settings"}
              </h1>
            </div>
          </div>

          <div className="space-y-6">
            {/* Toggle AI Status */}
            <div className="bg-white p-6 rounded-[2rem] border border-[#2C160F]/5 shadow-xl shadow-[#2C160F]/5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#2C160F] flex items-center gap-2 mb-1">
                  <Settings className="w-5 h-5 text-[#2C160F]/40" />
                  {isAr ? "حالة المساعد الذكي" : "AI Assistant Status"}
                </h3>
                <p className="text-sm font-medium text-[#2C160F]/50">
                  {isAr ? "تفعيل أو إيقاف المساعد الذكي في الموقع بالكامل" : "Enable or disable the AI assistant across the entire site"}
                </p>
              </div>
              <button
                onClick={() => setShowToggleModal(true)}
                className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${isAiEnabled ? "bg-green-500" : "bg-gray-300"}`}
              >
                <div className={`absolute top-1 ${isAiEnabled ? (isAr ? "left-1" : "right-1") : (isAr ? "right-1" : "left-1")} w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-sm`} />
              </button>
            </div>

            {/* AI Content Configuration */}
            <div className="bg-white p-6 rounded-[2rem] border border-[#2C160F]/5 shadow-xl shadow-[#2C160F]/5 space-y-6">
              <h3 className="text-lg font-bold text-[#2C160F] flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-[#2C160F]/40" />
                {isAr ? "محتوى المحادثة" : "Chat Content"}
              </h3>

              <div className="space-y-4 border border-[#2C160F]/5 p-5 rounded-2xl bg-[#f5f1eb]/30">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-[#2C160F]/70">
                    {isAr ? "رسالة الترحيب" : "Welcome Message"}
                  </label>
                  <select
                    value={welcomeLang}
                    onChange={(e) => setWelcomeLang(e.target.value)}
                    className="bg-white border-transparent focus:border-[#2C160F]/20 rounded-xl px-3 py-2 text-sm text-[#2C160F] font-bold outline-none cursor-pointer shadow-sm"
                  >
                    <option value="ar">{isAr ? "العربية" : "Arabic"}</option>
                    <option value="en">{isAr ? "English" : "English"}</option>
                  </select>
                </div>
                
                <div className="relative group">
                  <input
                    type="text"
                    defaultValue={getConfigValue(welcomeLang === "ar" ? "ai_welcome_ar" : "ai_welcome_en")}
                    onBlur={(e) => handleUpdateConfig(welcomeLang === "ar" ? "ai_welcome_ar" : "ai_welcome_en", e.target.value)}
                    className="w-full bg-white border-transparent focus:border-[#2C160F]/20 focus:ring-0 rounded-2xl px-5 py-4 text-[#2C160F] font-medium transition-all shadow-sm"
                    dir={welcomeLang === "ar" ? "rtl" : "ltr"}
                  />
                  {isSaving === (welcomeLang === "ar" ? "ai_welcome_ar" : "ai_welcome_en") && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-[#2C160F]/20" />
                  )}
                  {showSuccess === (welcomeLang === "ar" ? "ai_welcome_ar" : "ai_welcome_en") && (
                    <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#2C160F]/70">
                  {isAr ? "شروط وتعليمات الذكاء الاصطناعي (System Prompt)" : "AI Rules & Instructions (System Prompt)"}
                </label>
                <div className="relative">
                  <textarea
                    defaultValue={getConfigValue("ai_system_prompt")}
                    onBlur={(e) => handleUpdateConfig("ai_system_prompt", e.target.value)}
                    rows={5}
                    className="w-full bg-[#f5f1eb]/50 border-transparent focus:border-[#2C160F]/20 focus:bg-white focus:ring-0 rounded-2xl px-5 py-4 text-[#2C160F] font-medium transition-all resize-none shadow-inner"
                  />
                  {isSaving === "ai_system_prompt" && (
                    <Loader2 className="absolute bottom-4 right-4 w-5 h-5 animate-spin text-[#2C160F]/20" />
                  )}
                  {showSuccess === "ai_system_prompt" && (
                    <CheckCircle2 className="absolute bottom-4 right-4 w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>
            </div>

            {/* API & Model Settings */}
            <div className="bg-white p-6 rounded-[2rem] border border-[#2C160F]/5 shadow-xl shadow-[#2C160F]/5 space-y-6">
              <h3 className="text-lg font-bold text-[#2C160F] flex items-center gap-2 mb-4">
                <Cpu className="w-5 h-5 text-[#2C160F]/40" />
                {isAr ? "إعدادات النموذج والربط" : "Model & API Settings"}
              </h3>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#2C160F]/70">
                  {isAr ? "إصدار الذكاء الاصطناعي (Model)" : "AI Version (Model)"}
                </label>
                <div className="relative">
                  <select
                    value={getConfigValue("ai_model", "gemini-1.5-flash")}
                    onChange={(e) => handleUpdateConfig("ai_model", e.target.value)}
                    className="w-full bg-[#f5f1eb]/50 border-transparent focus:border-[#2C160F]/20 focus:bg-white focus:ring-0 rounded-2xl px-5 py-4 text-[#2C160F] font-bold transition-all appearance-none cursor-pointer shadow-inner"
                  >
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                  </select>
                  <div className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'left-5' : 'right-5'} pointer-events-none text-[#2C160F]/40`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#2C160F]/70">
                  {isAr ? "مفتاح الربط (API Key)" : "API Key"}
                </label>
                <div className="relative flex items-center bg-[#f5f1eb]/50 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[#2C160F]/20 focus-within:bg-white transition-all shadow-inner">
                  <Key className={`absolute ${isAr ? 'right-4' : 'left-4'} w-5 h-5 text-[#2C160F]/20`} />
                  <input
                    type={showApiKey ? "text" : "password"}
                    defaultValue={getConfigValue("ai_api_key")}
                    onBlur={(e) => handleUpdateConfig("ai_api_key", e.target.value)}
                    className={`w-full bg-transparent ${isAr ? 'pr-12 pl-12' : 'pl-12 pr-12'} py-4 text-[#2C160F] font-mono font-medium focus:outline-none`}
                    dir="ltr"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowApiKey(!showApiKey)}
                    className={`absolute ${isAr ? 'left-4' : 'right-4'} text-[#2C160F]/30 hover:text-[#2C160F] transition-all`}
                  >
                    {showApiKey ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showToggleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#2C160F]/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative border border-[#2C160F]/5">
            <button onClick={() => setShowToggleModal(false)} className={`absolute top-6 ${isAr ? 'left-6' : 'right-6'} p-2 text-[#2C160F]/40 hover:text-[#2C160F] transition-colors rounded-full hover:bg-[#f5f1eb]`}>
              <X className="w-5 h-5" />
            </button>
            <div className={`w-16 h-16 rounded-2xl ${isAiEnabled ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'} flex items-center justify-center mb-6`}>
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black mb-2 text-[#2C160F]">
              {isAiEnabled ? (isAr ? "إيقاف المساعد الذكي" : "Disable AI Assistant") : (isAr ? "تفعيل المساعد الذكي" : "Enable AI Assistant")}
            </h3>
            <p className="text-[#2C160F]/60 font-medium mb-8 leading-relaxed">
              {isAr 
                ? "سيؤدي هذا الإجراء إلى تغيير حالة المساعد الذكي في الموقع بالكامل. هل أنت متأكد؟"
                : "This action will change the AI assistant status across the entire site. Are you sure?"}
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowToggleModal(false)} className="flex-1 py-4 rounded-2xl font-black bg-[#f5f1eb] text-[#2C160F] hover:bg-[#2C160F]/5 transition-colors">
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button 
                onClick={() => {
                  handleUpdateConfig("ai_enabled", (!isAiEnabled).toString());
                  setShowToggleModal(false);
                }}
                className={`flex-1 py-4 rounded-2xl font-black text-white transition-all shadow-lg ${isAiEnabled ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {isAr ? "تأكيد" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
