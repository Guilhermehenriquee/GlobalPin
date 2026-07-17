import type { Metadata } from "next";
import { Save } from "lucide-react";
import { createBannerAction } from "@/app/actions/admin";
import { AdminFeedback } from "@/components/admin-feedback";
import { SafeImage } from "@/components/safe-image";
import { getAdminBanners } from "@/lib/admin-data";
import { titanorMetadata } from "@/lib/seo";

export const metadata: Metadata = titanorMetadata({
  title: "Admin banners",
  description: "Gerencie banners, campanhas e vitrines da home TITANOR.",
  path: "/admin/banners",
});

type AdminBannersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminBannersPage({ searchParams }: AdminBannersPageProps) {
  const params = await searchParams;
  const banners = await getAdminBanners();
  const error = typeof params.erro === "string" ? params.erro : undefined;
  const success = typeof params.sucesso === "string" ? params.sucesso : undefined;

  return (
    <div className="grid gap-8">
      <div>
        <p className="mb-2 text-sm font-bold uppercase text-[#e30613]">Vitrine</p>
        <h1 className="text-4xl font-black text-white">Banners</h1>
      </div>

      <AdminFeedback error={error} success={success} />

      <section className="rounded-lg border border-white/10 bg-[#141414] p-5">
        <h2 className="mb-5 text-xl font-black text-white">Novo banner</h2>
        <form action={createBannerAction} encType="multipart/form-data" className="grid gap-4 md:grid-cols-4">
          <input className="field md:col-span-2" name="title" placeholder="Título" required />
          <input className="field md:col-span-2" name="subtitle" placeholder="Subtítulo" />
          <input className="field md:col-span-3 file:mr-4 file:rounded file:border-0 file:bg-[#e30613] file:px-4 file:py-2 file:text-sm file:font-black file:text-black" name="imageFile" type="file" accept="image/jpeg,image/png,image/webp" aria-label="Imagem do banner" required />
          <input className="field md:col-span-1" name="link" placeholder="/produtos" />
          <button className="premium-button px-5 md:col-span-1" type="submit">
            <Save className="h-4 w-4" aria-hidden="true" />
            Salvar
          </button>
        </form>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {banners.map((banner) => (
          <article key={banner.id} className="overflow-hidden rounded-lg border border-white/10 bg-[#141414]">
            <div className="relative aspect-video bg-zinc-900">
              <SafeImage src={banner.image} alt={banner.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </div>
            <div className="p-5">
              <p className="text-xl font-black text-white">{banner.title}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{banner.subtitle}</p>
              <p className="mt-3 text-sm font-bold text-[#d6d6d6]">{banner.active ? "ativo" : "inativo"}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
