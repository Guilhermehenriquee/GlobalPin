import type { Metadata } from "next";
import { getAppUrl } from "@/lib/utils";

type SeoInput = {
  title: string;
  description: string;
  path?: string;
};

export function titanorMetadata({ title, description, path = "" }: SeoInput): Metadata {
  const url = `${getAppUrl()}${path}`;
  const fullTitle = title.includes("TITANOR") ? title : `${title} | TITANOR`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: "TITANOR",
      locale: "pt_BR",
      type: "website",
      images: [
        {
          url: `${getAppUrl()}/brand/logo-titanor-oficial.png`,
          width: 2200,
          height: 1200,
          alt: "TITANOR todos os esportes",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
