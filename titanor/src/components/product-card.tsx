import Link from "next/link";
import { Flame, Heart, Star } from "lucide-react";
import { SafeImage } from "@/components/safe-image";
import type { Product } from "@/lib/types";
import { calculateDiscount, formatCurrency } from "@/lib/utils";
import { AddToCartButton } from "@/components/add-to-cart-button";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const price = product.salePrice || product.price;
  const discount = calculateDiscount(product.price, product.salePrice);

  return (
    <article className="group overflow-hidden rounded-lg border border-white/10 bg-[#141414] transition hover:-translate-y-1 hover:border-[#e30613]/60">
      <Link href={`/produtos/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-zinc-900">
        <SafeImage
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/0 to-black/10" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {discount > 0 ? <span className="rounded bg-[#e30613] px-2 py-1 text-xs font-black text-white">-{discount}%</span> : null}
          {product.bestSeller ? (
            <span className="flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-xs font-bold text-white">
              <Flame className="h-3 w-3 text-[#e30613]" /> Mais vendido
            </span>
          ) : null}
        </div>
        <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-black/60 text-white transition group-hover:border-[#e30613] group-hover:text-[#e30613]">
          <Heart className="h-4 w-4" aria-hidden="true" />
        </span>
      </Link>
      <div className="grid gap-4 p-3 sm:p-4">
        <div>
          <div className="mb-2 flex items-center justify-between gap-2 text-xs text-zinc-400">
            <span className="uppercase">{product.brand}</span>
            <span className="flex items-center gap-1 text-[#d6d6d6]">
              <Star className="h-3 w-3 fill-[#d6d6d6]" /> {product.rating}
            </span>
          </div>
          <Link href={`/produtos/${product.slug}`} className="line-clamp-2 text-sm font-black text-white hover:text-[#e30613] sm:text-base">
            {product.name}
          </Link>
          <p className="mt-2 hidden min-h-10 text-sm leading-5 text-zinc-400 sm:line-clamp-2">{product.description}</p>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div>
            {product.salePrice ? <p className="text-xs text-zinc-500 line-through">{formatCurrency(product.price)}</p> : null}
            <p className="text-lg font-black text-white sm:text-xl">{formatCurrency(price)}</p>
            <p className="text-[11px] text-zinc-400">12x de {formatCurrency(price / 12)}</p>
            <p className={`mt-1 text-[11px] font-bold ${product.stock > 0 ? "text-zinc-400" : "text-[#e30613]"}`}>
              {product.stock > 0 ? `${product.stock} em estoque` : "Indisponivel"}
            </p>
          </div>
          <AddToCartButton product={product} compact />
        </div>
      </div>
    </article>
  );
}
