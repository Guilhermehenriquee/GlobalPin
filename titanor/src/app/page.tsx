import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  Dumbbell,
  Gamepad2,
  Headset,
  Medal,
  Mountain,
  RefreshCcw,
  ShieldCheck,
  Snowflake,
  Target,
  Trophy,
  Truck,
  Waves,
} from "lucide-react";
import { Newsletter } from "@/components/newsletter";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { blogPosts, partnerBrands, titanorCategoryGroups } from "@/lib/brand-content";
import { getStorefrontProducts } from "@/lib/storefront-data";

export const revalidate = 60;

const categoryIcons = [Trophy, Medal, ShieldCheck, Waves, Dumbbell, Mountain, Target, Snowflake, Truck, Gamepad2];

const benefits = [
  { icon: ShieldCheck, title: "Produtos originais", text: "Das melhores marcas do esporte" },
  { icon: CreditCard, title: "Parcele em ate 12x", text: "Compra facilitada no cartao" },
  { icon: RefreshCcw, title: "Troca garantida", text: "Ate 30 dias para trocar" },
  { icon: Truck, title: "Entrega nacional", text: "Receba onde estiver" },
  { icon: Headset, title: "Atendimento especializado", text: "Suporte para escolher certo" },
];

const promoTiles = [
  {
    title: "Lancamentos",
    text: "As novidades do esporte chegaram",
    href: "/lancamentos",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Vestuario",
    text: "Conforto e performance para treinar",
    href: "/produtos?q=vestuario",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Acessorios",
    text: "Tudo para completar sua rotina esportiva",
    href: "/produtos?q=acessorios",
    image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Ofertas imperdiveis",
    text: "Economia real em produtos selecionados",
    href: "/ofertas",
    image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=900&q=85",
  },
];

export default async function HomePage() {
  const products = await getStorefrontProducts();
  const featured = products.filter((product) => product.featured || product.bestSeller).slice(0, 6);

  return (
    <>
      <section className="diagonal-surface relative overflow-hidden border-b border-white/10">
        <Image
          src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1800&q=85"
          alt="Atletas de diferentes modalidades em ambiente escuro"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/88 to-black/28" />
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[linear-gradient(135deg,transparent_0_54%,rgba(227,6,19,0.55)_54%_56%,transparent_56%_100%)] lg:block" />
        <div className="absolute right-0 top-1/2 hidden h-80 w-[34rem] -translate-y-1/2 opacity-20 xl:block">
          <Image src="/brand/logo-titanor-oficial.png" alt="" fill sizes="544px" className="object-contain" />
        </div>
        <div className="container-shell relative flex min-h-[560px] items-center py-14 sm:min-h-[620px]">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded bg-[#e30613] px-3 py-2 text-xs font-black uppercase text-white">
              A nova casa de todos os esportes
            </p>
            <h1 className="titan-title metal-text text-balance text-4xl leading-none sm:text-5xl md:text-7xl lg:text-8xl">
              Todos os esportes.
              <span className="mt-2 block text-[#e30613]">Uma so forca.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-zinc-200 md:text-lg">
              Do campo a quadra, da agua a montanha, do ringue a arena digital. A Titanor equipa sua evolucao.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="premium-button px-7" href="/produtos">
                Ver produtos <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link className="ghost-button px-7" href="/categorias">
                Explorar categorias
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#0d0d0d]">
        <div className="container-shell grid gap-0 sm:grid-cols-2 lg:grid-cols-5">
          {benefits.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="redline-card flex items-center gap-3 border-b border-white/10 p-4 lg:border-b-0 lg:border-r lg:last:border-r-0">
                <Icon className="h-6 w-6 shrink-0 text-[#e30613]" aria-hidden="true" />
                <div>
                  <h2 className="titan-title text-base text-white">{item.title}</h2>
                  <p className="text-xs text-zinc-400">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-10">
        <div className="container-shell">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {titanorCategoryGroups.map((category, index) => {
              const Icon = categoryIcons[index] || Trophy;
              return (
                <Link
                  key={category.slug}
                  href={`/categoria/${category.slug}`}
                  className="group redline-card grid min-h-32 place-items-center rounded-lg border border-white/10 bg-[#141414] p-4 text-center transition hover:-translate-y-1 hover:border-[#e30613]/70"
                >
                  <Icon className="mb-3 h-8 w-8 text-white transition group-hover:text-[#e30613]" aria-hidden="true" />
                  <span className="titan-title text-sm text-white">{category.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-6">
        <div className="container-shell grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {promoTiles.map((tile) => (
            <Link key={tile.title} href={tile.href} className="group diagonal-surface relative min-h-52 overflow-hidden rounded-lg border border-white/10 bg-[#141414]">
              <Image src={tile.image} alt={tile.title} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover opacity-48 transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/72 to-transparent" />
              <div className="relative flex h-full min-h-52 flex-col justify-between p-5">
                <div>
                  <h2 className="titan-title text-2xl text-white">{tile.title}</h2>
                  <p className="mt-2 max-w-40 text-sm leading-6 text-zinc-300">{tile.text}</p>
                </div>
                <span className="inline-flex w-fit items-center gap-2 border border-white/20 px-3 py-2 text-xs font-black uppercase text-white transition group-hover:border-[#e30613] group-hover:text-[#e30613]">
                  Conferir <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-12">
        <div className="container-shell">
          <SectionHeading eyebrow="Produtos em destaque" title="Equipe sua evolucao" description="Cards preparados para venda rapida, desconto, avaliacao, estoque e compra direta." />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-band py-12">
        <div className="container-shell">
          <SectionHeading eyebrow="Marcas parceiras" title="As melhores marcas do esporte" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-11">
            {partnerBrands.map((brand) => (
              <Link key={brand.slug} href={`/marca/${brand.slug}`} className="grid min-h-20 place-items-center rounded-lg border border-white/10 bg-black/30 p-3 text-center transition hover:border-[#e30613]/70">
                <span className="titan-title text-lg text-[#d6d6d6]">{brand.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-2 text-sm font-black uppercase text-[#e30613]">Titanor Blog</p>
            <h2 className="titan-title text-4xl text-white">Conteudo para comprar melhor e treinar mais forte.</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-400">
              Guias de compra, comparativos, cuidados com equipamentos e dicas para iniciantes em qualquer modalidade.
            </p>
            <Link className="premium-button mt-6 px-6" href="/blog">
              Ler guias
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {blogPosts.slice(0, 2).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group overflow-hidden rounded-lg border border-white/10 bg-[#141414] transition hover:border-[#e30613]/70">
                <div className="relative aspect-video">
                  <Image src={post.image} alt={post.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <p className="text-xs font-black uppercase text-[#e30613]">{post.category}</p>
                  <h3 className="mt-2 font-black text-white">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
