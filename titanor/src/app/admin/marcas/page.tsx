import { AdminModulePlaceholder } from "@/components/admin-module-placeholder";

export default function AdminBrandsPage() {
  return (
    <AdminModulePlaceholder
      eyebrow="Marcas"
      title="Controle de marcas"
      description="Cadastre logos, segmentos, slugs e destaque marcas parceiras na vitrine."
      fields={["Nome da marca", "Slug", "Segmento", "URL da logo"]}
    />
  );
}
