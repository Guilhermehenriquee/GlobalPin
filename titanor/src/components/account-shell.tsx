import Link from "next/link";
import { Heart, MapPin, Package, RotateCcw, User } from "lucide-react";
import type { SessionUser } from "@/lib/auth";

type AccountShellProps = {
  session: SessionUser | null;
};

export function AccountShell({ session }: AccountShellProps) {
  if (!session) {
    return (
      <div className="rounded-lg border border-white/10 bg-[#141414] p-8 text-center">
        <h1 className="text-3xl font-black text-white">Entre para acessar sua área</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-400">
          Sua conta guarda pedidos, favoritos, endereços e solicitações de troca.
        </p>
        <Link className="premium-button mt-6 px-6" href="/login">
          Entrar
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit rounded-lg border border-white/10 bg-[#141414] p-5">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-lg bg-[#e30613] font-black text-white">
            {session.name.charAt(0)}
          </span>
          <div>
            <p className="font-black text-white">{session.name}</p>
            <p className="text-sm text-zinc-500">{session.email}</p>
          </div>
        </div>
        <nav className="grid gap-2 text-sm font-bold text-zinc-300">
          {[
            { href: "/minha-conta", label: "Perfil", icon: User },
            { href: "/meus-pedidos", label: "Meus pedidos", icon: Package },
            { href: "/favoritos", label: "Favoritos", icon: Heart },
            { href: "/minha-conta#enderecos", label: "Endereços", icon: MapPin },
            { href: "/trocas-e-devolucoes", label: "Trocas", icon: RotateCcw },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex items-center gap-2 rounded-lg px-3 py-3 hover:bg-white/5 hover:text-[#e30613]">
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <section className="grid gap-5">
        <div className="rounded-lg border border-white/10 bg-[#141414] p-5">
          <p className="text-sm font-bold uppercase text-[#e30613]">Área do cliente</p>
          <h1 className="mt-2 text-3xl font-black text-white">Olá, {session.name.split(" ")[0]}</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">Gerencie pedidos, endereços, favoritos e solicitações de troca.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Pedidos", value: "0" },
            { label: "Favoritos", value: "0" },
            { label: "Trocas abertas", value: "0" },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-zinc-400">{item.label}</p>
              <p className="mt-2 text-3xl font-black text-white">{item.value}</p>
            </div>
          ))}
        </div>
        <div id="enderecos" className="rounded-lg border border-white/10 bg-[#141414] p-5">
          <h2 className="text-xl font-black text-white">Endereço principal</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input className="field" placeholder="CEP" />
            <input className="field" placeholder="Rua" />
            <input className="field" placeholder="Número" />
            <input className="field" placeholder="Cidade/UF" />
          </div>
        </div>
      </section>
    </div>
  );
}
