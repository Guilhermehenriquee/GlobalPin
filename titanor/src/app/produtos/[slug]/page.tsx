import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CreditCard, RotateCcw, ShieldCheck, Star, Truck } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { ProductActions } from "@/components/product-actions";
import { SafeImage } from "@/components/safe-image";
import { SectionHeading } from "@/components/section-heading";
import { titanorMetadata } from "@/lib/seo";
import { getStorefrontProductBySlug, getStorefrontProducts, getStorefrontRelatedProducts } from "@/lib/storefront-data";
import { calculateDiscount, formatCurrency } from "@/lib/utils";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getStorefrontProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getStorefrontProductBySlug(slug);

  if (!product) {
    return titanorMetadata({
      title: "Produto",
      description: "Produto TITANOR.",
    });
  }

  return titanorMetadata({
    title: product.name,
    description: product.description,
    path: `/produtos/${product.slug}`,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getStorefrontProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = await getStorefrontRelatedProducts(product);
  const price = product.salePrice || product.price;
  const discount = calculateDiscount(product.price, product.salePrice);
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <section className="py-12">
        <div className="container-shell grid gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div className="grid gap-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-white/10 bg-zinc-900">
              <SafeImage src={product.images[0]} alt={product.name} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              {discount > 0 ? <span className="absolute left-4 top-4 rounded bg-[#e30613] px-3 py-2 text-sm font-black text-white">-{discount}%</span> : null}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {product.images.slice(1).map((image) => (
                <div key={image} className="relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-zinc-900">
                  <SafeImage src={image} alt={`${product.name} detalhe`} fill sizes="25vw" className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <Link href={`/categoria/${product.categorySlug}`} className="text-sm font-bold uppercase text-[#e30613]">
              {product.category}
            </Link>
            <h1 className="mt-3 text-4xl font-black text-white md:text-5xl">{product.name}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-400">
              <span>SKU {product.sku}</span>
              <span className="flex items-center gap-1 text-[#d6d6d6]">
                <Star className="h-4 w-4 fill-[#d6d6d6]" aria-hidden="true" /> {product.rating} ({product.reviews} avaliações)
              </span>
            </div>
            <p className="mt-6 text-base leading-7 text-zinc-300">{product.fullDescription}</p>

            <div className="mt-8">
              {product.salePrice ? <p className="text-sm text-zinc-500 line-through">{formatCurrency(product.price)}</p> : null}
              <p className="text-4xl font-black text-white">{formatCurrency(price)}</p>
              <p className="mt-2 text-sm text-zinc-400">
                em até 10x de {formatCurrency(price / 10)} sem juros ou Pix com confirmação rápida
              </p>
              <ProductActions product={product} />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Truck, title: "Frete", text: "Calcule no carrinho" },
                { icon: ShieldCheck, title: "Seguro", text: "Dados protegidos" },
                { icon: RotateCcw, title: "Troca", text: "Até 30 dias" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-lg border border-white/10 bg-white/5 p-4 transition hover:border-[#e30613]/50 hover:bg-[#e30613]/10">
                    <Icon className="mb-3 h-5 w-5 text-[#e30613]" aria-hidden="true" />
                    <p className="font-black text-white">{item.title}</p>
                    <p className="text-sm text-zinc-400">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="section-band py-12">
        <div className="container-shell grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-2xl font-black text-white">Descrição completa</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-400">{product.fullDescription}</p>
            <div className="mt-6 flex items-start gap-3 rounded-lg border border-[#e30613]/40 bg-[#e30613]/10 p-4 text-sm leading-6 text-zinc-300">
              <CreditCard className="mt-1 h-5 w-5 shrink-0 text-[#e30613]" aria-hidden="true" />
              Checkout preparado para Pix, cartão e boleto por gateway oficial.
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Especificações técnicas</h2>
            <div className="mt-4 overflow-hidden rounded-lg border border-white/10">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="grid border-b border-white/10 last:border-b-0 sm:grid-cols-[140px_1fr]">
                  <span className="bg-white/5 p-4 text-sm font-bold text-zinc-300">{key}</span>
                  <span className="p-4 text-sm text-zinc-400">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-shell">
          <SectionHeading eyebrow="Avaliações" title="Opinião de compradores" />
          <div className="grid gap-4 md:grid-cols-3">
            {["Acabamento impecável e entrega rápida.", "Produto firme, bonito e realmente premium.", "Comprei para treino diário e superou a expectativa."].map((text, index) => (
              <figure key={text} className="rounded-lg border border-white/10 bg-[#141414] p-5 transition hover:border-[#e30613]/40">
                <div className="mb-3 flex gap-1 text-[#d6d6d6]">
                  {Array.from({ length: 5 }).map((_, star) => (
                    <Star key={star} className="h-4 w-4 fill-[#d6d6d6]" aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="text-sm leading-6 text-zinc-300">“{text}”</blockquote>
                <figcaption className="mt-4 text-sm font-bold text-white">Cliente TITANOR {index + 1}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="section-band py-12">
          <div className="container-shell">
            <SectionHeading eyebrow="Produtos relacionados" title="Complete sua preparação" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
