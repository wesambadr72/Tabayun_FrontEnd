"use client";

import React, { useEffect, useState } from "react";
import { Accessibility, Check, Palette, Type } from "lucide-react";

type FontScale = "normal" | "large" | "xlarge";
type ColorMode = "default" | "protanopia" | "deuteranopia" | "tritanopia" | "high-contrast";

const labels = {
  ar: {
    button: "تسهيلات الوصول",
    title: "تسهيلات الوصول",
    font: "حجم الخط",
    color: "ألوان مناسبة",
    normal: "عادي",
    large: "كبير",
    xlarge: "أكبر",
    default: "الافتراضي",
    protanopia: "ضعف الأحمر",
    deuteranopia: "ضعف الأخضر",
    tritanopia: "ضعف الأزرق",
    highContrast: "تباين عال",
  },
  en: {
    button: "Accessibility",
    title: "Accessibility",
    font: "Font size",
    color: "Color support",
    normal: "Normal",
    large: "Large",
    xlarge: "Extra",
    default: "Default",
    protanopia: "Red-blind",
    deuteranopia: "Green-blind",
    tritanopia: "Blue-blind",
    highContrast: "High contrast",
  },
};

const colorOptions: Array<{ value: ColorMode; labelKey: keyof typeof labels.ar }> = [
  { value: "default", labelKey: "default" },
  { value: "protanopia", labelKey: "protanopia" },
  { value: "deuteranopia", labelKey: "deuteranopia" },
  { value: "tritanopia", labelKey: "tritanopia" },
  { value: "high-contrast", labelKey: "highContrast" },
];

export default function AccessibilityControls({ locale }: { locale: "ar" | "en" }) {
  const [open, setOpen] = useState(false);
  const [fontScale, setFontScale] = useState<FontScale>("normal");
  const [colorMode, setColorMode] = useState<ColorMode>("default");
  const t = labels[locale];
  const isRtl = locale === "ar";

  useEffect(() => {
    const savedFont = (localStorage.getItem("tabayun-font-scale") as FontScale | null) || "normal";
    const savedColor = (localStorage.getItem("tabayun-color-mode") as ColorMode | null) || "default";
    setFontScale(savedFont);
    setColorMode(savedColor);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.fontScale = fontScale;
    root.dataset.colorMode = colorMode;
    localStorage.setItem("tabayun-font-scale", fontScale);
    localStorage.setItem("tabayun-color-mode", colorMode);
  }, [fontScale, colorMode]);

  return (
    <div 
      className="fixed bottom-24 start-6 z-[70] md:bottom-8 md:start-8 animate-in fade-in zoom-in duration-300" 
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-[#2C160F] text-[#F7F2EC] shadow-[0_12px_32px_rgba(44,22,15,0.25)] transition-all hover:scale-105 active:scale-95 group overflow-hidden"
        aria-label={t.button}
        aria-expanded={open}
      >
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Accessibility className={`h-6 w-6 transition-all duration-500 ${open ? 'scale-110' : 'scale-100'}`} />
      </button>

      {open && (
        <div 
          className="absolute bottom-16 start-0 w-[min(22rem,calc(100vw-3rem))] rounded-[2.5rem] border border-[#E6D7C8]/60 bg-[#F7F2EC]/95 p-6 text-[#2C160F] shadow-[0_20px_60px_rgba(44,22,15,0.18)] backdrop-blur-2xl animate-in slide-in-from-bottom-4 fade-in duration-300"
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2C160F] text-white">
                <Accessibility className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-black">{t.title}</h2>
            </div>
            <button 
              onClick={() => setOpen(false)}
              className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-[#2C160F]/5 transition-colors"
            >
              <Check className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-6">
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-black text-[#2C160F]/60 uppercase tracking-widest ps-1">
                <Type className="h-3.5 w-3.5" />
                {t.font}
              </div>
              
              <div className="px-2 pb-2">
                <div className="relative flex items-center gap-4">
                  <span className="text-sm font-bold text-[#2C160F]/40">A</span>
                  <div className="relative flex-1 h-1.5 flex items-center">
                    {/* Track Background */}
                    <div className="absolute inset-0 bg-[#2C160F]/10 rounded-full" />
                    
                    {/* Ticks */}
                    <div className="absolute inset-0 flex justify-between items-center px-0.5">
                      {[0, 1, 2].map((i) => (
                        <div 
                          key={i} 
                          className={`w-1 h-1 rounded-full transition-colors ${
                            (["normal", "large", "xlarge"] as FontScale[]).indexOf(fontScale) >= i 
                              ? "bg-[#2C160F]/40" 
                              : "bg-[#2C160F]/10"
                          }`} 
                        />
                      ))}
                    </div>

                    {/* Interactive Input */}
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="1"
                      value={(["normal", "large", "xlarge"] as FontScale[]).indexOf(fontScale)}
                      onChange={(e) => {
                        const values: FontScale[] = ["normal", "large", "xlarge"];
                        setFontScale(values[parseInt(e.target.value)]);
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />

                    {/* Visual Thumb */}
                    <div 
                      className="absolute h-6 w-6 bg-[#2C160F] rounded-full border-4 border-[#F7F2EC] shadow-lg transition-all duration-200 pointer-events-none"
                      style={{ 
                        [isRtl ? 'right' : 'left']: `calc(${((["normal", "large", "xlarge"] as FontScale[]).indexOf(fontScale) / 2) * 100}% - 12px)` 
                      }}
                    />
                  </div>
                  <span className="text-xl font-bold text-[#2C160F]">A</span>
                </div>
                
                {/* Labels aligned perfectly with ticks */}
                <div className="mt-3 flex items-center gap-4">
                  <span className="invisible text-sm font-bold">A</span>
                  <div className="flex-1 flex justify-between text-[10px] font-black text-[#2C160F]/40 uppercase tracking-tighter px-0.5">
                    <span className="w-0 flex justify-center whitespace-nowrap">{t.normal}</span>
                    <span className="w-0 flex justify-center whitespace-nowrap">{t.large}</span>
                    <span className="w-0 flex justify-center whitespace-nowrap">{t.xlarge}</span>
                  </div>
                  <span className="invisible text-xl font-bold">A</span>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-[#2C160F]/60 uppercase tracking-widest ps-1">
                <Palette className="h-3.5 w-3.5" />
                {t.color}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {colorOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setColorMode(option.value)}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-black transition-all ${
                      colorMode === option.value 
                        ? "bg-[#2C160F] text-[#F7F2EC] shadow-md shadow-[#2C160F]/20" 
                        : "bg-white/60 text-[#2C160F] hover:bg-white border border-[#E6D7C8]/40"
                    }`}
                  >
                    <span>{t[option.labelKey]}</span>
                    {colorMode === option.value && <Check className="h-3.5 w-3.5 animate-in zoom-in" />}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>

  );
}
