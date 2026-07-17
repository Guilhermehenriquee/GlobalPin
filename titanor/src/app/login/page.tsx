import type { Metadata } from "next";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { loginAction } from "@/app/actions/auth";
import { titanorMetadata } from "@/lib/seo";

export const metadata: Metadata = titanorMetadata({
  title: "Login",
  description: "Acesse sua conta TITANOR para ver pedidos, favoritos, endereços e solicitações de troca.",
  path: "/login",
});

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const errorMessages: Record<string, string> = {
  "dados-invalidos": "Informe seu e-mail ou admin e sua senha.",
  credenciais: "Login ou senha inválidos.",
  configuracao:
    "Login indisponível: configure DATABASE_URL no Render ou defina ADMIN_EMAIL e ADMIN_PASSWORD nas variáveis de ambiente.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const error = typeof params.erro === "string" ? params.erro : "";
  const callbackUrl = typeof params.callbackUrl === "string" ? params.callbackUrl : "/minha-conta";

  return (
    <section className="py-12">
      <div className="container-shell grid min-h-[60svh] place-items-center">
        <div className="w-full max-w-md rounded-lg border border-white/10 bg-[#141414] p-6">
          <div className="mb-6">
            <p className="mb-2 text-sm font-bold uppercase text-[#e30613]">Entrar</p>
            <h1 className="text-3xl font-black text-white">Acesse sua conta</h1>
            <p className="mt-2 text-sm leading-6 text-zinc-400">Pedidos, favoritos, endereços e rastreamento em um só lugar.</p>
          </div>
          {error ? (
            <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {errorMessages[error] || "Não foi possível entrar. Confira os dados e tente novamente."}
            </p>
          ) : null}
          <form action={loginAction} className="grid gap-4">
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <input className="field" name="email" type="text" placeholder="E-mail ou admin" autoComplete="username" required />
            <input className="field" name="password" type="password" placeholder="Senha" required />
            <button className="premium-button px-6" type="submit">
              <LogIn className="h-4 w-4" aria-hidden="true" />
              Entrar
            </button>
          </form>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-400">
            <Link href="/cadastro" className="hover:text-[#e30613]">Criar conta</Link>
            <Link href="/contato" className="hover:text-[#e30613]">Recuperar senha</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
