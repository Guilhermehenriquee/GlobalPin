import type { Metadata } from "next";
import { CartClient } from "@/components/cart-client";
import { titanorMetadata } from "@/lib/seo";

export const metadata: Metadata = titanorMetadata({
  title: "Carrinho",
  description: "Revise seu carrinho TITANOR, altere quantidades, aplique cupom, calcule frete e finalize sua compra.",
  path: "/carrinho",
});

export default function CartPage() {
  return (
    <section className="py-12">
      <div className="container-shell">
        <div className="mb-10">
          <p className="mb-2 text-sm font-bold uppercase text-[#e30613]">Carrinho</p>
          <h1 className="text-4xl font-black text-white md:text-5xl">Sua seleção</h1>
        </div>
        <CartClient />
      </div>
    </section>
  );
}
