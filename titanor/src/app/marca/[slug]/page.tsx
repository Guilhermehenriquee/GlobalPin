import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductListingShell } from "@/components/product-listing-shell";
import { getBrandBySlug, partnerBrands } from "@/lib/brand-content";
import { titanorMetadata } from "@/lib/seo";
import { getStorefrontCategories, getStorefrontProducts } from "@/lib/storefront-data";

type BrandPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return partnerBrands.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);

  return titanorMetadata({
    title: brand?.name || "Marca",
    description: `Produtos ${brand?.name || "da marca"} na Titanor.`,
    path: `/marca/${slug}`,
  });
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  const [products, categories] = await Promise.all([getStorefrontProducts(), getStorefrontCategories()]);
  const brandProducts = products.filter((product) => product.brand.toLowerCase() === brand.name.toLowerCase());

  return (
    <ProductListingShell
      eyebrow="Marca"
      title={brand.name}
      description={`${brand.segment}. Produtos selecionados para quem busca performance, confianca e compra direta por marca.`}
      products={brandProducts}
      categories={categories}
      image="https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1600&q=85"
    />
  );
}
