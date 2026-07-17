import { AdminModulePlaceholder } from "@/components/admin-module-placeholder";

export default function AdminPagesPage() {
  return (
    <AdminModulePlaceholder
      eyebrow="Paginas"
      title="Paginas institucionais"
      description="Gerencie paginas de politica, termos, ajuda, FAQ e conteudos institucionais."
      fields={["Titulo", "Slug", "Meta description", "Status"]}
    />
  );
}
