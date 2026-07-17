const errorMessages: Record<string, string> = {
  banco: "Banco de dados indisponivel. Configure DATABASE_URL e rode as migrations antes de salvar.",
  upload: "Nao foi possivel enviar a imagem. Use JPG, PNG ou WebP com ate 4 MB.",
  validacao: "Revise os campos obrigatorios e tente novamente.",
  permissao: "Voce precisa estar logado como administrador.",
};

const successMessages: Record<string, string> = {
  salvo: "Registro salvo com sucesso.",
  status: "Status do pedido atualizado.",
};

type AdminFeedbackProps = {
  error?: string;
  success?: string;
};

export function AdminFeedback({ error, success }: AdminFeedbackProps) {
  if (!error && !success) {
    return null;
  }

  if (error) {
    return (
      <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-100">
        {errorMessages[error] || "Nao foi possivel concluir a acao."}
      </p>
    );
  }

  return (
    <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-bold text-emerald-100">
      {successMessages[success || ""] || "Acao concluida com sucesso."}
    </p>
  );
}
