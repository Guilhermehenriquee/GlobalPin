import type { Metadata } from "next";
import { CatalogFilters } from "@/components/catalog-filters";
import { titanorMetadata } from "@/lib/seo";
import { getStorefrontCategories, getStorefrontProducts } from "@/lib/storefront-data";

export const metadata: Metadata = titanorMetadata({
  title: "Produtos",
  description: "Catálogo TITANOR com artigos esportivos premium para futebol, corrida, academia, ciclismo, lutas e acessórios.",
  path: "/produtos",
});

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const revalidate = 60;

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const [products, categories] = await Promise.all([getStorefrontProducts(), getStorefrontCategories()]);

  return (
    <section className="py-12">
      <div className="container-shell">
        <div className="mb-10 max-w-3xl">
          <p className="mb-2 text-sm font-black uppercase text-[#e30613]">Catalogo</p>
          <h1 className="titan-title metal-text text-4xl md:text-6xl">Produtos Titanor</h1>
          <p className="mt-4 text-sm leading-6 text-zinc-400">
            Busca inteligente por nome, marca, modalidade, preço, tamanho, cor, categoria e promoção.
          </p>
        </div>
        <CatalogFilters products={products} categories={categories} initialQuery={q} />
      </div>
    </section>
  );
}
