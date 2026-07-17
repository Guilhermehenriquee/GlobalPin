"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Heart, Menu, MessageCircle, Search, ShieldCheck, ShoppingCart, Truck, User, X } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { categories, products } from "@/lib/catalog";
import { titanorCategoryGroups } from "@/lib/brand-content";
import { useCartItems } from "@/lib/cart-store";

const navItems = [
  { label: "Lancamentos", href: "/lancamentos" },
  { label: "Masculino", href: "/masculino" },
  { label: "Feminino", href: "/feminino" },
  { label: "Infantil", href: "/infantil" },
  { label: "Marcas", href: "/marcas" },
  { label: "Ofertas", href: "/ofertas", highlight: true },
  { label: "Blog", href: "/blog" },
];

const searchSuggestions = [
  "luva de boxe",
  "luva de goleiro",
  "luva ciclismo",
  "luva academia",
  "luva MMA",
  "tenis corrida",
  "bola futebol",
  "garrafa termica",
  ...products.slice(0, 5).map((product) => product.name),
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const cartItems = useCartItems();
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl">
      <div className="border-b border-white/10 bg-black text-[11px] font-black uppercase text-white">
        <div className="container-shell flex min-h-8 flex-wrap items-center justify-center gap-x-6 gap-y-2 py-2 md:justify-between">
          <span className="flex items-center gap-2">
            <Truck className="h-3.5 w-3.5 text-[#e30613]" aria-hidden="true" />
            Frete gratis acima de R$ 299,90
          </span>
          <span className="flex items-center gap-2">
            <MessageCircle className="h-3.5 w-3.5 text-[#e30613]" aria-hidden="true" />
            Atendimento via WhatsApp
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-[#e30613]" aria-hidden="true" />
            Entregamos para todo o Brasil
          </span>
        </div>
      </div>

      <div className="container-shell grid min-h-20 grid-cols-[auto_1fr_auto] items-center gap-3 py-3 lg:grid-cols-[auto_1fr_auto]">
        <div className="flex items-center gap-2">
          <button className="ghost-button h-11 min-h-0 w-11 p-0 xl:hidden" onClick={() => setOpen(true)} aria-label="Abrir menu">
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="hidden xl:block">
            <BrandLogo compact />
          </div>
        </div>

        <div className="flex justify-center xl:hidden">
          <BrandLogo compact />
        </div>

        <form action="/produtos" className="order-3 col-span-3 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 lg:order-none lg:col-span-1 lg:mx-auto lg:w-full lg:max-w-xl">
          <Search className="h-4 w-4 text-[#e30613]" aria-hidden="true" />
          <input
            name="q"
            list="titanor-search-suggestions"
            className="h-11 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
            placeholder="Buscar por produto, esporte, categoria ou marca"
          />
          <datalist id="titanor-search-suggestions">
            {searchSuggestions.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
        </form>

        <div className="flex items-center justify-end gap-2">
          <Link className="hidden text-right text-xs font-bold text-zinc-300 transition hover:text-white lg:block" href="/login">
            <span className="block text-white">Entrar / Cadastrar</span>
            Minha conta
          </Link>
          <Link className="ghost-button hidden h-11 min-h-0 w-11 p-0 sm:inline-flex" href="/minha-conta" aria-label="Minha conta">
            <User className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link className="ghost-button hidden h-11 min-h-0 w-11 p-0 sm:inline-flex" href="/favoritos" aria-label="Favoritos">
            <Heart className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link className="ghost-button relative h-11 min-h-0 w-11 p-0" href="/carrinho" aria-label="Carrinho">
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e30613] px-1 text-xs font-black text-white">
                {cartCount}
              </span>
            ) : null}
          </Link>
        </div>
      </div>

      <nav className="hidden border-t border-white/10 xl:block">
        <div className="container-shell flex h-12 items-center justify-center gap-8 text-xs font-black uppercase text-zinc-200">
          <div className="group relative h-full">
            <Link href="/categorias" className="flex h-full items-center gap-2 transition hover:text-white">
              Todas as categorias <ChevronDown className="h-4 w-4 text-[#e30613]" aria-hidden="true" />
            </Link>
            <div className="invisible absolute left-0 top-full z-50 w-[920px] translate-y-2 opacity-0 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="grid grid-cols-5 gap-5 border border-white/10 bg-[#101010] p-5 shadow-2xl shadow-black/60">
                {titanorCategoryGroups.map((group) => (
                  <Link key={group.slug} href={`/categoria/${group.slug}`} className="redline-card rounded-lg border border-white/10 bg-white/[0.03] p-4 transition hover:border-[#e30613]/60">
                    <span className="titan-title block text-lg text-white">{group.title}</span>
                    <span className="mt-2 line-clamp-3 block text-xs leading-5 text-zinc-400">{group.sports.slice(0, 6).join(", ")}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`transition hover:text-white ${item.highlight ? "text-[#e30613]" : ""}`}>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {open ? (
        <div className="fixed inset-0 z-50 bg-black/75 xl:hidden">
          <div className="flex min-h-screen w-full max-w-sm flex-col border-r border-white/10 bg-[#0a0a0a] p-5">
            <div className="mb-6 flex items-center justify-between">
              <BrandLogo compact />
              <button className="ghost-button h-10 min-h-0 w-10 p-0" onClick={() => setOpen(false)} aria-label="Fechar menu">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <nav className="grid gap-2 text-sm font-black uppercase text-zinc-200">
              <Link href="/categorias" className="rounded-lg bg-[#e30613] px-3 py-3 text-white" onClick={() => setOpen(false)}>
                Todas as categorias
              </Link>
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-lg px-3 py-3 hover:bg-white/5" onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-6 grid gap-2 text-sm text-zinc-300">
              {titanorCategoryGroups.slice(0, 8).map((category) => (
                <Link key={category.slug} href={`/categoria/${category.slug}`} className="rounded-lg border border-white/10 px-3 py-3 hover:border-[#e30613]/60" onClick={() => setOpen(false)}>
                  {category.title}
                </Link>
              ))}
              {categories.slice(0, 4).map((category) => (
                <Link key={category.slug} href={`/categoria/${category.slug}`} className="rounded-lg border border-white/10 px-3 py-3 hover:border-[#e30613]/60" onClick={() => setOpen(false)}>
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
