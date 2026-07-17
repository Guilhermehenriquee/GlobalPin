import { Send } from "lucide-react";

export function Newsletter() {
  return (
    <section className="section-band py-12">
      <div className="container-shell grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div>
          <p className="mb-2 text-sm font-black uppercase text-[#e30613]">Clube TITANOR</p>
          <h2 className="titan-title text-3xl text-white">Receba lancamentos, drops e cupons exclusivos.</h2>
        </div>
        <form className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <input className="field" type="email" placeholder="seuemail@exemplo.com" aria-label="E-mail para newsletter" />
          <button className="premium-button px-6" type="submit">
            <Send className="h-4 w-4" aria-hidden="true" />
            Assinar
          </button>
        </form>
      </div>
    </section>
  );
}
