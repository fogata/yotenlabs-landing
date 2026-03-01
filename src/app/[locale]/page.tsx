import { notFound } from "next/navigation";

import { LandingPage } from "@/components/landing-page";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/get-messages";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocaleHomePage({ params }: LocalePageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);

  return <LandingPage locale={locale as Locale} messages={messages} />;
}
