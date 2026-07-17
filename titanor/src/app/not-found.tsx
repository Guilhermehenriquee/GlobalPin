import Link from "next/link";

export default function NotFound() {
  return (
    <section className="grid min-h-[60svh] place-items-center py-12">
      <div className="container-shell max-w-lg rounded-lg border border-white/10 bg-[#141414] p-8 text-center">
        <p className="mb-2 text-sm font-bold uppercase text-[#e30613]">404</p>
        <h1 className="text-3xl font-black text-white">Página não encontrada</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">O caminho solicitado não existe ou foi movido.</p>
        <Link className="premium-button mt-6 px-6" href="/produtos">
          Ver produtos
        </Link>
      </div>
    </section>
  );
}
