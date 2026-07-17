import Image from "next/image";
import { CatalogFilters } from "@/components/catalog-filters";
import type { Category, Product } from "@/lib/types";

type ProductListingShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  products: Product[];
  categories: Category[];
};

export function ProductListingShell({ eyebrow, title, description, image, products, categories }: ProductListingShellProps) {
  return (
    <section className="py-10">
      <div className="container-shell">
        <div className="diagonal-surface relative mb-10 min-h-64 overflow-hidden rounded-lg border border-white/10 bg-[#141414]">
          {image ? <Image src={image} alt={title} fill priority sizes="100vw" className="object-cover opacity-38" /> : null}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/82 to-transparent" />
          <div className="relative max-w-3xl p-6 md:p-10">
            <p className="mb-2 text-sm font-black uppercase text-[#e30613]">{eyebrow}</p>
            <h1 className="titan-title metal-text text-4xl md:text-6xl">{title}</h1>
            <p className="mt-4 text-sm leading-7 text-zinc-300">{description}</p>
          </div>
        </div>
        <CatalogFilters products={products} categories={categories} />
      </div>
    </section>
  );
}
