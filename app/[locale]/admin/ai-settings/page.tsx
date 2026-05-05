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
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function AiSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  // Form State
  const [isAiEnabled, setIsAiEnabled] = useState(true);
  const [welcomeMessageAr, setWelcomeMessageAr] = useState("");
  const [welcomeMessageEn, setWelcomeMessageEn] = useState("");
  const [welcomeLang, setWelcomeLang] = useState("ar");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [aiModel, setAiModel] = useState("gemini-flash-3");
  const [customModelName, setCustomModelName] = useState("");
  const [customModelsList, setCustomModelsList] = useState<string[]>([]);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Modal State
  const [showToggleModal, setShowToggleModal] = useState(false);

  // Load saved settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("tabayun_ai_settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.isAiEnabled !== undefined) setIsAiEnabled(parsed.isAiEnabled);
        if (parsed.welcomeMessageAr) setWelcomeMessageAr(parsed.welcomeMessageAr);
        if (parsed.welcomeMessageEn) setWelcomeMessageEn(parsed.welcomeMessageEn);
        if (parsed.systemPrompt) setSystemPrompt(parsed.systemPrompt);
        if (parsed.aiModel) setAiModel(parsed.aiModel);
        if (parsed.customModelName) setCustomModelName(parsed.customModelName);
        if (parsed.customModelsList) setCustomModelsList(parsed.customModelsList);
        if (parsed.apiKey) setApiKey(parsed.apiKey);
      } catch (e) {
        console.error("Failed to parse AI settings", e);
      }
    } else {
      // Default initial values
      setWelcomeMessageAr("أهلاً بك في مساعد تباين. اسألني عن أي موقف قانوني داخل السعودية وسأعطيك خلاصة واضحة مع تنبيه عند الحاجة.");
      setWelcomeMessageEn("Welcome to Tabayun Assistant. Ask me about any legal situation in Saudi Arabia and I will provide a clear summary with alerts when needed.");
      setSystemPrompt(isAr ? "أنت مساعد ذكي متخصص في القوانين السعودية. يجب عليك الإجابة بدقة وبناءً على النصوص القانونية المتاحة." : "You are an AI assistant specialized in Saudi laws. You must answer accurately based on the available legal texts.");
    }
  }, [isAr]);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      const settingsToSave = {
        isAiEnabled,
        welcomeMessageAr,
        welcomeMessageEn,
        systemPrompt,
        aiModel,
        customModelName,
        customModelsList,
        apiKey
      };
      localStorage.setItem("tabayun_ai_settings", JSON.stringify(settingsToSave));
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  const confirmToggleAi = () => {
    setIsAiEnabled(!isAiEnabled);
    setShowToggleModal(false);
  };

  const handleAddCustomModel = () => {
    if (customModelName.trim()) {
      const newModel = customModelName.trim();
      if (!customModelsList.includes(newModel)) {
        setCustomModelsList([...customModelsList, newModel]);
      }
      setAiModel(newModel);
      setCustomModelName("");
    }
  };

  // Helper to mask API key (keep last 4 visible)
  const renderMaskedKey = (key: string) => {
    if (!key) return "";
    if (showApiKey || key.length <= 4) return key;
    return "•".repeat(key.length - 4) + key.slice(-4);
  };

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
              <p className="text-[#2C160F]/50 font-medium text-sm mt-1">
                {isAr ? "تخصيص سلوك ونموذج الذكاء الاصطناعي للمنصة" : "Customize the AI behavior and model for the platform"}
              </p>
            </div>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 bg-[#2C160F] hover:bg-[#2C160F]/90 text-white px-6 py-3.5 rounded-2xl font-black transition-all disabled:opacity-70 shadow-xl shadow-[#2C160F]/10 active:scale-95"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : showSuccess ? (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isSaving 
                ? (isAr ? "جاري الحفظ..." : "Saving...") 
                : showSuccess 
                  ? (isAr ? "تم الحفظ!" : "Saved!") 
                  : (isAr ? "حفظ التغييرات" : "Save Changes")}
            </button>
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
              <div>
                <h3 className="text-lg font-bold text-[#2C160F] flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-[#2C160F]/40" />
                  {isAr ? "محتوى المحادثة" : "Chat Content"}
                </h3>
              </div>

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
                    <option value="ar">{isAr ? "اللغة العربية" : "Arabic"}</option>
                    <option value="en">{isAr ? "اللغة الإنجليزية" : "English"}</option>
                  </select>
                </div>
                
                {welcomeLang === "ar" ? (
                  <input
                    type="text"
                    value={welcomeMessageAr}
                    onChange={(e) => setWelcomeMessageAr(e.target.value)}
                    className="w-full bg-[#f5f1eb] border-transparent focus:border-[#2C160F]/20 focus:bg-white focus:ring-0 rounded-2xl px-5 py-4 text-[#2C160F] font-medium transition-all"
                    placeholder={isAr ? "اكتب رسالة الترحيب باللغة العربية هنا..." : "Type the welcome message in Arabic here..."}
                    dir="rtl"
                  />
                ) : (
                  <input
                    type="text"
                    value={welcomeMessageEn}
                    onChange={(e) => setWelcomeMessageEn(e.target.value)}
                    className="w-full bg-[#f5f1eb] border-transparent focus:border-[#2C160F]/20 focus:bg-white focus:ring-0 rounded-2xl px-5 py-4 text-[#2C160F] font-medium transition-all"
                    placeholder={isAr ? "اكتب رسالة الترحيب باللغة الإنجليزية هنا..." : "Type the welcome message in English here..."}
                    dir="ltr"
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#2C160F]/70">
                  {isAr ? "شروط وتعليمات الذكاء الاصطناعي (System Prompt)" : "AI Rules & Instructions (System Prompt)"}
                </label>
                <div className="relative">
                  <textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    rows={5}
                    className="w-full bg-[#f5f1eb] border-transparent focus:border-[#2C160F]/20 focus:bg-white focus:ring-0 rounded-2xl px-5 py-4 text-[#2C160F] font-medium transition-all resize-none"
                    placeholder={isAr ? "حدد كيف يجب أن يتصرف المساعد..." : "Define how the assistant should behave..."}
                  />
                  <FileText className="absolute bottom-4 left-4 w-5 h-5 text-[#2C160F]/20" />
                </div>
                <p className="text-xs text-[#2C160F]/40 flex items-center gap-1 mt-2">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {isAr ? "ملاحظة: سيتم جلب شروط الذكاء الاصطناعي لاحقاً من الخادم (Backend) بشكل مباشر." : "Note: AI Rules will be fetched directly from the Backend later."}
                </p>
              </div>
            </div>

            {/* API & Model Settings */}
            <div className="bg-white p-6 rounded-[2rem] border border-[#2C160F]/5 shadow-xl shadow-[#2C160F]/5 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[#2C160F] flex items-center gap-2 mb-4">
                  <Cpu className="w-5 h-5 text-[#2C160F]/40" />
                  {isAr ? "إعدادات النموذج والربط" : "Model & API Settings"}
                </h3>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#2C160F]/70">
                  {isAr ? "إصدار الذكاء الاصطناعي (Model)" : "AI Version (Model)"}
                </label>
                <div className="relative">
                  <select
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value)}
                    className="w-full bg-[#f5f1eb] border-transparent focus:border-[#2C160F]/20 focus:bg-white focus:ring-0 rounded-2xl px-5 py-4 text-[#2C160F] font-bold transition-all appearance-none cursor-pointer"
                  >
                    <option value="gemini-flash-3">Gemini Flash 3</option>
                    <option value="deepseek-coder">DeepSeek Coder</option>
                    <option value="deepseek-chat">DeepSeek Chat</option>
                    <option value="chatgpt-4o">ChatGPT-4o</option>
                    <option value="chatgpt-3.5">ChatGPT-3.5 Turbo</option>
                    {customModelsList.map((model) => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                    <option value="custom">{isAr ? "إضافة موديل مخصص..." : "Add custom model..."}</option>
                  </select>
                  <div className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'left-5' : 'right-5'} pointer-events-none text-[#2C160F]/40`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
                
                {aiModel === "custom" && (
                  <div className="pt-3 animate-in fade-in slide-in-from-top-2 relative flex items-center gap-3">
                    <input
                      type="text"
                      value={customModelName}
                      onChange={(e) => setCustomModelName(e.target.value)}
                      className="w-full bg-white border border-[#2C160F]/10 focus:border-[#2C160F]/30 rounded-2xl px-5 py-4 text-[#2C160F] font-medium transition-all"
                      placeholder={isAr ? "اكتب اسم الموديل هنا..." : "Type model name here..."}
                    />
                    <button
                      onClick={handleAddCustomModel}
                      disabled={!customModelName.trim()}
                      className="bg-[#2C160F] text-white px-6 py-4 rounded-2xl font-bold hover:bg-[#2C160F]/90 transition-all disabled:opacity-50 shrink-0 shadow-sm"
                    >
                      {isAr ? "إضافة" : "Add"}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#2C160F]/70 flex justify-between items-center">
                  <span>{isAr ? "مفتاح الربط (API Key)" : "API Key"}</span>
                </label>
                
                <div className="relative flex items-center bg-[#f5f1eb] rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[#2C160F]/20 focus-within:bg-white transition-all group">
                  <Key className={`absolute ${isAr ? 'right-4' : 'left-4'} w-5 h-5 text-[#2C160F]/20 z-10`} />
                  
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`w-full bg-transparent ${isAr ? 'pr-12 pl-12' : 'pl-12 pr-12'} py-4 text-[#2C160F] font-mono font-medium focus:outline-none z-20 ${!isFocused && !showApiKey && apiKey ? 'text-transparent' : ''}`}
                    placeholder={isAr ? "أدخل مفتاح الربط الجديد..." : "Enter new API key..."}
                    dir="ltr"
                  />

                  {!isFocused && !showApiKey && apiKey && (
                    <div 
                      className={`absolute inset-0 w-full ${isAr ? 'pr-12 pl-12' : 'pl-12 pr-12'} py-4 text-[#2C160F] font-mono font-medium flex items-center pointer-events-none z-10`}
                      dir="ltr"
                    >
                      {renderMaskedKey(apiKey)}
                    </div>
                  )}

                  {apiKey && (
                    <button 
                      type="button" 
                      onClick={() => setShowApiKey(!showApiKey)}
                      className={`absolute ${isAr ? 'left-4' : 'right-4'} text-[#2C160F]/30 hover:text-[#2C160F] transition-all z-30`}
                    >
                      {showApiKey ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showToggleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#2C160F]/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative border border-[#2C160F]/5">
            <button 
              onClick={() => setShowToggleModal(false)} 
              className={`absolute top-6 ${isAr ? 'left-6' : 'right-6'} p-2 text-[#2C160F]/40 hover:text-[#2C160F] transition-colors rounded-full hover:bg-[#f5f1eb]`}
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className={`w-16 h-16 rounded-2xl ${isAiEnabled ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'} flex items-center justify-center mb-6`}>
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <h3 className={`text-2xl font-black mb-2 ${isAiEnabled ? 'text-orange-600' : 'text-green-600'}`}>
              {isAiEnabled 
                ? (isAr ? "إيقاف المساعد الذكي" : "Disable AI Assistant")
                : (isAr ? "تفعيل المساعد الذكي" : "Enable AI Assistant")
              }
            </h3>
            
            <p className="text-[#2C160F]/60 font-medium mb-8 leading-relaxed">
              {isAiEnabled 
                ? (isAr 
                    ? "هل أنت متأكد من رغبتك في إيقاف المساعد الذكي؟ لن يتمكن المستخدمون من الدردشة مع النظام حتى يتم تفعيله مرة أخرى." 
                    : "Are you sure you want to disable the AI Assistant? Users will not be able to chat with the system until it is re-enabled.")
                : (isAr 
                    ? "هل أنت متأكد من تفعيل المساعد الذكي الآن؟ سيصبح متاحاً لجميع المستخدمين فوراً." 
                    : "Are you sure you want to enable the AI Assistant now? It will be available to all users immediately.")
              }
            </p>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={confirmToggleAi}
                className={`flex-1 text-white py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-95 ${isAiEnabled ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {isAiEnabled 
                  ? (isAr ? "تأكيد الإيقاف" : "Confirm Disable")
                  : (isAr ? "تأكيد التفعيل" : "Confirm Enable")
                }
              </button>
              <button 
                onClick={() => setShowToggleModal(false)}
                className="flex-1 bg-[#f5f1eb] text-[#2C160F] py-4 rounded-2xl font-bold hover:bg-[#2C160F]/5 transition-colors"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
