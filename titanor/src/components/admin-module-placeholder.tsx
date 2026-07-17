type AdminModulePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  fields: string[];
};

export function AdminModulePlaceholder({ eyebrow, title, description, fields }: AdminModulePlaceholderProps) {
  return (
    <div className="grid gap-8">
      <div>
        <p className="mb-2 text-sm font-black uppercase text-[#e30613]">{eyebrow}</p>
        <h1 className="titan-title text-4xl text-white">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">{description}</p>
      </div>
      <section className="rounded-lg border border-white/10 bg-[#141414] p-5">
        <h2 className="mb-5 text-xl font-black text-white">Cadastro rapido</h2>
        <form className="grid gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <input key={field} className="field" placeholder={field} />
          ))}
          <button className="premium-button px-5 md:w-fit" type="button">
            Salvar
          </button>
        </form>
      </section>
      <section className="rounded-lg border border-white/10 bg-[#141414] p-5">
        <h2 className="text-xl font-black text-white">Itens cadastrados</h2>
        <p className="mt-2 text-sm text-zinc-400">Modulo preparado para conectar aos registros do banco PostgreSQL.</p>
      </section>
    </div>
  );
}
