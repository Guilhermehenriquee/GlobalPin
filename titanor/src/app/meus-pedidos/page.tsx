import type { Metadata } from "next";
import Link from "next/link";
import { Package, Truck } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getCustomerOrders } from "@/lib/admin-data";
import { titanorMetadata } from "@/lib/seo";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = titanorMetadata({
  title: "Meus pedidos",
  description: "Acompanhe pedidos, status de pagamento e rastreamento de entregas TITANOR.",
  path: "/meus-pedidos",
});

export default async function OrdersPage() {
  const session = await getSession();

  if (!session) {
    return (
      <section className="py-12">
        <div className="container-shell rounded-lg border border-white/10 bg-[#141414] p-8 text-center">
          <Package className="mx-auto mb-4 h-10 w-10 text-[#e30613]" aria-hidden="true" />
          <h1 className="text-3xl font-black text-white">Entre para ver seus pedidos</h1>
          <Link className="premium-button mt-6 px-6" href="/login?callbackUrl=/meus-pedidos">
            Entrar
          </Link>
        </div>
      </section>
    );
  }

  const orders = await getCustomerOrders(session.id);

  return (
    <section className="py-12">
      <div className="container-shell">
        <div className="mb-10">
          <p className="mb-2 text-sm font-bold uppercase text-[#e30613]">Pedidos</p>
          <h1 className="text-4xl font-black text-white">Meus pedidos</h1>
        </div>
        <div className="overflow-hidden rounded-lg border border-white/10 bg-[#141414]">
          {orders.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="mx-auto mb-4 h-10 w-10 text-[#e30613]" aria-hidden="true" />
              <h2 className="text-2xl font-black text-white">Nenhum pedido ainda</h2>
              <p className="mt-2 text-sm text-zinc-400">Quando voce finalizar uma compra logado, ela aparece aqui.</p>
              <Link className="premium-button mt-6 px-6" href="/produtos">
                Ver produtos
              </Link>
            </div>
          ) : null}
          {orders.map((order) => (
            <div key={order.id} className="grid gap-4 border-b border-white/10 p-5 last:border-b-0 md:grid-cols-[1fr_auto_auto] md:items-center">
              <div>
                <p className="font-black text-white">{order.number}</p>
                <p className="mt-1 text-sm text-zinc-400">{order.createdAt}</p>
              </div>
              <span className="rounded bg-white/5 px-3 py-2 text-sm font-bold text-[#d6d6d6]">{order.statusLabel}</span>
              <div className="flex items-center justify-between gap-4 md:min-w-48 md:justify-end">
                <span className="font-black text-white">{formatCurrency(order.total)}</span>
                <Truck className="h-5 w-5 text-zinc-500" aria-hidden="true" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
