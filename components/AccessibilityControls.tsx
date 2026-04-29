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
      className="fixed bottom-[115px] end-6 z-[70] md:bottom-6 md:end-6 animate-in fade-in zoom-in duration-300" 
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
        <Accessibility className={`h-6 w-6 transition-transform duration-500 ${open ? 'rotate-90' : ''}`} />
      </button>

      {open && (
        <div 
          className="absolute bottom-16 end-0 w-[min(22rem,calc(100vw-3rem))] rounded-[2.5rem] border border-[#E6D7C8]/60 bg-[#F7F2EC]/95 p-6 text-[#2C160F] shadow-[0_20px_60px_rgba(44,22,15,0.18)] backdrop-blur-2xl animate-in slide-in-from-bottom-4 fade-in duration-300"
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
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-[#5B3422]/60 uppercase tracking-widest ps-1">
                <Type className="h-3.5 w-3.5" />
                {t.font}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(["normal", "large", "xlarge"] as FontScale[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFontScale(option)}
                    className={`rounded-2xl px-3 py-3 text-sm font-black transition-all ${
                      fontScale === option 
                        ? "bg-[#2C160F] text-[#F7F2EC] shadow-md shadow-[#2C160F]/20" 
                        : "bg-white/60 text-[#5B3422] hover:bg-white border border-[#E6D7C8]/40"
                    }`}
                  >
                    {t[option]}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-[#5B3422]/60 uppercase tracking-widest ps-1">
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
                        : "bg-white/60 text-[#5B3422] hover:bg-white border border-[#E6D7C8]/40"
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
