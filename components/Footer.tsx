"use client";

import React from "react";
import Link from "next/link";
import ar from "../locales/ar/common.json";
import en from "../locales/en/common.json";
import { useParams } from "next/navigation";
import { BrandMark } from "@/components/ui/tabayun";

const dictionaries = { ar, en };

export default function Footer() {
  const params = useParams();
  const locale = (params.locale as string) || "ar";
  const dict = dictionaries[locale as keyof typeof dictionaries] || ar;
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  return (
    <footer className="w-full bg-tabayun-paper pb-[calc(6rem+env(safe-area-inset-bottom))] pt-12 md:pb-12" dir={dir}>
      <div className="tabayun-container">
        <div className="rounded-[28px] border border-tabayun-sand bg-tabayun-pearl/70 p-5 md:p-7">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <BrandMark locale={locale} />
              <p className="max-w-md text-sm font-semibold leading-relaxed text-tabayun-coffee/58">
                {isAr
                  ? "تجربة قانونية ذكية تساعد السائح على فهم الأنظمة السعودية بثقة ووضوح."
                  : "A smart legal experience that helps visitors understand Saudi regulations with clarity and confidence."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="#"
                className="rounded-2xl px-4 py-3 text-sm font-black text-tabayun-coffee/62 transition hover:bg-tabayun-sand/45 hover:text-tabayun-coffee"
              >
                {dict.footer.links.privacy}
              </Link>
              <Link
                href="#"
                className="rounded-2xl px-4 py-3 text-sm font-black text-tabayun-coffee/62 transition hover:bg-tabayun-sand/45 hover:text-tabayun-coffee"
              >
                {dict.footer.links.terms}
              </Link>
            </div>
          </div>

          <div className="mt-6 border-t border-tabayun-sand pt-5 text-sm font-bold text-tabayun-coffee/45">
            {dict.footer.rights}
          </div>
        </div>
      </div>
    </footer>
  );
}
