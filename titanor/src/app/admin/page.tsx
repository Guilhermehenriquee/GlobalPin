import type { Metadata } from "next";
import { AlertTriangle, Boxes, DollarSign, PackageCheck, TicketPercent, Users } from "lucide-react";
import { getAdminCoupons, getAdminCustomers, getAdminOrders, getAdminProducts } from "@/lib/admin-data";
import { titanorMetadata } from "@/lib/seo";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = titanorMetadata({
  title: "Painel administrativo",
  description: "Dashboard administrativo TITANOR com vendas, pedidos, faturamento, estoque, clientes e cupons.",
  path: "/admin",
});

export default async function AdminPage() {
  const [products, orders, customers, coupons] = await Promise.all([getAdminProducts(), getAdminOrders(), getAdminCustomers(), getAdminCoupons()]);
  const lowStock = products.filter((product) => product.stock <= 12).length;
  const revenue = orders.reduce((total, order) => total + order.total, 0);
  const cards = [
    { label: "Total de vendas", value: formatCurrency(revenue), icon: DollarSign },
    { label: "Pedidos recentes", value: String(orders.length), icon: PackageCheck },
    { label: "Faturamento mes", value: formatCurrency(revenue), icon: DollarSign },
    { label: "Clientes cadastrados", value: String(customers.length), icon: Users },
    { label: "Estoque baixo", value: String(lowStock), icon: AlertTriangle },
    { label: "Cupons ativos", value: String(coupons.filter((coupon) => coupon.active).length), icon: TicketPercent },
  ];

  return (
    <div className="grid gap-8">
      <div>
        <p className="mb-2 text-sm font-bold uppercase text-[#e30613]">Dashboard</p>
        <h1 className="text-4xl font-black text-white">Operação TITANOR</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">Indicadores comerciais, pedidos, estoque e administração do catálogo.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-lg border border-white/10 bg-[#141414] p-5">
              <div className="mb-4 flex items-center justify-between">
                <Icon className="h-5 w-5 text-[#e30613]" aria-hidden="true" />
                <span className="rounded bg-white/5 px-2 py-1 text-xs text-zinc-400">hoje</span>
              </div>
              <p className="text-sm text-zinc-400">{card.label}</p>
              <p className="mt-2 text-2xl font-black text-white">{card.value}</p>
            </div>
          );
        })}
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-white/10 bg-[#141414]">
          <div className="border-b border-white/10 p-5">
            <h2 className="text-xl font-black text-white">Pedidos recentes</h2>
          </div>
          <div className="divide-y divide-white/10">
            {orders.slice(0, 8).map((order) => (
              <div key={order.id} className="grid gap-3 p-5 md:grid-cols-[1fr_auto_auto] md:items-center">
                <div>
                  <p className="font-black text-white">{order.number}</p>
                  <p className="text-sm text-zinc-500">{order.customer}</p>
                </div>
                <span className="rounded bg-[#e30613]/10 px-3 py-2 text-sm font-bold text-[#d6d6d6]">{order.statusLabel}</span>
                <span className="font-black text-white">{formatCurrency(order.total)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#141414]">
          <div className="border-b border-white/10 p-5">
            <h2 className="text-xl font-black text-white">Produtos mais vendidos</h2>
          </div>
          <div className="divide-y divide-white/10">
            {products
              .slice(0, 5)
              .map((product) => (
                <div key={product.id} className="flex items-center justify-between gap-3 p-5">
                  <div>
                    <p className="font-black text-white">{product.name}</p>
                    <p className="text-sm text-zinc-500">{product.category}</p>
                  </div>
                  <Boxes className="h-5 w-5 text-[#e30613]" aria-hidden="true" />
                </div>
              ))}
          </div>
        </div>
      </section>

      <section id="clientes" className="rounded-lg border border-white/10 bg-[#141414] p-5">
        <h2 className="text-xl font-black text-white">Clientes cadastrados</h2>
        <p className="mt-2 text-sm text-zinc-400">Base inicial preparada para segmentação, favoritos e recuperação de carrinho futuramente.</p>
      </section>

      <section id="cupons" className="rounded-lg border border-white/10 bg-[#141414] p-5">
        <h2 className="text-xl font-black text-white">Cupons</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {["FORJA10", "TITANOR15"].map((coupon) => (
            <div key={coupon} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="font-black text-white">{coupon}</p>
              <p className="text-sm text-zinc-400">Cupom ativo para campanhas de lançamento.</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
