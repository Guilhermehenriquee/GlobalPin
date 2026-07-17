import { AdminModulePlaceholder } from "@/components/admin-module-placeholder";

export default function AdminShippingPage() {
  return (
    <AdminModulePlaceholder
      eyebrow="Frete"
      title="Regras de entrega"
      description="Prepare faixas, transportadoras, frete gratis e integracao futura com Correios ou Melhor Envio."
      fields={["Nome da regra", "Valor minimo", "Prazo estimado", "Regiao atendida"]}
    />
  );
}
