"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Send, User, Bot, Sparkles, X, ArrowLeft, ArrowRight } from "lucide-react";
import ar from "@/locales/ar/common.json";
import en from "@/locales/en/common.json";

const dictionaries = { ar, en };

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "ar";
  const dict = dictionaries[locale as keyof typeof dictionaries] || ar;
  const dir = locale === "ar" ? "rtl" : "ltr";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: locale === "ar"
        ? "أهلاً بك في مساعد تباين الذكي! كيف يمكنني مساعدتك في فهم الأنظمة والقوانين اليوم؟"
        : "Welcome to Tabayun AI Assistant! How can I help you understand regulations and laws today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newUserMessage: Message = {
      id: Date.now(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputText("");

    // Simple automated response for UI demo
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: locale === "ar"
          ? "شكراً لسؤالك. أنا حالياً في مرحلة التطوير التجريبي، وبإمكاني مساعدتك في مقارنة القوانين البسيطة. هل تريد معرفة المزيد عن قسم معين؟"
          : "Thank you for your question. I am currently in beta, and I can help you compare simple laws. Would you like to know more about a specific section?",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <main className="fixed inset-0 z-50 w-full h-full flex items-center justify-center bg-[#f5f1eb] p-4 md:p-6" dir={dir}>

      {/* Chat Card Container (Popup Style) */}
      <div className="relative w-full max-w-4xl h-[85vh] md:h-[90vh] bg-white rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.50)] border border-[#3d2e20]/10 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">

        {/* Close Button */}
        <button
          onClick={() => router.back()}
          className={`absolute top-6 ${dir === 'rtl' ? 'left-6' : 'right-6'} z-30 p-2 rounded-full bg-[#f5f1eb] text-[#3d2e20]/60 hover:bg-[#3d2e20] hover:text-white transition-colors`}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Chat Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-8 py-6 bg-[#f5f1eb]/50 border-b border-[#3d2e20]/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#3d2e20] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#3d2e20]/20">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-[#3d2e20]">
                {locale === "ar" ? "المساعد الذكي" : "AI Assistant"}
              </h1>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-[#3d2e20]/40 uppercase tracking-widest">
                  {locale === "ar" ? "متصل الآن" : "Online"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-grow overflow-y-auto px-6 md:px-8 py-6 space-y-6 custom-scrollbar bg-[#f5f1eb]/30">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex w-full ${message.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${message.sender === "user" ? "bg-white border border-[#3d2e20]/10" : "bg-[#3d2e20] text-white"}`}>
                  {message.sender === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                <div className="space-y-1">
                  <div className={`p-4 md:p-5 rounded-2xl text-sm md:text-base font-medium shadow-sm leading-relaxed ${message.sender === "user"
                    ? "bg-white text-[#3d2e20] rounded-tr-none border border-[#3d2e20]/5"
                    : "bg-[#3d2e20]/5 text-[#3d2e20] rounded-tl-none border border-[#3d2e20]/10"
                    }`}>
                    {message.text}
                  </div>
                  <div className={`text-[10px] font-bold text-[#3d2e20]/30 ${message.sender === "user" ? "text-end" : "text-start"}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Area */}
        <div className="flex-shrink-0 p-6 bg-white border-t border-[#3d2e20]/5">
          <div className="relative bg-[#f5f1eb] rounded-3xl p-2 flex items-center gap-2 border border-[#3d2e20]/5 focus-within:border-[#3d2e20]/20 focus-within:bg-white transition-all shadow-inner">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={locale === "ar" ? "اكتب استفسارك هنا..." : "Type your inquiry here..."}
              className="flex-grow bg-transparent border-none focus:outline-none px-4 py-3 text-[#3d2e20] font-medium placeholder-[#3d2e20]/30"
            />
            <button
              onClick={handleSendMessage}
              className="p-4 bg-[#3d2e20] text-white rounded-2xl hover:bg-[#523e2b] transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center group"
            >
              <Send className={`w-5 h-5 ${dir === 'ltr' ? 'rotate-45' : 'rotate-[225deg]'} group-hover:translate-x-1 transition-transform`} />
            </button>
          </div>
          <p className="text-center text-[10px] font-bold text-[#3d2e20]/20 mt-3 uppercase tracking-widest">
            {locale === "ar" ? "مساعد قانوني ذكي - نسخة تجريبية" : "AI Legal Assistant - Beta Version"}
          </p>
        </div>

      </div>
    </main>
  );
}