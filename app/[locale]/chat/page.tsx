"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, ArrowRight, Bot, Loader2, Send, ShieldCheck, User, X } from "lucide-react";
import { chatService } from "@/services/chatService";
import { ChatMessage, ChatSource } from "@/types/chat";
import { BrandMark, StatusBadge } from "@/components/ui/tabayun";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "ar";
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      content: isAr
        ? "أهلاً بك في مساعد تباين. اسألني عن أي موقف قانوني داخل السعودية وسأعطيك خلاصة واضحة مع تنبيه عند الحاجة."
        : "Welcome to Tabayun Assistant. Ask about any legal situation in Saudi Arabia and I will give a clear summary with warnings when needed.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText("");
    setLoading(true);

    const greetingReply = getGreetingReply(currentInput, isAr);
    if (greetingReply) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: greetingReply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      const response = await chatService.queryAI(currentInput, locale);
      let finalContent = response.response;
      let finalSource = response.source || undefined;
      const finalSources = response.sources || [];

      if (typeof finalContent === "string" && finalContent.trim().startsWith("{")) {
        try {
          const parsed = JSON.parse(finalContent);
          if (parsed.answer) {
            finalContent = parsed.answer;
            if (parsed.references?.length > 0 && !finalSource) {
              finalSource = parsed.references.join(", ");
            }
          }
        } catch {
          console.log("Response was not valid JSON, using as raw text");
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: finalContent,
          source: finalSource,
          sources: finalSources,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: getChatErrorMessage(message, isAr),
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const prompts = [
    isAr ? "هل التصوير في الأماكن العامة مسموح؟" : "Is filming in public places allowed?",
    isAr ? "ما أهم مخالفات القيادة للسائح؟" : "What driving violations should a visitor know?",
    isAr ? "هل تختلف قواعد اللباس حسب المكان؟" : "Do dress rules vary by place?",
  ];

  return (
    <main className="fixed inset-0 z-50 flex bg-tabayun-paper text-tabayun-coffee" dir={dir}>
      <aside className="hidden w-[360px] shrink-0 flex-col justify-between border-e border-tabayun-sand bg-tabayun-coffee p-6 text-tabayun-paper lg:flex">
        <div>
          <BrandMark locale={locale} inverted />
          <div className="mt-10 space-y-4">
            <StatusBadge tone="warning" className="border-white/12 bg-white/10 text-tabayun-paper">
              <ShieldCheck className="h-3.5 w-3.5 text-tabayun-gold" />
              {isAr ? "مساعد توعوي" : "Guidance assistant"}
            </StatusBadge>
            <h1 className="text-4xl font-black leading-tight">
              {isAr ? "اسأل قبل أن تتصرف" : "Ask before you act"}
            </h1>
            <p className="text-sm font-semibold leading-relaxed text-tabayun-paper/58">
              {isAr
                ? "اكتب موقفك بوضوح. سيعطيك المساعد خلاصة، تنبيه، ومصدر عند توفره."
                : "Describe your situation clearly. The assistant gives a summary, warning, and source when available."}
            </p>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/8 p-5">
          <div className="mb-3 flex items-center gap-2 text-tabayun-gold">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-black">{isAr ? "تنبيه مهم" : "Important note"}</span>
          </div>
          <p className="text-sm font-semibold leading-relaxed text-tabayun-paper/58">
            {isAr ? "الإجابة لا تغني عن الاستشارة الرسمية عند الحالات الحساسة." : "Answers do not replace official advice for sensitive cases."}
          </p>
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-tabayun-sand bg-tabayun-pearl/86 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tabayun-coffee text-tabayun-paper shadow-[0_12px_28px_rgba(44,22,15,0.2)]">
              <Bot className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-xl font-black">{isAr ? "المساعد الذكي" : "AI Assistant"}</h1>
              <div className="mt-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-tabayun-success" />
                <span className="text-xs font-black text-tabayun-coffee/45">{isAr ? "متصل الآن" : "Online"}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => router.back()}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-tabayun-sand/45 text-tabayun-coffee transition hover:bg-tabayun-coffee hover:text-tabayun-paper"
            aria-label={isAr ? "إغلاق" : "Close"}
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-5 md:px-8">
          <div className="mx-auto max-w-4xl space-y-5">
            <div className="grid gap-3 sm:grid-cols-3">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setInputText(prompt)}
                  className="rounded-3xl border border-tabayun-sand bg-tabayun-pearl p-4 text-start text-sm font-bold leading-relaxed text-tabayun-coffee/70 transition hover:border-tabayun-gold/60 hover:text-tabayun-coffee"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {messages.map((msg, index) => (
              <MessageBubble key={index} message={msg} isAr={isAr} />
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-tabayun-sand bg-tabayun-pearl text-tabayun-coffee">
                    <Bot className="h-5 w-5" />
                  </span>
                  <div className="rounded-3xl rounded-ss-md border border-tabayun-sand bg-tabayun-pearl p-4">
                    <div className="flex gap-1.5">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-tabayun-coffee/30" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-tabayun-coffee/30 [animation-delay:0.15s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-tabayun-coffee/30 [animation-delay:0.3s]" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <form onSubmit={handleSendMessage} className="shrink-0 border-t border-tabayun-sand bg-tabayun-pearl/90 p-3 backdrop-blur md:p-5">
          <div className="mx-auto flex max-w-4xl items-end gap-2 rounded-[26px] border border-tabayun-sand bg-tabayun-paper p-2 shadow-[0_-8px_30px_rgba(44,22,15,0.06)]">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
              rows={1}
              placeholder={isAr ? "اكتب استفسارك هنا..." : "Type your question here..."}
              className="max-h-32 min-h-12 flex-1 resize-none bg-transparent px-4 py-3 text-sm font-semibold leading-relaxed text-tabayun-coffee placeholder:text-tabayun-coffee/35 focus:outline-none"
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-tabayun-coffee text-tabayun-paper transition hover:bg-tabayun-ink active:scale-95 disabled:opacity-35"
              aria-label={isAr ? "إرسال" : "Send"}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className={`h-5 w-5 ${dir === "ltr" ? "rotate-45" : "rotate-[225deg]"}`} />}
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] font-bold text-tabayun-coffee/35">
            {isAr ? "مساعد توعوي ذكي - تحقق من الجهات الرسمية في الحالات الحساسة" : "AI guidance assistant - verify official sources for sensitive cases"}
          </p>
        </form>
      </section>
    </main>
  );
}

