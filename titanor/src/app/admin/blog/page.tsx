import { AdminModulePlaceholder } from "@/components/admin-module-placeholder";

export default function AdminBlogPage() {
  return (
    <AdminModulePlaceholder
      eyebrow="Blog"
      title="Conteudo esportivo"
      description="Crie guias de compra, dicas de treino, comparativos e artigos para SEO."
      fields={["Titulo", "Slug", "Categoria", "Imagem principal"]}
    />
  );
}
