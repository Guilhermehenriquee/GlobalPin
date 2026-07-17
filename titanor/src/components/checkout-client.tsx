"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { Copy, CreditCard, FileText, QrCode, ShieldCheck, Truck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { clearCartItems, useCartItems } from "@/lib/cart-store";

type CheckoutResponse =
  | {
      mode: "stripe";
      url: string;
    }
  | {
      mode: "mock";
      orderNumber: string;
      pixCopyPaste?: string;
      message: string;
    };

export function CheckoutClient() {
  const items = useCartItems();
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card" | "boleto">("pix");
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [coupon, setCoupon] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckoutResponse | null>(null);
  const [error, setError] = useState("");

  const subtotal = useMemo(() => items.reduce((total, item) => total + item.price * item.quantity, 0), [items]);
  const discount = coupon.trim().toUpperCase() === "FORJA10" && subtotal >= 199 ? subtotal * 0.1 : 0;
  const shipping = subtotal >= 399 ? 0 : shippingMethod === "express" ? 49.9 : 29.9;
  const total = Math.max(subtotal - discount + shipping, 0);

  async function submitCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      items,
      customer: {
        name: String(form.get("name") || ""),
        email: String(form.get("email") || ""),
        document: String(form.get("document") || ""),
        phone: String(form.get("phone") || ""),
      },
      address: {
        zipCode: String(form.get("zipCode") || ""),
        street: String(form.get("street") || ""),
        number: String(form.get("number") || ""),
        district: String(form.get("district") || ""),
        city: String(form.get("city") || ""),
        state: String(form.get("state") || "").toUpperCase(),
      },
      shippingMethod,
      paymentMethod,
      coupon,
    };

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as CheckoutResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Nao foi possivel iniciar o checkout.");
      }

      if (data.mode === "stripe") {
        window.location.href = data.url;
        return;
      }

      setResult(data);
      if (data.mode === "mock") {
        clearCartItems();
      }
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0 && !result) {
    return (
      <div className="rounded-lg border border-white/10 bg-[#141414] p-10 text-center">
        <h1 className="text-3xl font-black text-white">Carrinho vazio</h1>
        <p className="mt-3 text-sm text-zinc-400">Adicione produtos antes de finalizar a compra.</p>
        <Link className="premium-button mt-6 px-6" href="/produtos">
          Ver produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <form className="grid gap-6" onSubmit={submitCheckout}>
        <section className="rounded-lg border border-white/10 bg-[#141414] p-5">
          <h2 className="mb-5 text-xl font-black text-white">Dados do cliente</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <input className="field" name="name" placeholder="Nome completo" required />
            <input className="field" name="email" type="email" placeholder="E-mail" required />
            <input className="field" name="document" placeholder="CPF" required />
            <input className="field" name="phone" placeholder="Telefone" required />
          </div>
        </section>

        <section className="rounded-lg border border-white/10 bg-[#141414] p-5">
          <h2 className="mb-5 text-xl font-black text-white">Endereço de entrega</h2>
          <div className="grid gap-4 md:grid-cols-6">
            <input className="field md:col-span-2" name="zipCode" placeholder="CEP" required />
            <input className="field md:col-span-4" name="street" placeholder="Rua" required />
            <input className="field md:col-span-2" name="number" placeholder="Número" required />
            <input className="field md:col-span-2" name="district" placeholder="Bairro" required />
            <input className="field md:col-span-1" name="state" placeholder="UF" maxLength={2} required />
            <input className="field md:col-span-1" name="city" placeholder="Cidade" required />
          </div>
        </section>

        <section className="rounded-lg border border-white/10 bg-[#141414] p-5">
          <h2 className="mb-5 text-xl font-black text-white">Envio</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <button
              className="option-button p-4"
              data-active={shippingMethod === "standard" ? "true" : "false"}
              type="button"
              onClick={() => setShippingMethod("standard")}
            >
              <Truck className="mb-3 h-5 w-5 text-[#e30613]" aria-hidden="true" />
              <span className="block font-black text-white">Entrega padrão</span>
              <span className="text-sm text-zinc-400">5 a 9 dias úteis</span>
            </button>
            <button
              className="option-button p-4"
              data-active={shippingMethod === "express" ? "true" : "false"}
              type="button"
              onClick={() => setShippingMethod("express")}
            >
              <Truck className="mb-3 h-5 w-5 text-[#e30613]" aria-hidden="true" />
              <span className="block font-black text-white">Entrega expressa</span>
              <span className="text-sm text-zinc-400">2 a 4 dias úteis</span>
            </button>
          </div>
        </section>

        <section className="rounded-lg border border-white/10 bg-[#141414] p-5">
          <h2 className="mb-5 text-xl font-black text-white">Pagamento</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { id: "pix", label: "Pix", icon: QrCode },
              { id: "card", label: "Cartão", icon: CreditCard },
              { id: "boleto", label: "Boleto", icon: FileText },
            ].map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  className="option-button p-4"
                  data-active={paymentMethod === method.id ? "true" : "false"}
                  type="button"
                  onClick={() => setPaymentMethod(method.id as "pix" | "card" | "boleto")}
                >
                  <Icon className="mb-3 h-5 w-5 text-[#e30613]" aria-hidden="true" />
                  <span className="font-black text-white">{method.label}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-zinc-400">
            <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-[#e30613]" aria-hidden="true" />
            Em produção, o Stripe Checkout exibe os métodos habilitados no Dashboard. O Pix usa QR Code ou código copia e cola aprovado pelo app bancário.
          </p>
        </section>

        <button className="premium-button px-6" disabled={loading || items.length === 0} type="submit">
          {loading ? "Processando..." : "Confirmar compra segura"}
        </button>
        {error ? <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</p> : null}
      </form>

      <aside className="h-fit rounded-lg border border-white/10 bg-[#141414] p-5">
        <h2 className="text-xl font-black text-white">Resumo</h2>
        <div className="mt-5 grid gap-3">
          {items.map((item) => (
            <div key={`${item.id}-${item.size}-${item.color}`} className="flex justify-between gap-3 text-sm text-zinc-400">
              <span>
                {item.quantity}x {item.name}
              </span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <label className="mt-5 grid gap-2 text-sm font-bold text-zinc-200">
          Cupom
          <input className="field" value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="FORJA10" />
        </label>
        <div className="my-5 grid gap-3 border-y border-white/10 py-5 text-sm">
          <div className="flex justify-between text-zinc-400">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Desconto</span>
            <span>- {formatCurrency(discount)}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Frete</span>
            <span>{shipping === 0 ? "Grátis" : formatCurrency(shipping)}</span>
          </div>
          <div className="flex justify-between text-xl font-black text-white">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        {result?.mode === "mock" ? (
          <div className="rounded-lg border border-[#e30613]/40 bg-[#e30613]/10 p-4">
            <p className="font-black text-white">Pedido {result.orderNumber} criado</p>
            <p className="mt-2 text-sm leading-6 text-zinc-300">{result.message}</p>
            {result.pixCopyPaste ? (
              <div className="mt-4">
                <div className="mb-3 grid aspect-square place-items-center rounded-lg bg-white p-5 text-black">
                  <QrCode className="h-28 w-28" aria-hidden="true" />
                </div>
                <button
                  className="ghost-button w-full px-4"
                  type="button"
                  onClick={() => navigator.clipboard.writeText(result.pixCopyPaste || "")}
                >
                  <Copy className="h-4 w-4" aria-hidden="true" />
                  Copiar código Pix
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </aside>
    </div>
  );
}