function getGreetingReply(input: string, isAr: boolean): string | null {
  const normalized = input.trim().toLowerCase().replace(/[.!؟?،,]/g, "");
  const arabicGreetings = new Set(["اهلا", "أهلا", "هلا", "مرحبا", "السلام عليكم", "سلام"]);
  const englishGreetings = new Set(["hi", "hello", "hey", "salam"]);

  if (arabicGreetings.has(normalized) || englishGreetings.has(normalized)) {
    return isAr
      ? "ياهلا، حيّاك الله. اكتب لي الموقف القانوني أو سؤالك، وبعطيك خلاصة واضحة مع مقارنة بلدك إذا كانت متوفرة."
      : "Hi, welcome. Send me the legal situation or question, and I will give you a clear summary with a country comparison when available.";
  }

  return null;
}

function getChatErrorMessage(message: string, isAr: boolean): string {
  const lower = message.toLowerCase();

  if (lower.includes("not authenticated") || lower.includes("unauthorized") || lower.includes("could not validate credentials")) {
    return isAr
      ? "يبدو أن جلسة تسجيل الدخول انتهت. سجل الدخول مرة ثانية ثم ارجع للمحادثة."
      : "Your login session seems to have expired. Sign in again, then return to the chat.";
  }

  if (lower.includes("failed to fetch") || lower.includes("network")) {
    return isAr
      ? "الباكند غير متصل الآن. تأكد أن الخادم يعمل ثم أعد المحاولة."
      : "The backend is not connected right now. Make sure the server is running, then try again.";
  }

  return isAr
    ? "صار خلل مؤقت في معالجة الطلب. جرّب مرة ثانية، وإذا استمر الخطأ أعد تسجيل الدخول."
    : "A temporary issue occurred while processing your request. Try again, and if it continues, sign in again.";
}

function MessageBubble({ message, isAr }: { message: ChatMessage; isAr: boolean }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[92%] gap-3 md:max-w-[74%] ${isUser ? "flex-row-reverse" : ""}`}>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
            isUser ? "bg-tabayun-coffee text-tabayun-paper" : "border border-tabayun-sand bg-tabayun-pearl text-tabayun-coffee"
          }`}
        >
          {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </span>

        <div className="space-y-1">
          <div
            className={`rounded-3xl p-4 text-sm font-semibold leading-relaxed shadow-sm md:p-5 md:text-base ${
              isUser
                ? "rounded-se-md bg-tabayun-coffee text-tabayun-paper"
                : "rounded-ss-md border border-tabayun-sand bg-tabayun-pearl text-tabayun-coffee"
            }`}
          >
            {message.content}
            {message.source && (
              <div className={`mt-4 border-t pt-3 text-xs font-black ${isUser ? "border-white/14 text-tabayun-paper/58" : "border-tabayun-sand text-tabayun-clay"}`}>
                {isAr ? "المصدر: " : "Source: "} {message.source}
              </div>
            )}
            {message.sources && message.sources.length > 0 && (
              <SourceList sources={message.sources} isAr={isAr} />
            )}
          </div>
          <div className={`text-[11px] font-bold text-tabayun-coffee/35 ${isUser ? "text-end" : "text-start"}`}>
            {message.timestamp}
          </div>
        </div>
      </div>
    </div>
  );
}

function SourceList({ sources, isAr }: { sources: ChatSource[]; isAr: boolean }) {
  return (
    <div className="mt-4 border-t border-tabayun-sand pt-3 text-xs font-black text-tabayun-clay">
      <div className="mb-2">{isAr ? "المصادر:" : "Sources:"}</div>
      <div className="space-y-2">
        {sources.slice(0, 3).map((source) => (
          <div key={source.id} className="leading-relaxed">
            {source.url ? (
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-tabayun-gold/70 underline-offset-4 transition hover:text-tabayun-coffee"
              >
                {source.title}
              </a>
            ) : (
              <span>{source.title}</span>
            )}
            {typeof source.similarity === "number" && (
              <span className="ms-2 text-tabayun-coffee/40">
                {Math.round(source.similarity)}%
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
