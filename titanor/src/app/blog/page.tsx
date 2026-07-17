import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { blogPosts } from "@/lib/brand-content";
import { titanorMetadata } from "@/lib/seo";

export const metadata: Metadata = titanorMetadata({
  title: "Titanor Blog",
  description: "Guias de compra, dicas de treino, comparativos e conteudo esportivo para escolher produtos melhores.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <section className="py-12">
      <div className="container-shell">
        <div className="mb-10 max-w-3xl">
          <p className="mb-2 text-sm font-black uppercase text-[#e30613]">Titanor Blog</p>
          <h1 className="titan-title metal-text text-4xl md:text-6xl">Guias para evoluir em qualquer esporte</h1>
          <p className="mt-4 text-sm leading-7 text-zinc-400">Conteudos para comprar com mais seguranca, cuidar dos equipamentos e melhorar sua rotina esportiva.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group overflow-hidden rounded-lg border border-white/10 bg-[#141414] transition hover:border-[#e30613]/70">
              <div className="relative aspect-[4/3]">
                <Image src={post.image} alt={post.title} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <p className="text-xs font-black uppercase text-[#e30613]">{post.category} | {post.readTime}</p>
                <h2 className="mt-3 text-lg font-black text-white">{post.title}</h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-400">{post.excerpt}</p>
                <span className="mt-5 flex items-center gap-2 text-xs font-black uppercase text-white">
                  Ler artigo <ArrowRight className="h-4 w-4 text-[#e30613]" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
