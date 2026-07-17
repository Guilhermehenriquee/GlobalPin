import type { Metadata } from "next";
import { Save } from "lucide-react";
import { createCouponAction } from "@/app/actions/admin";
import { AdminFeedback } from "@/components/admin-feedback";
import { getAdminCoupons } from "@/lib/admin-data";
import { titanorMetadata } from "@/lib/seo";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = titanorMetadata({
  title: "Admin cupons",
  description: "Gerencie cupons de desconto e regras promocionais da TITANOR.",
  path: "/admin/cupons",
});

type AdminCouponsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminCouponsPage({ searchParams }: AdminCouponsPageProps) {
  const params = await searchParams;
  const coupons = await getAdminCoupons();
  const error = typeof params.erro === "string" ? params.erro : undefined;
  const success = typeof params.sucesso === "string" ? params.sucesso : undefined;

  return (
    <div className="grid gap-8">
      <div>
        <p className="mb-2 text-sm font-bold uppercase text-[#e30613]">Promoções</p>
        <h1 className="text-4xl font-black text-white">Cupons</h1>
      </div>

      <AdminFeedback error={error} success={success} />

      <section className="rounded-lg border border-white/10 bg-[#141414] p-5">
        <h2 className="mb-5 text-xl font-black text-white">Novo cupom</h2>
        <form action={createCouponAction} className="grid gap-4 md:grid-cols-4">
          <input className="field" name="code" placeholder="Código" required />
          <input className="field" name="discountPct" placeholder="% desconto" />
          <input className="field" name="minOrderValue" placeholder="Pedido mínimo" />
          <button className="premium-button px-5" type="submit">
            <Save className="h-4 w-4" aria-hidden="true" />
            Salvar
          </button>
        </form>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {coupons.map((coupon) => (
          <div key={coupon.id} className="rounded-lg border border-white/10 bg-[#141414] p-5">
            <p className="text-xl font-black text-white">{coupon.code}</p>
            <p className="mt-2 text-sm text-zinc-400">
              {coupon.discountPct ? `${coupon.discountPct}% off` : coupon.discountValue ? `${formatCurrency(coupon.discountValue)} off` : "Cupom"}
              {coupon.minOrderValue ? ` acima de ${formatCurrency(coupon.minOrderValue)}` : ""}
            </p>
            <span className="mt-4 inline-flex rounded bg-[#e30613]/10 px-3 py-2 text-sm font-bold text-[#d6d6d6]">
              {coupon.active ? "ativo" : "inativo"}
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}
