import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout-client";
import { titanorMetadata } from "@/lib/seo";

export const metadata: Metadata = titanorMetadata({
  title: "Checkout seguro",
  description: "Checkout TITANOR com dados do cliente, entrega, Pix, cartão, boleto e confirmação de compra.",
  path: "/checkout",
});

export default function CheckoutPage() {
  return (
    <section className="py-12">
      <div className="container-shell">
        <div className="mb-10 max-w-3xl">
          <p className="mb-2 text-sm font-bold uppercase text-[#e30613]">Checkout</p>
          <h1 className="text-4xl font-black text-white md:text-5xl">Finalizar compra</h1>
          <p className="mt-4 text-sm leading-6 text-zinc-400">
            Informe seus dados, escolha o envio e confirme o pagamento com Pix, cartão ou boleto.
          </p>
        </div>
        <CheckoutClient />
      </div>
    </section>
  );
}
