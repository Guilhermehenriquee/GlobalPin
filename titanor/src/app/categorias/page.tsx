import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { titanorCategoryGroups } from "@/lib/brand-content";
import { titanorMetadata } from "@/lib/seo";

export const metadata: Metadata = titanorMetadata({
  title: "Categorias",
  description: "Explore todos os grupos esportivos da Titanor: equipe, lutas, aquaticos, radicais, precisao, inverno, motores e e-sports.",
  path: "/categorias",
});

export default function CategoriesPage() {
  return (
    <section className="py-12">
      <div className="container-shell">
        <div className="mb-10 max-w-3xl">
          <p className="mb-2 text-sm font-black uppercase text-[#e30613]">Todas as categorias</p>
          <h1 className="titan-title metal-text text-4xl md:text-6xl">Encontre seu esporte</h1>
          <p className="mt-4 text-sm leading-7 text-zinc-400">
            A Titanor organiza praticamente todos os esportes em familias para voce comprar rapido, comparar melhor e evoluir em qualquer modalidade.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {titanorCategoryGroups.map((category) => (
            <Link key={category.slug} href={`/categoria/${category.slug}`} className="group diagonal-surface relative min-h-72 overflow-hidden rounded-lg border border-white/10 bg-[#141414] transition hover:border-[#e30613]/70">
              <Image src={category.image} alt={category.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover opacity-38 transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/72 to-transparent" />
              <div className="relative flex min-h-72 flex-col justify-end p-5">
                <h2 className="titan-title text-3xl text-white">{category.title}</h2>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-300">{category.description}</p>
                <span className="mt-4 flex items-center gap-2 text-xs font-black uppercase text-[#e30613]">
                  Explorar <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
