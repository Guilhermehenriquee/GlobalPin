import type { Metadata } from "next";
import { Save } from "lucide-react";
import { createCategoryAction } from "@/app/actions/admin";
import { AdminFeedback } from "@/components/admin-feedback";
import { getAdminCategories } from "@/lib/admin-data";
import { titanorMetadata } from "@/lib/seo";

export const metadata: Metadata = titanorMetadata({
  title: "Admin categorias",
  description: "Gerencie categorias do catálogo TITANOR.",
  path: "/admin/categorias",
});

type AdminCategoriesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminCategoriesPage({ searchParams }: AdminCategoriesPageProps) {
  const params = await searchParams;
  const categories = await getAdminCategories();
  const error = typeof params.erro === "string" ? params.erro : undefined;
  const success = typeof params.sucesso === "string" ? params.sucesso : undefined;

  return (
    <div className="grid gap-8">
      <div>
        <p className="mb-2 text-sm font-bold uppercase text-[#e30613]">Catálogo</p>
        <h1 className="text-4xl font-black text-white">Categorias</h1>
      </div>

      <AdminFeedback error={error} success={success} />

      <section className="rounded-lg border border-white/10 bg-[#141414] p-5">
        <h2 className="mb-5 text-xl font-black text-white">Nova categoria</h2>
        <form action={createCategoryAction} encType="multipart/form-data" className="grid gap-4 md:grid-cols-4">
          <input className="field md:col-span-1" name="name" placeholder="Nome" required />
          <input className="field md:col-span-3 file:mr-4 file:rounded file:border-0 file:bg-[#e30613] file:px-4 file:py-2 file:text-sm file:font-black file:text-black" name="imageFile" type="file" accept="image/jpeg,image/png,image/webp" aria-label="Imagem da categoria" />
          <textarea className="field min-h-24 py-3 md:col-span-4" name="description" placeholder="Descrição" required />
          <button className="premium-button px-5 md:col-span-1" type="submit">
            <Save className="h-4 w-4" aria-hidden="true" />
            Salvar
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-lg border border-white/10 bg-[#141414]">
        {categories.map((category) => (
          <div key={category.id} className="grid gap-2 border-b border-white/10 p-5 last:border-b-0 md:grid-cols-[220px_1fr_90px]">
            <div>
              <p className="font-black text-white">{category.name}</p>
              <p className="text-sm text-zinc-500">/{category.slug}</p>
            </div>
            <p className="text-sm leading-6 text-zinc-400">{category.description}</p>
            <span className="text-sm font-bold text-[#d6d6d6]">{category.active ? "ativa" : "inativa"}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
