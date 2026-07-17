"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import { SafeImage } from "@/components/safe-image";
import type { CartItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { useCartItems, writeCartItems } from "@/lib/cart-store";
const freeShippingThreshold = 399;

export function CartClient() {
  const items = useCartItems();
  const [coupon, setCoupon] = useState("");
  const [zipCode, setZipCode] = useState("");

  function persist(nextItems: CartItem[]) {
    writeCartItems(nextItems);
  }

  function updateQuantity(index: number, quantity: number) {
    if (quantity <= 0) {
      persist(items.filter((_, currentIndex) => currentIndex !== index));
      return;
    }

    persist(items.map((item, currentIndex) => (currentIndex === index ? { ...item, quantity } : item)));
  }

  const subtotal = useMemo(() => items.reduce((total, item) => total + item.price * item.quantity, 0), [items]);
  const couponDiscount = coupon.trim().toUpperCase() === "FORJA10" && subtotal >= 199 ? subtotal * 0.1 : 0;
  const shipping = subtotal >= freeShippingThreshold || !zipCode ? 0 : 29.9;
  const total = Math.max(subtotal - couponDiscount + shipping, 0);

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-white/10 bg-[#141414] p-10 text-center">
        <ShoppingBag className="mx-auto mb-4 h-10 w-10 text-[#e30613]" aria-hidden="true" />
        <h1 className="text-3xl font-black text-white">Seu carrinho está vazio</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-400">
          Escolha equipamentos premium e continue sua jornada de compra com frete para todo o Brasil.
        </p>
        <Link className="premium-button mt-6 px-6" href="/produtos">
          Comprar agora
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="grid gap-4">
        {items.map((item, index) => (
          <article key={`${item.id}-${item.size}-${item.color}`} className="grid gap-4 rounded-lg border border-white/10 bg-[#141414] p-4 sm:grid-cols-[120px_1fr_auto]">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-zinc-900">
              <SafeImage src={item.image} alt={item.name} fill sizes="120px" className="object-cover" />
            </div>
            <div>
              <Link href={`/produtos/${item.slug}`} className="text-lg font-black text-white hover:text-[#e30613]">
                {item.name}
              </Link>
              <p className="mt-2 text-sm text-zinc-400">
                {item.size ? `Tamanho ${item.size}` : "Tamanho padrão"} · {item.color || "Cor padrão"}
              </p>
              <p className="mt-4 text-xl font-black text-white">{formatCurrency(item.price)}</p>
            </div>
            <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:justify-between">
              <button className="ghost-button h-10 min-h-0 w-10 p-0" onClick={() => persist(items.filter((_, currentIndex) => currentIndex !== index))} aria-label="Remover item">
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
              <div className="flex items-center rounded-lg border border-white/10 bg-white/5">
                <button className="ghost-button h-10 min-h-0 w-10 p-0" onClick={() => updateQuantity(index, item.quantity - 1)} aria-label="Diminuir quantidade">
                  <Minus className="mx-auto h-4 w-4" aria-hidden="true" />
                </button>
                <span className="w-9 text-center text-sm font-black">{item.quantity}</span>
                <button className="ghost-button h-10 min-h-0 w-10 p-0" onClick={() => updateQuantity(index, item.quantity + 1)} aria-label="Aumentar quantidade">
                  <Plus className="mx-auto h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside className="h-fit rounded-lg border border-white/10 bg-[#141414] p-5">
        <h2 className="text-xl font-black text-white">Resumo do pedido</h2>
        <div className="mt-5 grid gap-3">
          <label className="grid gap-2 text-sm font-bold text-zinc-200">
            Calcular frete
            <span className="grid grid-cols-[1fr_auto] gap-2">
              <input className="field" value={zipCode} onChange={(event) => setZipCode(event.target.value)} placeholder="00000-000" />
              <button className="ghost-button px-4" type="button">
                <Truck className="h-4 w-4" aria-hidden="true" />
              </button>
            </span>
          </label>
          <label className="grid gap-2 text-sm font-bold text-zinc-200">
            Cupom
            <input className="field" value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="FORJA10" />
          </label>
        </div>
        <div className="my-5 grid gap-3 border-y border-white/10 py-5 text-sm">
          <div className="flex justify-between text-zinc-400">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Desconto</span>
            <span>- {formatCurrency(couponDiscount)}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Frete</span>
            <span>{shipping === 0 ? "Grátis" : formatCurrency(shipping)}</span>
          </div>
          <div className="flex justify-between text-lg font-black text-white">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
        <Link className="premium-button w-full px-6" href="/checkout">
          Finalizar compra
        </Link>
        <p className="mt-4 text-center text-xs leading-5 text-zinc-500">Pagamento protegido. Pix, cartão e boleto disponíveis no checkout.</p>
      </aside>
    </div>
  );
}
