"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Send, User, Bot, Sparkles, ArrowLeft, ArrowRight } from "lucide-react";
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
    <main className="relative min-h-screen w-full flex flex-col items-center bg-[#f5f1eb] overflow-hidden" dir={dir}>
      <Navbar />

      <div className="relative z-20 w-full max-w-5xl h-screen pt-24 pb-6 px-4 md:px-8 flex flex-col">

        {/* Chat Header */}
        <div className="flex items-center justify-between py-6 md:animate-in md:fade-in md:slide-in-from-top-4 md:duration-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#3d2e20] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#3d2e20]/20">
              <Bot className="w-7 h-7" />
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
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[#3d2e20]/10 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-[#3d2e20]/60 italic">
              {locale === "ar" ? "مدعوم بالذكاء الاصطناعي" : "Powered by AI"}
            </span>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-6 py-8">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex w-full ${message.sender === "user" ? "justify-end" : "justify-start"} md:animate-in md:zoom-in-95 md:duration-300`}
            >
              <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${message.sender === "user" ? "bg-white border border-[#3d2e20]/10" : "bg-[#3d2e20] text-white"}`}>
                  {message.sender === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                <div className="space-y-1">
                  <div className={`p-4 md:p-5 rounded-2xl text-sm md:text-base font-medium shadow-sm transition-all ${message.sender === "user"
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
        <div className="py-4 md:animate-in md:fade-in md:slide-in-from-bottom-4 md:duration-700">
          <div className="relative bg-white rounded-3xl p-2 shadow-2xl border border-[#3d2e20]/10 flex items-center gap-2">
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
              <Send className={`w-5 h-5 ${dir === 'rtl' ? 'rotate-180' : ''} group-hover:translate-x-1 transition-transform`} />
            </button>
          </div>
          <p className="text-center text-[10px] font-bold text-[#3d2e20]/40 mt-3 uppercase tracking-tighter">
            {locale === "ar" ? "تم تطوير المساعد بواسطة فريق تباين © 2026" : "Assistant developed by Tabayun Team © 2026"}
          </p>
        </div>

      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3d2e2020;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3d2e2040;
        }
      `}</style>
    </main>
  );
}
