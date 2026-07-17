import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogFilters } from "@/components/catalog-filters";
import { getCategoryGroupBySlug, titanorCategoryGroups } from "@/lib/brand-content";
import { titanorMetadata } from "@/lib/seo";
import { getStorefrontCategories, getStorefrontCategoryBySlug, getStorefrontProducts } from "@/lib/storefront-data";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await getStorefrontCategories();
  const slugs = new Set([...categories.map((category) => category.slug), ...titanorCategoryGroups.map((group) => group.slug)]);
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getStorefrontCategoryBySlug(slug);
  const group = getCategoryGroupBySlug(slug);

  if (!category && !group) {
    return titanorMetadata({
      title: "Categoria",
      description: "Categoria de produtos TITANOR.",
    });
  }

  return titanorMetadata({
    title: category?.name || group?.title || "Categoria",
    description: category?.description || group?.description || "Produtos esportivos Titanor.",
    path: `/categoria/${slug}`,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [category, products, categories] = await Promise.all([
    getStorefrontCategoryBySlug(slug),
    getStorefrontProducts(),
    getStorefrontCategories(),
  ]);
  const group = getCategoryGroupBySlug(slug);

  if (!category && !group) {
    notFound();
  }

  const title = category?.name || group?.title || "Categoria";
  const description = category?.description || group?.description || "Produtos esportivos Titanor.";
  const image = category?.image || group?.image || "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1600&q=85";
  const groupSports = group?.sports.map((sport) => sport.toLowerCase()) || [];
  const scopedProducts = group
    ? products.filter((product) => {
        const haystack = [product.name, product.category, product.modality, product.description].join(" ").toLowerCase();
        return groupSports.some((sport) => haystack.includes(sport.toLowerCase())) || products.indexOf(product) < 8;
      })
    : products;

  return (
    <section className="py-10">
      <div className="container-shell">
        <div className="diagonal-surface relative mb-10 min-h-72 overflow-hidden rounded-lg border border-white/10 bg-[#141414]">
          <Image src={image} alt={title} fill priority sizes="100vw" className="object-cover opacity-42" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          <div className="relative max-w-3xl p-6 md:p-10">
            <p className="mb-2 text-sm font-black uppercase text-[#e30613]">Categoria</p>
            <h1 className="titan-title metal-text text-4xl md:text-6xl">{title}</h1>
            <p className="mt-4 text-sm leading-7 text-zinc-300">{description}</p>
            {group ? <p className="mt-5 text-xs font-bold uppercase text-zinc-400">{group.sports.slice(0, 10).join(" | ")}</p> : null}
          </div>
        </div>
        <CatalogFilters products={scopedProducts} categories={categories} categorySlug={category?.slug} />
      </div>
    </section>
  );
}
