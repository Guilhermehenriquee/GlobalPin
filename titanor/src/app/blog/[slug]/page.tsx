import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { blogPosts, getBlogPostBySlug } from "@/lib/brand-content";
import { titanorMetadata } from "@/lib/seo";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  return titanorMetadata({
    title: post?.title || "Blog",
    description: post?.excerpt || "Conteudo esportivo Titanor.",
    path: `/blog/${slug}`,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="py-12">
      <div className="container-shell max-w-4xl">
        <Link href="/blog" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-zinc-300 hover:text-white">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Voltar ao blog
        </Link>
        <p className="mb-3 text-sm font-black uppercase text-[#e30613]">{post.category} | {post.readTime}</p>
        <h1 className="titan-title metal-text text-4xl md:text-6xl">{post.title}</h1>
        <p className="mt-4 text-lg leading-8 text-zinc-300">{post.excerpt}</p>
        <div className="relative my-8 aspect-video overflow-hidden rounded-lg border border-white/10">
          <Image src={post.image} alt={post.title} fill priority sizes="100vw" className="object-cover" />
        </div>
        <div className="grid gap-6 text-base leading-8 text-zinc-300">
          <p>
            Escolher equipamento esportivo exige clareza sobre modalidade, nivel de uso, ajuste e frequencia de treino. A Titanor organiza produtos por esporte para reduzir duvida e acelerar sua compra.
          </p>
          <p>
            Compare material, conforto, durabilidade, garantia e indicacao de uso. Produtos de performance devem proteger o corpo, melhorar a experiencia e acompanhar sua evolucao sem comprometer seguranca.
          </p>
          <p>
            Antes de finalizar, confira tamanho, estoque, prazo de entrega, formas de pagamento e politica de troca. A compra certa e aquela que combina objetivo, rotina e confianca.
          </p>
        </div>
      </div>
    </article>
  );
}
