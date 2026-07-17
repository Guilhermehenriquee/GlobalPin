"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, MapPin, ShoppingBag } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { readCartItems, writeCartItems } from "@/lib/cart-store";

type ProductActionsProps = {
  product: Product;
};

export function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();
  const [size, setSize] = useState(product.size[0]);
  const [color, setColor] = useState(product.color[0]);

  function addSelectedToCart() {
    const current = readCartItems();
    const existingIndex = current.findIndex((item) => item.id === product.id && item.size === size && item.color === color);
    const price = product.salePrice || product.price;

    if (existingIndex >= 0) {
      current[existingIndex].quantity += 1;
    } else {
      current.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: product.images[0],
        price,
        quantity: 1,
        size,
        color,
      });
    }

    writeCartItems(current);
  }

  function buyNow() {
    addSelectedToCart();
    router.push("/checkout");
  }

  return (
    <div className="mt-8 rounded-lg border border-white/10 bg-[#141414] p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-zinc-200">
          Tamanho
          <select className="field" value={size} onChange={(event) => setSize(event.target.value)}>
            {product.size.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-zinc-200">
          Cor
          <select className="field" value={color} onChange={(event) => setColor(event.target.value)}>
            {product.color.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
        <button className="premium-button w-full px-6" type="button" onClick={addSelectedToCart}>
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          Adicionar ao carrinho
        </button>
        <Link className="ghost-button px-5" href="/favoritos">
          <Heart className="h-4 w-4" aria-hidden="true" />
          Favoritar
        </Link>
      </div>
      <button className="premium-button mt-3 w-full px-6" type="button" onClick={buyNow}>
        Comprar agora
      </button>
      <label className="mt-5 grid gap-2 text-sm font-bold text-zinc-200">
        Calcular frete
        <span className="grid grid-cols-[1fr_auto] gap-2">
          <input className="field" placeholder="00000-000" inputMode="numeric" />
          <button className="ghost-button px-4" type="button">
            <MapPin className="h-4 w-4" aria-hidden="true" />
          </button>
        </span>
      </label>
    </div>
  );
}
