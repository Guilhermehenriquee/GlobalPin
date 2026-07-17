import type { Metadata } from "next";
import { Save } from "lucide-react";
import { createProductAction } from "@/app/actions/admin";
import { AdminFeedback } from "@/components/admin-feedback";
import { getAdminCategories, getAdminProducts } from "@/lib/admin-data";
import { titanorMetadata } from "@/lib/seo";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = titanorMetadata({
  title: "Admin produtos",
  description: "Cadastro e edição de produtos, estoque, SKU, categorias, fotos e variações na TITANOR.",
  path: "/admin/produtos",
});

type AdminProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([getAdminProducts(), getAdminCategories()]);
  const error = typeof params.erro === "string" ? params.erro : undefined;
  const success = typeof params.sucesso === "string" ? params.sucesso : undefined;

  return (
    <div className="grid gap-8">
      <div>
        <div>
          <p className="mb-2 text-sm font-bold uppercase text-[#e30613]">Catálogo</p>
          <h1 className="text-4xl font-black text-white">Produtos</h1>
        </div>
      </div>

      <AdminFeedback error={error} success={success} />

      <section className="rounded-lg border border-white/10 bg-[#141414] p-5">
        <h2 className="mb-5 text-xl font-black text-white">Cadastro rápido</h2>
        <form action={createProductAction} encType="multipart/form-data" className="grid gap-4 md:grid-cols-6">
          <input className="field md:col-span-3" name="name" placeholder="Nome do produto" required />
          <input className="field md:col-span-1" name="sku" placeholder="SKU" required />
          <input className="field md:col-span-1" name="price" placeholder="Preço" required />
          <input className="field md:col-span-1" name="stock" placeholder="Estoque" required />
          <select className="field md:col-span-2" name="categoryId" required>
            <option value="">Categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input className="field md:col-span-2" name="brand" placeholder="Marca" required />
          <input className="field md:col-span-2" name="modality" placeholder="Modalidade" required />
          <input className="field md:col-span-2" name="salePrice" placeholder="Preço promocional" />
          <input className="field md:col-span-2" name="sizes" placeholder="Tamanhos separados por vírgula" required />
          <input className="field md:col-span-2" name="colors" placeholder="Cores separadas por vírgula" required />
          <input className="field md:col-span-6 file:mr-4 file:rounded file:border-0 file:bg-[#e30613] file:px-4 file:py-2 file:text-sm file:font-black file:text-white" name="imageFile" type="file" accept="image/jpeg,image/png,image/webp" aria-label="Foto principal do produto" required />
          <textarea className="field min-h-24 py-3 md:col-span-3" name="description" placeholder="Descrição curta" required />
          <textarea className="field min-h-24 py-3 md:col-span-3" name="fullDescription" placeholder="Descrição completa" required />
          <button className="premium-button px-5 md:col-span-2" type="submit">
            <Save className="h-4 w-4" aria-hidden="true" />
            Salvar produto
          </button>
        </form>
      </section>

      <section className="overflow-x-auto rounded-lg border border-white/10 bg-[#141414]">
        <div className="grid min-w-[640px] grid-cols-[1fr_120px_100px_100px] gap-4 border-b border-white/10 p-4 text-sm font-black text-zinc-300">
          <span>Produto</span>
          <span>Categoria</span>
          <span>Estoque</span>
          <span>Preço</span>
        </div>
        {products.map((product) => (
          <div key={product.id} className="grid min-w-[640px] grid-cols-[1fr_120px_100px_100px] gap-4 border-b border-white/10 p-4 text-sm last:border-b-0">
            <span className="font-bold text-white">{product.name}</span>
            <span className="text-zinc-400">{product.category}</span>
            <span className={product.stock <= 12 ? "font-black text-red-300" : "text-zinc-400"}>{product.stock}</span>
            <span className="text-zinc-300">{formatCurrency(product.salePrice || product.price)}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
