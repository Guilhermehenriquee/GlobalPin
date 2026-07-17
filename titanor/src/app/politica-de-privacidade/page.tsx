import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { titanorMetadata } from "@/lib/seo";

export const metadata: Metadata = titanorMetadata({
  title: "Política de privacidade",
  description: "Política de privacidade TITANOR com base LGPD, finalidade de uso de dados, segurança e direitos do titular.",
  path: "/politica-de-privacidade",
});

export default function PrivacyPage() {
  return (
    <section className="py-12">
      <div className="container-shell max-w-4xl">
        <p className="mb-2 text-sm font-bold uppercase text-[#e30613]">LGPD</p>
        <h1 className="text-4xl font-black text-white">Política de privacidade</h1>
        <div className="mt-8 grid gap-5 text-sm leading-7 text-zinc-300">
          {[
            "Coletamos dados necessários para cadastro, compra, pagamento, entrega, atendimento e prevenção a fraudes.",
            "Senhas são armazenadas de forma criptografada e sessões usam cookies HTTP-only.",
            "Dados de pagamento são processados por gateway seguro; a TITANOR não armazena número completo de cartão.",
            "Você pode solicitar acesso, correção, portabilidade ou exclusão dos seus dados pelos canais de atendimento.",
          ].map((item) => (
            <div key={item} className="flex gap-3 rounded-lg border border-white/10 bg-[#141414] p-5">
              <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-[#e30613]" aria-hidden="true" />
              <p>{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
