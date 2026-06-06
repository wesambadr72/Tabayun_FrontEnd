import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/features/ContactForm";
import { getDictionary } from "@/lib/dictionary";
import { PageShell } from "@/components/ui/tabayun";

interface Props {
    params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: Props) {
    const { locale } = await params;
    const dict = await getDictionary(locale);
    const dir = locale === "ar" ? "rtl" : "ltr";

    return (
        <PageShell dir={dir} className="flex flex-col">
            <Navbar />

            <div className="tabayun-page-offset tabayun-container flex-grow pb-16">
                <ContactForm dict={dict} locale={locale} />
            </div>

            <Footer />
        </PageShell>
    );
}
