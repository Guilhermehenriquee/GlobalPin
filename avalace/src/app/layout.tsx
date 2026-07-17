import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Avalace Tech | Sistemas inteligentes para empresas",
  description:
    "Avalace Tech cria sites, sistemas, automações, aplicativos e integrações para empresas que querem crescer com tecnologia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
