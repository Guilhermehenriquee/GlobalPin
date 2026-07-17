import { AdminModulePlaceholder } from "@/components/admin-module-placeholder";

export default function AdminPaymentsPage() {
  return (
    <AdminModulePlaceholder
      eyebrow="Pagamentos"
      title="Meios de pagamento"
      description="Controle Pix, cartao, boleto, carteira digital e status das integracoes de gateway."
      fields={["Gateway", "Metodo", "Status", "Observacao"]}
    />
  );
}
