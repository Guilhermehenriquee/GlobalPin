import type { Metadata } from "next";
import Image from "next/image";
import { Award, Dumbbell, ShieldCheck } from "lucide-react";
import { titanorMetadata } from "@/lib/seo";

export const metadata: Metadata = titanorMetadata({
  title: "Sobre a TITANOR",
  description: "Conheça a TITANOR, marca premium de artigos esportivos forjada para atletas e praticantes exigentes.",
  path: "/sobre",
});

export default function AboutPage() {
  return (
    <section className="py-12">
      <div className="container-shell grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="mb-2 text-sm font-bold uppercase text-[#e30613]">Sobre</p>
          <h1 className="titan-title metal-text text-4xl md:text-6xl">Todos os esportes. Uma so forca.</h1>
          <p className="mt-6 text-base leading-8 text-zinc-300">
            A Titanor nasceu para reunir todos os esportes em uma unica experiencia. Somos uma marca multiesportiva feita para atletas, praticantes e apaixonados por movimento. Trabalhamos com artigos esportivos para diferentes modalidades, do campo a quadra, da agua a montanha, do ringue a arena digital.
          </p>
          <p className="mt-4 text-base leading-8 text-zinc-300">
            Mais do que produtos, entregamos confianca, performance e atitude para quem busca evoluir todos os dias.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Dumbbell, label: "Atlética" },
              { icon: Award, label: "Premium" },
              { icon: ShieldCheck, label: "Confiável" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-lg border border-white/10 bg-[#141414] p-4">
                  <Icon className="mb-3 h-6 w-6 text-[#e30613]" aria-hidden="true" />
                  <p className="font-black text-white">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="relative min-h-[460px] overflow-hidden rounded-lg border border-white/10 bg-zinc-900">
          <Image
            src="https://images.unsplash.com/photo-1517963628607-235ccdd5476c?auto=format&fit=crop&w=1200&q=80"
            alt="Atleta treinando com equipamento esportivo"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
      </div>
    </section>
  );
}
