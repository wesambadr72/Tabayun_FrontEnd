import localFont from "next/font/local";
import "../globals.css";
import { getDirection } from "@/lib/dictionary";

const thmanyahDisplay = localFont({
  src: "../../public/fonts/thmanyahserifdisplay-Black.woff2",
  variable: "--font-thmanyah-display",
  weight: "900",
  display: "swap",
});

const thmanyahTitle = localFont({
  src: "../../public/fonts/thmanyahseriftext-Medium.woff2",
  variable: "--font-thmanyah-title",
  weight: "500",
  display: "swap",
});

const thmanyahBody = localFont({
  src: "../../public/fonts/thmanyahsans-Regular.woff2",
  variable: "--font-thmanyah-body",
  weight: "400",
  display: "swap",
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dir = getDirection(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${thmanyahDisplay.variable} ${thmanyahTitle.variable} ${thmanyahBody.variable}`}
    >
      <body className="font-body antialiased text-[#2C160F]" suppressHydrationWarning>{children}</body>
    </html>
  );
}
