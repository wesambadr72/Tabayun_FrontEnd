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
    <div className="fixed bottom-28 end-4 z-[70] md:bottom-6" dir={locale === "ar" ? "rtl" : "ltr"}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E6D7C8] bg-[#2C160F] text-[#F7F2EC] shadow-xl shadow-[#2C160F]/20 transition hover:bg-[#5B3422]"
        aria-label={t.button}
        aria-expanded={open}
      >
        <Accessibility className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute bottom-14 end-0 w-[min(22rem,calc(100vw-2rem))] rounded-3xl border border-[#E6D7C8] bg-[#F7F2EC] p-4 text-[#2C160F] shadow-2xl">
          <div className="mb-4 flex items-center gap-2">
            <Accessibility className="h-5 w-5" />
            <h2 className="text-base font-black">{t.title}</h2>
          </div>

          <section className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-[#5B3422]/75">
              <Type className="h-4 w-4" />
              {t.font}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["normal", "large", "xlarge"] as FontScale[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFontScale(option)}
                  className={`rounded-2xl px-3 py-2 text-xs font-black ${
                    fontScale === option ? "bg-[#2C160F] text-[#F7F2EC]" : "bg-white text-[#5B3422]"
                  }`}
                >
                  {t[option]}
                </button>
              ))}
            </div>
          </section>

          <section className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-[#5B3422]/75">
              <Palette className="h-4 w-4" />
              {t.color}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setColorMode(option.value)}
                  className={`flex items-center justify-between rounded-2xl px-3 py-2 text-xs font-black ${
                    colorMode === option.value ? "bg-[#2C160F] text-[#F7F2EC]" : "bg-white text-[#5B3422]"
                  }`}
                >
                  <span>{t[option.labelKey]}</span>
                  {colorMode === option.value && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
