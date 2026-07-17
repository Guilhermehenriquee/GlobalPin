import type { Metadata } from "next";
import { ProductListingShell } from "@/components/product-listing-shell";
import { titanorMetadata } from "@/lib/seo";
import { getStorefrontCategories, getStorefrontProducts } from "@/lib/storefront-data";

export const metadata: Metadata = titanorMetadata({
  title: "Lancamentos",
  description: "Novidades esportivas Titanor para treino, competicao, aventura, lutas, corrida e mais modalidades.",
  path: "/lancamentos",
});

export default async function LaunchesPage() {
  const [products, categories] = await Promise.all([getStorefrontProducts(), getStorefrontCategories()]);
  return (
    <ProductListingShell
      eyebrow="Lancamentos"
      title="As novidades chegaram"
      description="Produtos novos e linhas em destaque para quem quer se equipar antes da proxima meta."
      products={products.filter((product) => product.featured || product.bestSeller)}
      categories={categories}
      image="https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=85"
    />
  );
}
