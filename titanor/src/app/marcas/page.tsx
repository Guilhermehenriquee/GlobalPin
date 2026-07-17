import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { partnerBrands } from "@/lib/brand-content";
import { titanorMetadata } from "@/lib/seo";
import { getStorefrontProducts } from "@/lib/storefront-data";

export const metadata: Metadata = titanorMetadata({
  title: "Marcas",
  description: "Conheca as marcas parceiras da Titanor e encontre produtos por fabricante, modalidade e finalidade.",
  path: "/marcas",
});

export default async function BrandsPage() {
  const products = await getStorefrontProducts();

  return (
    <section className="py-12">
      <div className="container-shell">
        <div className="mb-10 max-w-3xl">
          <p className="mb-2 text-sm font-black uppercase text-[#e30613]">Marcas</p>
          <h1 className="titan-title metal-text text-4xl md:text-6xl">As melhores marcas do esporte</h1>
          <p className="mt-4 text-sm leading-7 text-zinc-400">Explore fabricantes, linhas de performance e produtos por especialidade.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {partnerBrands.map((brand) => {
            const count = products.filter((product) => product.brand.toLowerCase() === brand.name.toLowerCase()).length;
            return (
              <Link key={brand.slug} href={`/marca/${brand.slug}`} className="redline-card rounded-lg border border-white/10 bg-[#141414] p-5 transition hover:-translate-y-1 hover:border-[#e30613]/70">
                <p className="titan-title text-3xl text-white">{brand.name}</p>
                <p className="mt-2 text-sm text-zinc-400">{brand.segment}</p>
                <p className="mt-6 flex items-center justify-between text-xs font-black uppercase text-zinc-300">
                  {count} produto{count === 1 ? "" : "s"}
                  <ArrowRight className="h-4 w-4 text-[#e30613]" aria-hidden="true" />
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
