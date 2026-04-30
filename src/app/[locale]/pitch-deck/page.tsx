import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PitchDeckPage } from "@/components/pitch-deck-page";
import { defaultLocale, isValidLocale, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/get-messages";

type PitchDeckRouteProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PitchDeckRouteProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    return {};
  }

  const messages = await getMessages(locale);

  return {
    title: messages.pitchDeck.metadata.title,
    description: messages.pitchDeck.metadata.description,
    openGraph: {
      title: messages.pitchDeck.metadata.title,
      description: messages.pitchDeck.metadata.description,
      type: "website",
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: messages.pitchDeck.metadata.title,
        },
      ],
    },
    alternates: {
      canonical: `/${locale}/pitch-deck`,
      languages: {
        en: "/en/pitch-deck",
        "pt-BR": "/pt-br/pitch-deck",
        "x-default": `/${defaultLocale}/pitch-deck`,
      },
    },
  };
}

export default async function LocalizedPitchDeckPage({
  params,
}: PitchDeckRouteProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);

  return <PitchDeckPage locale={locale as Locale} messages={messages} />;
}
