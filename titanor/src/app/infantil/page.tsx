import type { Metadata } from "next";
import { ProductListingShell } from "@/components/product-listing-shell";
import { titanorMetadata } from "@/lib/seo";
import { getStorefrontCategories, getStorefrontProducts } from "@/lib/storefront-data";

export const metadata: Metadata = titanorMetadata({
  title: "Infantil",
  description: "Produtos esportivos infantis e opcoes versateis para iniciar criancas no esporte com seguranca.",
  path: "/infantil",
});

export default async function KidsPage() {
  const [products, categories] = await Promise.all([getStorefrontProducts(), getStorefrontCategories()]);

  return (
    <ProductListingShell
      eyebrow="Infantil"
      title="Seu esporte comeca aqui"
      description="Curadoria inicial para jovens atletas. Use os filtros para encontrar tamanho, categoria, modalidade e faixa de preco."
      products={products.filter((product) => product.size.some((size) => ["PP", "P", "5"].includes(size))).slice(0, 8)}
      categories={categories}
      image="https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1600&q=85"
    />
  );
}
