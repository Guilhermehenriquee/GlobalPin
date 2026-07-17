import type { Metadata } from "next";
import { ProductListingShell } from "@/components/product-listing-shell";
import { titanorMetadata } from "@/lib/seo";
import { getStorefrontCategories, getStorefrontProducts } from "@/lib/storefront-data";

export const metadata: Metadata = titanorMetadata({
  title: "Feminino",
  description: "Produtos esportivos femininos Titanor para treino, corrida, academia, moda fitness e performance.",
  path: "/feminino",
});

export default async function WomenPage() {
  const [products, categories] = await Promise.all([getStorefrontProducts(), getStorefrontCategories()]);
  const filtered = products.filter((product) => {
    const haystack = [product.name, product.category, product.variations.join(" ")].join(" ").toLowerCase();
    return haystack.includes("feminino") || haystack.includes("fitness") || haystack.includes("legging") || haystack.includes("top");
  });

  return (
    <ProductListingShell
      eyebrow="Feminino"
      title="Conforto, suporte e atitude"
      description="Vestuarios, acessorios e equipamentos para treinar com seguranca e presenca."
      products={filtered.length > 0 ? filtered : products}
      categories={categories}
      image="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1600&q=85"
    />
  );
}
