import type { Metadata } from "next";
import { RotateCcw } from "lucide-react";
import { titanorMetadata } from "@/lib/seo";

export const metadata: Metadata = titanorMetadata({
  title: "Trocas e devoluções",
  description: "Política de trocas e devoluções TITANOR com orientação para solicitação, prazos e condições.",
  path: "/trocas-e-devolucoes",
});

export default function ExchangesPage() {
  return (
    <section className="py-12">
      <div className="container-shell max-w-4xl">
        <p className="mb-2 text-sm font-bold uppercase text-[#e30613]">Atendimento</p>
        <h1 className="text-4xl font-black text-white">Trocas e devoluções</h1>
        <div className="mt-8 grid gap-4">
          {[
            "Solicite troca ou devolução em até 30 dias após o recebimento.",
            "O produto deve estar sem sinais de uso inadequado e com embalagem/acessórios quando aplicável.",
            "Após análise, a TITANOR libera reenvio, crédito ou estorno conforme o caso.",
            "Produtos com defeito seguem avaliação técnica e garantia legal.",
          ].map((item) => (
            <div key={item} className="flex gap-3 rounded-lg border border-white/10 bg-[#141414] p-5">
              <RotateCcw className="mt-1 h-5 w-5 shrink-0 text-[#e30613]" aria-hidden="true" />
              <p className="text-sm leading-6 text-zinc-300">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
