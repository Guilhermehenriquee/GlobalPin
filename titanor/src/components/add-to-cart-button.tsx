"use client";

import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { readCartItems, writeCartItems } from "@/lib/cart-store";

type AddToCartButtonProps = {
  product: Product;
  compact?: boolean;
  size?: string;
  color?: string;
};

export function AddToCartButton({ product, compact, size, color }: AddToCartButtonProps) {
  function addToCart() {
    const current = readCartItems();
    const price = product.salePrice || product.price;
    const selectedSize = size || product.size[0];
    const selectedColor = color || product.color[0];
    const existingIndex = current.findIndex(
      (item) => item.id === product.id && item.size === selectedSize && item.color === selectedColor,
    );

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
        size: selectedSize,
        color: selectedColor,
      });
    }

    writeCartItems(current);
  }

  return (
    <button
      className={compact ? "premium-button h-11 min-h-0 w-11 p-0" : "premium-button w-full px-6"}
      type="button"
      onClick={addToCart}
      aria-label={`Adicionar ${product.name} ao carrinho`}
    >
      <ShoppingBag className="h-4 w-4" aria-hidden="true" />
      {compact ? null : "Adicionar ao carrinho"}
    </button>
  );
}
