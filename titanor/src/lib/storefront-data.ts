import type { Prisma } from "@prisma/client";
import { categories as fallbackCategories, products as fallbackProducts } from "@/lib/catalog";
import type { Category, Product } from "@/lib/types";
import { getPrisma } from "@/lib/prisma";

type DbProduct = Prisma.ProductGetPayload<{
  include: {
    category: true;
    _count: {
      select: {
        reviews: true;
      };
    };
  };
}>;

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

function toStringArray(value: Prisma.JsonValue, fallback: string[] = []) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  return items.length > 0 ? items : fallback;
}

function toStringRecord(value: Prisma.JsonValue, fallback: Record<string, string>) {
  if (!value || Array.isArray(value) || typeof value !== "object") {
    return fallback;
  }

  const entries = Object.entries(value).flatMap(([key, item]) => {
    if (typeof item === "string" || typeof item === "number" || typeof item === "boolean") {
      return [[key, String(item)]];
    }

    return [];
  });

  return entries.length > 0 ? Object.fromEntries(entries) : fallback;
}

function mapProduct(product: DbProduct): Product {
  const images = toStringArray(product.images, [
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=85",
  ]);

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    fullDescription: product.fullDescription,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : undefined,
    images,
    stock: product.stock,
    sku: product.sku,
    category: product.category.name,
    categorySlug: product.category.slug,
    brand: product.brand,
    size: toStringArray(product.size, ["Unico"]),
    color: toStringArray(product.color, ["Preto"]),
    variations: toStringArray(product.variations),
    rating: Number(product.rating),
    reviews: product._count.reviews,
    featured: product.featured,
    bestSeller: product.bestSeller,
    promotion: product.promotion,
    specs: toStringRecord(product.specs, {
      Marca: product.brand,
      Categoria: product.category.name,
      Modalidade: product.modality,
      SKU: product.sku,
    }),
    related: [],
    modality: product.modality,
  };
}

function mapCategory(category: { name: string; slug: string; description: string; image: string | null }): Category {
  return {
    name: category.name,
    slug: category.slug,
    description: category.description,
    image:
      category.image ||
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=85",
  };
}

export async function getStorefrontCategories(): Promise<Category[]> {
  if (!hasDatabaseUrl()) {
    return fallbackCategories;
  }

  try {
    const rows = await getPrisma().category.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    });

    return rows.length > 0 ? rows.map(mapCategory) : fallbackCategories;
  } catch (error) {
    console.error("TITANOR storefront categories fallback", error);
    return fallbackCategories;
  }
}

export async function getStorefrontCategoryBySlug(slug: string): Promise<Category | undefined> {
  if (!hasDatabaseUrl()) {
    return fallbackCategories.find((category) => category.slug === slug);
  }

  try {
    const row = await getPrisma().category.findUnique({
      where: { slug },
    });

    return row?.active ? mapCategory(row) : fallbackCategories.find((category) => category.slug === slug);
  } catch (error) {
    console.error("TITANOR storefront category fallback", error);
    return fallbackCategories.find((category) => category.slug === slug);
  }
}

export async function getStorefrontProducts(): Promise<Product[]> {
  if (!hasDatabaseUrl()) {
    return fallbackProducts;
  }

  try {
    const rows = await getPrisma().product.findMany({
      where: {
        active: true,
        category: {
          active: true,
        },
      },
      include: {
        category: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      orderBy: [{ featured: "desc" }, { bestSeller: "desc" }, { updatedAt: "desc" }],
    });

    return rows.length > 0 ? rows.map(mapProduct) : fallbackProducts;
  } catch (error) {
    console.error("TITANOR storefront products fallback", error);
    return fallbackProducts;
  }
}

export async function getStorefrontProductBySlug(slug: string): Promise<Product | undefined> {
  if (!hasDatabaseUrl()) {
    return fallbackProducts.find((product) => product.slug === slug);
  }

  try {
    const row = await getPrisma().product.findUnique({
      where: { slug },
      include: {
        category: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (row?.active && row.category.active) {
      return mapProduct(row);
    }

    return fallbackProducts.find((product) => product.slug === slug);
  } catch (error) {
    console.error("TITANOR storefront product fallback", error);
    return fallbackProducts.find((product) => product.slug === slug);
  }
}

export async function getStorefrontRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const allProducts = await getStorefrontProducts();
  const relatedBySlug = product.related
    .map((slug) => allProducts.find((item) => item.slug === slug))
    .filter((item): item is Product => Boolean(item));
  const sameCategory = allProducts.filter((item) => item.slug !== product.slug && item.categorySlug === product.categorySlug);
  const unique = new Map<string, Product>();

  for (const item of [...relatedBySlug, ...sameCategory]) {
    unique.set(item.slug, item);
  }

  return Array.from(unique.values()).slice(0, limit);
}
