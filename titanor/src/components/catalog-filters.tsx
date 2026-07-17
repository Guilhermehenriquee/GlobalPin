"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import type { Category, Product } from "@/lib/types";

type CatalogFiltersProps = {
  products: Product[];
  categories: Category[];
  initialQuery?: string;
  categorySlug?: string;
};

export function CatalogFilters({ products, categories, initialQuery = "", categorySlug }: CatalogFiltersProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(categorySlug || "todos");
  const highestPrice = Math.max(1000, ...products.map((product) => product.salePrice || product.price));
  const priceLimit = Math.ceil(highestPrice / 20) * 20;
  const [maxPrice, setMaxPrice] = useState(String(priceLimit));
  const [size, setSize] = useState("todos");
  const [color, setColor] = useState("todos");
  const [brand, setBrand] = useState("todos");
  const [modality, setModality] = useState("todos");
  const [availability, setAvailability] = useState("todos");
  const [minRating, setMinRating] = useState("0");
  const [promotion, setPromotion] = useState(false);
  const [sort, setSort] = useState("relevancia");

  const sizes = Array.from(new Set(products.flatMap((product) => product.size))).slice(0, 16);
  const colors = Array.from(new Set(products.flatMap((product) => product.color))).slice(0, 12);
  const brands = Array.from(new Set(products.map((product) => product.brand))).sort();
  const modalities = Array.from(new Set(products.map((product) => product.modality || product.category))).sort();

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return products.filter((product) => {
      const haystack = [
        product.name,
        product.brand,
        product.modality,
        product.category,
        product.description,
        product.size.join(" "),
        product.color.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      const price = product.salePrice || product.price;

      return (
        (!normalized || haystack.includes(normalized)) &&
        (category === "todos" || product.categorySlug === category) &&
        (brand === "todos" || product.brand === brand) &&
        (modality === "todos" || product.modality === modality || product.category === modality) &&
        (size === "todos" || product.size.includes(size)) &&
        (color === "todos" || product.color.includes(color)) &&
        (availability === "todos" || (availability === "disponivel" ? product.stock > 0 : product.stock <= 12)) &&
        product.rating >= Number(minRating) &&
        (!promotion || product.promotion) &&
        price <= Number(maxPrice)
      );
    });
  }, [availability, brand, category, color, maxPrice, minRating, modality, products, promotion, query, size]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const priceA = a.salePrice || a.price;
      const priceB = b.salePrice || b.price;
      const discountA = a.salePrice ? a.price - a.salePrice : 0;
      const discountB = b.salePrice ? b.price - b.salePrice : 0;

      if (sort === "menor-preco") return priceA - priceB;
      if (sort === "maior-preco") return priceB - priceA;
      if (sort === "maior-desconto") return discountB - discountA;
      if (sort === "melhor-avaliacao") return b.rating - a.rating;
      if (sort === "lancamentos") return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
      if (sort === "mais-vendidos") return Number(Boolean(b.bestSeller)) - Number(Boolean(a.bestSeller));
      return Number(Boolean(b.featured || b.bestSeller)) - Number(Boolean(a.featured || a.bestSeller));
    });
  }, [filtered, sort]);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit rounded-lg border border-white/10 bg-[#141414] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
        <div className="mb-5 flex items-center gap-2 text-lg font-black text-white">
          <SlidersHorizontal className="h-5 w-5 text-[#e30613]" aria-hidden="true" />
          Filtros
        </div>
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-bold text-zinc-200">
            Busca inteligente
            <span className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3">
              <Search className="h-4 w-4 text-[#e30613]" aria-hidden="true" />
              <input className="h-11 flex-1 bg-transparent text-sm font-normal outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nome, marca, modalidade" />
            </span>
          </label>
          <label className="grid gap-2 text-sm font-bold text-zinc-200">
            Categoria
            <select className="field" value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="todos">Todas</option>
              {categories.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-zinc-200">
            Preço máximo: R$ {maxPrice}
            <input className="accent-[#e30613]" type="range" min="80" max={priceLimit} step="20" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-zinc-200">
            Marca
            <select className="field" value={brand} onChange={(event) => setBrand(event.target.value)}>
              <option value="todos">Todas</option>
              {brands.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-zinc-200">
            Modalidade
            <select className="field" value={modality} onChange={(event) => setModality(event.target.value)}>
              <option value="todos">Todas</option>
              {modalities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-zinc-200">
            Tamanho
            <select className="field" value={size} onChange={(event) => setSize(event.target.value)}>
              <option value="todos">Todos</option>
              {sizes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-zinc-200">
            Cor
            <select className="field" value={color} onChange={(event) => setColor(event.target.value)}>
              <option value="todos">Todas</option>
              {colors.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-zinc-200">
            Disponibilidade
            <select className="field" value={availability} onChange={(event) => setAvailability(event.target.value)}>
              <option value="todos">Todas</option>
              <option value="disponivel">Em estoque</option>
              <option value="baixo">Estoque baixo</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-zinc-200">
            Avaliacao minima
            <select className="field" value={minRating} onChange={(event) => setMinRating(event.target.value)}>
              <option value="0">Todas</option>
              <option value="4">4 estrelas ou mais</option>
              <option value="4.5">4.5 estrelas ou mais</option>
            </select>
          </label>
          <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-sm font-bold text-zinc-200">
            <input className="h-4 w-4 accent-[#e30613]" type="checkbox" checked={promotion} onChange={(event) => setPromotion(event.target.checked)} />
            Somente promoção
          </label>
        </div>
      </aside>

      <div>
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-zinc-400">
            {sorted.length} produto{sorted.length === 1 ? "" : "s"} encontrado{sorted.length === 1 ? "" : "s"}
          </p>
          <select className="field max-w-full sm:max-w-56" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="relevancia">Relevancia</option>
            <option value="mais-vendidos">Mais vendidos</option>
            <option value="lancamentos">Lancamentos</option>
            <option value="menor-preco">Menor preco</option>
            <option value="maior-preco">Maior preco</option>
            <option value="maior-desconto">Maior desconto</option>
            <option value="melhor-avaliacao">Melhor avaliacao</option>
          </select>
        </div>
        {sorted.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {sorted.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-white/10 bg-[#141414] p-10 text-center">
            <p className="text-xl font-black text-white">Nenhum produto encontrado</p>
            <p className="mt-2 text-sm text-zinc-400">Ajuste os filtros para encontrar o equipamento ideal.</p>
          </div>
        )}
      </div>
    </div>
  );
}
