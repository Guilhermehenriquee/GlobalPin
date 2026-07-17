import type { Metadata } from "next";
import { ProductListingShell } from "@/components/product-listing-shell";
import { titanorMetadata } from "@/lib/seo";
import { getStorefrontCategories, getStorefrontProducts } from "@/lib/storefront-data";

export const metadata: Metadata = titanorMetadata({
  title: "Ofertas",
  description: "Produtos esportivos com desconto na Titanor. Aproveite ofertas por categoria, marca, esporte e disponibilidade.",
  path: "/ofertas",
});

export default async function OffersPage() {
  const [products, categories] = await Promise.all([getStorefrontProducts(), getStorefrontCategories()]);
  return (
    <ProductListingShell
      eyebrow="Ofertas"
      title="Economia de verdade"
      description="Produtos selecionados com preco promocional, estoque visivel, filtros avancados e compra segura."
      products={products.filter((product) => product.promotion || product.salePrice)}
      categories={categories}
      image="https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=1600&q=85"
    />
  );
}
