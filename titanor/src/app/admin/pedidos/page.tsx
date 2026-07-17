import type { Metadata } from "next";
import { updateOrderStatusAction } from "@/app/actions/admin";
import { AdminFeedback } from "@/components/admin-feedback";
import { getAdminOrders, prismaOrderStatuses } from "@/lib/admin-data";
import { titanorMetadata } from "@/lib/seo";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = titanorMetadata({
  title: "Admin pedidos",
  description: "Gerenciamento de pedidos TITANOR com status de pagamento, separação, envio, entrega e cancelamento.",
  path: "/admin/pedidos",
});

type AdminOrdersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const params = await searchParams;
  const orders = await getAdminOrders();
  const error = typeof params.erro === "string" ? params.erro : undefined;
  const success = typeof params.sucesso === "string" ? params.sucesso : undefined;

  return (
    <div className="grid gap-8">
      <div>
        <p className="mb-2 text-sm font-bold uppercase text-[#e30613]">Pedidos</p>
        <h1 className="text-4xl font-black text-white">Gerenciamento de pedidos</h1>
      </div>

      <AdminFeedback error={error} success={success} />

      <section className="grid gap-3 md:grid-cols-3">
        {prismaOrderStatuses.map((status) => (
          <div key={status.value} className="rounded-lg border border-white/10 bg-[#141414] p-4">
            <p className="text-sm font-bold text-zinc-400">{status.label}</p>
            <p className="mt-2 text-2xl font-black text-white">{orders.filter((order) => order.status === status.value || order.statusLabel === status.label).length}</p>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-lg border border-white/10 bg-[#141414]">
        <div className="grid gap-4 border-b border-white/10 p-4 text-sm font-black text-zinc-300 md:grid-cols-[120px_1fr_170px_120px]">
          <span>Pedido</span>
          <span>Cliente</span>
          <span>Status</span>
          <span>Total</span>
        </div>
        {orders.map((order) => (
          <div key={order.id} className="grid gap-4 border-b border-white/10 p-4 text-sm last:border-b-0 md:grid-cols-[120px_1fr_170px_120px]">
            <span className="font-black text-white">{order.number}</span>
            <span className="text-zinc-400">{order.customer}</span>
            <form action={updateOrderStatusAction} className="grid grid-cols-[1fr_auto] gap-2">
              <input type="hidden" name="id" value={order.id} />
              <select className="field min-h-10" name="status" defaultValue={order.status}>
                {prismaOrderStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              <button className="ghost-button min-h-10 px-3" type="submit">
                OK
              </button>
            </form>
            <span className="font-black text-white">{formatCurrency(order.total)}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
