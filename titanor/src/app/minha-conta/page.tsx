import type { Metadata } from "next";
import { AccountShell } from "@/components/account-shell";
import { getSession } from "@/lib/auth";
import { titanorMetadata } from "@/lib/seo";

export const metadata: Metadata = titanorMetadata({
  title: "Minha conta",
  description: "Área do cliente TITANOR com dados pessoais, endereços, pedidos, favoritos e trocas.",
  path: "/minha-conta",
});

export default async function AccountPage() {
  const session = await getSession();

  return (
    <section className="py-12">
      <div className="container-shell">
        <AccountShell session={session} />
      </div>
    </section>
  );
}
