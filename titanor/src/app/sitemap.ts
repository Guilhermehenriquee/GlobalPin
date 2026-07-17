import type { MetadataRoute } from "next";
import { blogPosts, partnerBrands, titanorCategoryGroups } from "@/lib/brand-content";
import { getStorefrontCategories, getStorefrontProducts } from "@/lib/storefront-data";
import { getAppUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = getAppUrl();
  const [categories, products] = await Promise.all([getStorefrontCategories(), getStorefrontProducts()]);
  const staticRoutes = [
    "",
    "/categorias",
    "/produtos",
    "/ofertas",
    "/lancamentos",
    "/masculino",
    "/feminino",
    "/infantil",
    "/marcas",
    "/blog",
    "/carrinho",
    "/checkout",
    "/login",
    "/cadastro",
    "/minha-conta",
    "/meus-pedidos",
    "/favoritos",
    "/sobre",
    "/trocas-e-devolucoes",
    "/politica-de-privacidade",
    "/termos-de-uso",
    "/contato",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${appUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...categories.map((category) => ({
      url: `${appUrl}/categoria/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...titanorCategoryGroups.map((category) => ({
      url: `${appUrl}/categoria/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...partnerBrands.map((brand) => ({
      url: `${appUrl}/marca/${brand.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...blogPosts.map((post) => ({
      url: `${appUrl}/blog/${post.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...products.map((product) => ({
      url: `${appUrl}/produtos/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...products.map((product) => ({
      url: `${appUrl}/produto/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
