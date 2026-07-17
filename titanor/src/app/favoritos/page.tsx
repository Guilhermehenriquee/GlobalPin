import type { Metadata } from "next";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/catalog";
import { titanorMetadata } from "@/lib/seo";

export const metadata: Metadata = titanorMetadata({
  title: "Favoritos",
  description: "Produtos favoritos salvos na sua conta TITANOR.",
  path: "/favoritos",
});

export default function WishlistPage() {
  const wishlist = products.filter((product) => product.bestSeller).slice(0, 4);

  return (
    <section className="py-12">
      <div className="container-shell">
        <div className="mb-10">
          <p className="mb-2 text-sm font-bold uppercase text-[#e30613]">Favoritos</p>
          <h1 className="text-4xl font-black text-white">Sua lista</h1>
          <p className="mt-4 flex items-center gap-2 text-sm text-zinc-400">
            <Heart className="h-4 w-4 text-[#e30613]" aria-hidden="true" />
            Em produção, essa lista fica sincronizada com sua conta.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
