import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { titanorMetadata } from "@/lib/seo";

export const metadata: Metadata = titanorMetadata({
  title: "Contato",
  description: "Fale com a TITANOR por formulário, e-mail, WhatsApp e canais de atendimento.",
  path: "/contato",
});

export default function ContactPage() {
  return (
    <section className="py-12">
      <div className="container-shell grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="mb-2 text-sm font-bold uppercase text-[#e30613]">Contato</p>
          <h1 className="text-4xl font-black text-white">Fale com a TITANOR</h1>
          <p className="mt-4 text-sm leading-6 text-zinc-400">Atendimento para compras, pedidos, trocas, parcerias e dúvidas sobre produtos.</p>
          <div className="mt-8 grid gap-4">
            {[
              { icon: Mail, label: "contato@titanor.com.br" },
              { icon: MessageCircle, label: "WhatsApp comercial" },
              { icon: MapPin, label: "Entrega para todo o Brasil" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#141414] p-4">
                  <Icon className="h-5 w-5 text-[#e30613]" aria-hidden="true" />
                  <span className="text-sm font-bold text-zinc-300">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
        <form className="grid gap-4 rounded-lg border border-white/10 bg-[#141414] p-5">
          <input className="field" placeholder="Nome" />
          <input className="field" type="email" placeholder="E-mail" />
          <input className="field" placeholder="Assunto" />
          <textarea className="field min-h-36 py-3" placeholder="Mensagem" />
          <button className="premium-button px-6" type="submit">
            <Send className="h-4 w-4" aria-hidden="true" />
            Enviar
          </button>
        </form>
      </div>
    </section>
  );
}
