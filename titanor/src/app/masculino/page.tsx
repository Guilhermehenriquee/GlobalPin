import type { Metadata } from "next";
import { ProductListingShell } from "@/components/product-listing-shell";
import { titanorMetadata } from "@/lib/seo";
import { getStorefrontCategories, getStorefrontProducts } from "@/lib/storefront-data";

export const metadata: Metadata = titanorMetadata({
  title: "Masculino",
  description: "Produtos esportivos masculinos na Titanor: treino, corrida, futebol, ciclismo, lutas e acessorios.",
  path: "/masculino",
});

export default async function MenPage() {
  const [products, categories] = await Promise.all([getStorefrontProducts(), getStorefrontCategories()]);
  const filtered = products.filter((product) => product.variations.join(" ").toLowerCase().includes("masculino") || !product.variations.join(" ").toLowerCase().includes("feminino"));

  return (
    <ProductListingShell
      eyebrow="Masculino"
      title="Performance para qualquer modalidade"
      description="Selecao para treino, competicao e rotina esportiva masculina."
      products={filtered}
      categories={categories}
      image="https://images.unsplash.com/photo-1534368420009-621bfab424a8?auto=format&fit=crop&w=1600&q=85"
    />
  );
}
