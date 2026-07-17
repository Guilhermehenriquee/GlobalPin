import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { titanorMetadata } from "@/lib/seo";

export const metadata: Metadata = titanorMetadata({
  title: "Termos de uso",
  description: "Termos de uso da loja TITANOR, incluindo cadastro, compras, pagamentos, conteúdo e responsabilidades.",
  path: "/termos-de-uso",
});

export default function TermsPage() {
  return (
    <section className="py-12">
      <div className="container-shell max-w-4xl">
        <p className="mb-2 text-sm font-bold uppercase text-[#e30613]">Termos</p>
        <h1 className="text-4xl font-black text-white">Termos de uso</h1>
        <div className="mt-8 grid gap-5">
          {[
            "Ao usar a TITANOR, você concorda com regras de cadastro, compra, pagamento e entrega descritas no site.",
            "Preços, estoque e promoções podem variar conforme disponibilidade e campanhas ativas.",
            "Tentativas de fraude, acesso indevido ou uso automatizado abusivo podem levar ao bloqueio da conta.",
            "Integrações futuras com marketplace, Correios e Melhor Envio serão adicionadas mantendo transparência ao cliente.",
          ].map((item) => (
            <div key={item} className="flex gap-3 rounded-lg border border-white/10 bg-[#141414] p-5 text-sm leading-6 text-zinc-300">
              <FileText className="mt-1 h-5 w-5 shrink-0 text-[#e30613]" aria-hidden="true" />
              <p>{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
