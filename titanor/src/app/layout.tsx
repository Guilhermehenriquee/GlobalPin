import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsappButton } from "@/components/whatsapp-button";
import { getAppUrl } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(getAppUrl()),
  title: {
    default: "Titanor | Artigos Esportivos para Todos os Esportes",
    template: "%s | TITANOR",
  },
  description: "Encontre artigos esportivos para futebol, corrida, lutas, natacao, ciclismo, academia, esportes radicais, e-sports e muito mais.",
  applicationName: "TITANOR",
  keywords: ["TITANOR", "artigos esportivos", "todos os esportes", "corrida", "futebol", "academia", "ciclismo", "lutas"],
  openGraph: {
    title: "Titanor | Todos os esportes. Uma so forca.",
    description: "Loja premium de artigos esportivos para todas as modalidades.",
    url: getAppUrl(),
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
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <WhatsappButton />
      </body>
    </html>
  );
}
