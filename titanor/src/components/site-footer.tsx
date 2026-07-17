import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { titanorCategoryGroups } from "@/lib/brand-content";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a]">
      <div className="container-shell grid gap-10 py-12 lg:grid-cols-[1.1fr_1fr_0.8fr_0.8fr_0.8fr]">
        <div>
          <BrandLogo className="mb-5" />
          <p className="max-w-sm text-sm leading-6 text-zinc-400">
            O universo completo do esporte em uma unica marca. Equipamentos, acessorios e tudo que voce precisa para evoluir em qualquer modalidade.
          </p>
        </div>

        <div>
          <p className="mb-4 titan-title text-lg text-white">Receba nossas novidades</p>
          <p className="mb-4 text-sm leading-6 text-zinc-400">Cadastre-se e receba ofertas exclusivas e lancamentos em primeira mao.</p>
          <form className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <input className="field" type="email" placeholder="Seu melhor e-mail" aria-label="E-mail para newsletter" />
            <button className="premium-button px-4" type="submit">
              Cadastrar
            </button>
          </form>
        </div>

        <div>
          <p className="mb-4 titan-title text-lg text-white">Institucional</p>
          <div className="grid gap-2 text-sm text-zinc-400">
            <Link href="/sobre" className="hover:text-white">Sobre a Titanor</Link>
            <Link href="/sobre" className="hover:text-white">Nossa historia</Link>
            <Link href="/contato" className="hover:text-white">Trabalhe conosco</Link>
            <Link href="/politica-de-privacidade" className="hover:text-white">Politica de privacidade</Link>
            <Link href="/termos-de-uso" className="hover:text-white">Termos de uso</Link>
          </div>
        </div>

        <div>
          <p className="mb-4 titan-title text-lg text-white">Ajuda</p>
          <div className="grid gap-2 text-sm text-zinc-400">
            <Link href="/contato" className="hover:text-white">Central de atendimento</Link>
            <Link href="/trocas-e-devolucoes" className="hover:text-white">Trocas e devolucoes</Link>
            <Link href="/checkout" className="hover:text-white">Formas de pagamento</Link>
            <Link href="/carrinho" className="hover:text-white">Prazo e entrega</Link>
            <Link href="/meus-pedidos" className="hover:text-white">Meus pedidos</Link>
          </div>
        </div>

        <div>
          <p className="mb-4 titan-title text-lg text-white">Siga a Titanor</p>
          <div className="mb-6 flex gap-3">
            {[Instagram, Facebook, Youtube].map((Icon, index) => (
              <Link key={index} href="/contato" className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-zinc-300 transition hover:border-[#e30613] hover:text-[#e30613]" aria-label="Rede social Titanor">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </Link>
            ))}
            <Link href="/blog" className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-xs font-black text-zinc-300 transition hover:border-[#e30613] hover:text-[#e30613]" aria-label="TikTok Titanor">
              TT
            </Link>
          </div>
          <p className="mb-3 text-xs font-black uppercase text-white">Pagamento seguro</p>
          <div className="flex flex-wrap gap-2">
            {["Visa", "Master", "Pix", "Boleto"].map((method) => (
              <span key={method} className="rounded border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-black text-zinc-300">
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="container-shell flex flex-col gap-4 text-xs text-zinc-500 lg:flex-row lg:items-center lg:justify-between">
          <p>2026 Titanor. Todos os direitos reservados.</p>
          <div className="flex flex-wrap gap-3">
            {titanorCategoryGroups.slice(0, 5).map((category) => (
              <Link key={category.slug} href={`/categoria/${category.slug}`} className="hover:text-white">
                {category.title}
              </Link>
            ))}
          </div>
          <p>
            Desenvolvido por <span className="font-black uppercase tracking-wide text-[#d6ad54]">avalace</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
