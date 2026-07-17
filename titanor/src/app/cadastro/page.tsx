import type { Metadata } from "next";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { registerAction } from "@/app/actions/auth";
import { titanorMetadata } from "@/lib/seo";

export const metadata: Metadata = titanorMetadata({
  title: "Cadastro",
  description: "Crie sua conta TITANOR com consentimento LGPD, senha criptografada e acesso seguro.",
  path: "/cadastro",
});

type RegisterPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const registerErrorMessages: Record<string, string> = {
  "dados-invalidos": "Revise os dados e aceite a politica de privacidade.",
  "email-existente": "Esse e-mail ja esta cadastrado. Tente entrar na sua conta.",
  configuracao: "Cadastro indisponivel: configure DATABASE_URL e rode as migrations no ambiente.",
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const error = typeof params.erro === "string" ? params.erro : "";

  return (
    <section className="py-12">
      <div className="container-shell grid min-h-[60svh] place-items-center">
        <div className="w-full max-w-lg rounded-lg border border-white/10 bg-[#141414] p-6">
          <div className="mb-6">
            <p className="mb-2 text-sm font-bold uppercase text-[#e30613]">Cadastro</p>
            <h1 className="text-3xl font-black text-white">Crie sua conta TITANOR</h1>
            <p className="mt-2 text-sm leading-6 text-zinc-400">Compra rápida, favoritos salvos, pedidos e trocas organizadas.</p>
          </div>
          {error ? (
            <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {registerErrorMessages[error] || "Revise os dados. Talvez esse e-mail ja esteja cadastrado."}
            </p>
          ) : null}
          <form action={registerAction} className="grid gap-4">
            <input className="field" name="name" placeholder="Nome completo" required />
            <input className="field" name="email" type="email" placeholder="E-mail" required />
            <input className="field" name="password" type="password" placeholder="Senha com no mínimo 8 caracteres" required minLength={8} />
            <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-sm leading-6 text-zinc-300">
              <input className="mt-1 h-4 w-4 accent-[#e30613]" name="lgpdConsent" type="checkbox" required />
              Aceito receber comunicações da TITANOR e concordo com o uso dos meus dados conforme a Política de Privacidade.
            </label>
            <button className="premium-button px-6" type="submit">
              <UserPlus className="h-4 w-4" aria-hidden="true" />
              Criar conta
            </button>
          </form>
          <p className="mt-5 text-sm text-zinc-400">
            Já tem conta?{" "}
            <Link href="/login" className="font-bold text-[#d6d6d6]">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
