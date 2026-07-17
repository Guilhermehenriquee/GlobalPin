import type { Metadata } from "next";
import { getAdminCustomers } from "@/lib/admin-data";
import { titanorMetadata } from "@/lib/seo";

export const metadata: Metadata = titanorMetadata({
  title: "Admin clientes",
  description: "Gerencie clientes cadastrados na TITANOR.",
  path: "/admin/clientes",
});

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return (
    <div className="grid gap-8">
      <div>
        <p className="mb-2 text-sm font-bold uppercase text-[#e30613]">Relacionamento</p>
        <h1 className="text-4xl font-black text-white">Clientes</h1>
      </div>
      <section className="overflow-hidden rounded-lg border border-white/10 bg-[#141414]">
        <div className="grid gap-4 border-b border-white/10 p-4 text-sm font-black text-zinc-300 md:grid-cols-[1fr_1.2fr_120px_120px]">
          <span>Nome</span>
          <span>E-mail</span>
          <span>Perfil</span>
          <span>Cadastro</span>
        </div>
        {customers.map((customer) => (
          <div key={customer.id} className="grid gap-4 border-b border-white/10 p-4 text-sm last:border-b-0 md:grid-cols-[1fr_1.2fr_120px_120px]">
            <span className="font-bold text-white">{customer.name}</span>
            <span className="text-zinc-400">{customer.email}</span>
            <span className="text-[#d6d6d6]">{customer.role}</span>
            <span className="text-zinc-500">{customer.createdAt}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
