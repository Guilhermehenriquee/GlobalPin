"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { categories as fallbackCategories } from "@/lib/catalog";
import { getPrisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

const productSchema = z.object({
  name: z.string().min(2),
  sku: z.string().min(2),
  categoryId: z.string().min(1),
  brand: z.string().min(2),
  price: z.coerce.number().positive(),
  salePrice: z.coerce.number().optional(),
  stock: z.coerce.number().int().min(0),
  description: z.string().min(8),
  fullDescription: z.string().min(8),
  sizes: z.string().min(1),
  colors: z.string().min(1),
  modality: z.string().min(2),
});

const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().min(8),
});

const couponSchema = z.object({
  code: z.string().min(3),
  discountPct: z.coerce.number().int().min(0).max(100).optional(),
  minOrderValue: z.coerce.number().min(0).optional(),
});

const bannerSchema = z.object({
  title: z.string().min(2),
  subtitle: z.string().optional(),
  link: z.string().optional(),
});

const maxUploadSize = 4 * 1024 * 1024;

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function ensureDatabase(path: string) {
  if (!process.env.DATABASE_URL) {
    redirect(`${path}?erro=banco`);
  }
}

function redirectInvalid(path: string): never {
  redirect(`${path}?erro=validacao`);
}

function redirectDatabaseError(path: string, error: unknown): never {
  console.error(`TITANOR admin action failed at ${path}`, error);
  redirect(`${path}?erro=banco`);
}

function redirectUploadError(path: string, error: unknown): never {
  console.error(`TITANOR upload failed at ${path}`, error);
  redirect(`${path}?erro=upload`);
}

function hasUploadedFile(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0;
}

function detectImageExtension(buffer: Buffer) {
  const isJpeg = buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isPng =
    buffer.length > 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a;
  const isWebp =
    buffer.length > 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP";

  if (isJpeg) {
    return "jpg";
  }

  if (isPng) {
    return "png";
  }

  if (isWebp) {
    return "webp";
  }

  return null;
}

async function readUploadedImage(fileValue: FormDataEntryValue | null) {
  if (!(fileValue instanceof File) || fileValue.size === 0 || fileValue.size > maxUploadSize) {
    return null;
  }

  const buffer = Buffer.from(await fileValue.arrayBuffer());
  const extension = detectImageExtension(buffer);
  const mimeByExtension = {
    jpg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
  };

  if (!extension) {
    return null;
  }

  return `data:${mimeByExtension[extension]};base64,${buffer.toString("base64")}`;
}

async function tryReadUploadedImage(actionPath: string, fileValue: FormDataEntryValue | null) {
  try {
    return await readUploadedImage(fileValue);
  } catch (error) {
    redirectUploadError(actionPath, error);
  }
}

async function resolveCategory(prisma: ReturnType<typeof getPrisma>, value: string) {
  const category = await prisma.category.findFirst({
    where: {
      OR: [{ id: value }, { slug: value }],
    },
  });

  if (category) {
    return { id: category.id, slug: category.slug };
  }

  const fallbackCategory = fallbackCategories.find((item) => item.slug === value);

  if (!fallbackCategory) {
    throw new Error(`Categoria nao encontrada: ${value}`);
  }

  const saved = await prisma.category.upsert({
    where: { slug: fallbackCategory.slug },
    update: {
      name: fallbackCategory.name,
      description: fallbackCategory.description,
      image: fallbackCategory.image,
      active: true,
    },
    create: {
      name: fallbackCategory.name,
      slug: fallbackCategory.slug,
      description: fallbackCategory.description,
      image: fallbackCategory.image,
    },
  });

  return { id: saved.id, slug: saved.slug };
}

async function uniqueProductSlug(prisma: ReturnType<typeof getPrisma>, name: string, sku: string) {
  const baseSlug = slugify(name);
  const existing = await prisma.product.findUnique({
    where: { slug: baseSlug },
    select: { sku: true },
  });

  if (!existing || existing.sku === sku) {
    return baseSlug;
  }

  return `${baseSlug}-${slugify(sku)}`;
}

export async function createCategoryAction(formData: FormData) {
  await requireAdmin();
  const path = "/admin/categorias";
  ensureDatabase(path);

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    redirectInvalid(path);
  }

  const imageFile = formData.get("imageFile");
  const imagePath = await tryReadUploadedImage(path, imageFile);

  if (hasUploadedFile(imageFile) && !imagePath) {
    redirectInvalid(path);
  }

  try {
    const prisma = getPrisma();
    await prisma.category.upsert({
      where: { slug: slugify(parsed.data.name) },
      update: {
        name: parsed.data.name,
        description: parsed.data.description,
        ...(imagePath ? { image: imagePath } : {}),
        active: true,
      },
      create: {
        name: parsed.data.name,
        slug: slugify(parsed.data.name),
        description: parsed.data.description,
        image: imagePath,
      },
    });
  } catch (error) {
    redirectDatabaseError(path, error);
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/admin/produtos");
  revalidatePath("/");
  revalidatePath(`/categoria/${slugify(parsed.data.name)}`);
  revalidatePath("/sitemap.xml");
  redirect(`${path}?sucesso=salvo`);
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();
  const path = "/admin/produtos";
  ensureDatabase(path);

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    sku: formData.get("sku"),
    categoryId: formData.get("categoryId"),
    brand: formData.get("brand"),
    price: formData.get("price"),
    salePrice: formData.get("salePrice") || undefined,
    stock: formData.get("stock"),
    description: formData.get("description"),
    fullDescription: formData.get("fullDescription"),
    sizes: formData.get("sizes"),
    colors: formData.get("colors"),
    modality: formData.get("modality"),
  });

  if (!parsed.success) {
    redirectInvalid(path);
  }

  const imagePath = await tryReadUploadedImage(path, formData.get("imageFile"));

  if (!imagePath) {
    redirectInvalid(path);
  }

  let savedSlug = slugify(parsed.data.name);
  let savedCategorySlug = "";

  try {
    const prisma = getPrisma();
    const category = await resolveCategory(prisma, parsed.data.categoryId);
    savedCategorySlug = category.slug;
    savedSlug = await uniqueProductSlug(prisma, parsed.data.name, parsed.data.sku);

    await prisma.product.upsert({
      where: { sku: parsed.data.sku },
      update: {
        name: parsed.data.name,
        slug: savedSlug,
        categoryId: category.id,
        brand: parsed.data.brand,
        price: parsed.data.price,
        salePrice: parsed.data.salePrice || null,
        stock: parsed.data.stock,
        images: [imagePath],
        description: parsed.data.description,
        fullDescription: parsed.data.fullDescription,
        size: splitList(parsed.data.sizes),
        color: splitList(parsed.data.colors),
        variations: [],
        specs: {},
        modality: parsed.data.modality,
        active: true,
      },
      create: {
        name: parsed.data.name,
        slug: savedSlug,
        sku: parsed.data.sku,
        categoryId: category.id,
        brand: parsed.data.brand,
        price: parsed.data.price,
        salePrice: parsed.data.salePrice || null,
        stock: parsed.data.stock,
        images: [imagePath],
        description: parsed.data.description,
        fullDescription: parsed.data.fullDescription,
        size: splitList(parsed.data.sizes),
        color: splitList(parsed.data.colors),
        variations: [],
        specs: {},
        modality: parsed.data.modality,
      },
    });
  } catch (error) {
    redirectDatabaseError(path, error);
  }

  revalidatePath("/admin/produtos");
  revalidatePath("/");
  revalidatePath("/produtos");
  revalidatePath(`/produtos/${savedSlug}`);
  if (savedCategorySlug) {
    revalidatePath(`/categoria/${savedCategorySlug}`);
  }
  revalidatePath("/sitemap.xml");
  redirect(`${path}?sucesso=salvo`);
}

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdmin();
  const path = "/admin/pedidos";
  ensureDatabase(path);

  const id = z.string().min(1).safeParse(formData.get("id"));
  const status = z
    .enum(["AWAITING_PAYMENT", "PAID", "PICKING", "SHIPPED", "DELIVERED", "CANCELED"])
    .safeParse(formData.get("status"));

  if (!id.success || !status.success) {
    redirectInvalid(path);
  }

  try {
    const prisma = getPrisma();
    await prisma.order.update({
      where: { id: id.data },
      data: { status: status.data },
    });
  } catch (error) {
    redirectDatabaseError(path, error);
  }

  revalidatePath("/admin/pedidos");
  redirect(`${path}?sucesso=status`);
}

export async function createCouponAction(formData: FormData) {
  await requireAdmin();
  const path = "/admin/cupons";
  ensureDatabase(path);

  const parsed = couponSchema.safeParse({
    code: formData.get("code"),
    discountPct: formData.get("discountPct") || undefined,
    minOrderValue: formData.get("minOrderValue") || undefined,
  });

  if (!parsed.success) {
    redirectInvalid(path);
  }

  try {
    const prisma = getPrisma();
    await prisma.coupon.upsert({
      where: { code: parsed.data.code.toUpperCase() },
      update: {
        discountPct: parsed.data.discountPct || null,
        minOrderValue: parsed.data.minOrderValue || null,
        active: true,
      },
      create: {
        code: parsed.data.code.toUpperCase(),
        description: `Cupom ${parsed.data.code.toUpperCase()}`,
        discountPct: parsed.data.discountPct || null,
        minOrderValue: parsed.data.minOrderValue || null,
        active: true,
      },
    });
  } catch (error) {
    redirectDatabaseError(path, error);
  }

  revalidatePath("/admin/cupons");
  redirect(`${path}?sucesso=salvo`);
}

export async function createBannerAction(formData: FormData) {
  await requireAdmin();
  const path = "/admin/banners";
  ensureDatabase(path);

  const parsed = bannerSchema.safeParse({
    title: formData.get("title"),
    subtitle: formData.get("subtitle") || undefined,
    link: formData.get("link") || undefined,
  });

  if (!parsed.success) {
    redirectInvalid(path);
  }

  const imagePath = await tryReadUploadedImage(path, formData.get("imageFile"));

  if (!imagePath) {
    redirectInvalid(path);
  }

  try {
    const prisma = getPrisma();
    await prisma.banner.create({
      data: {
        title: parsed.data.title,
        subtitle: parsed.data.subtitle,
        image: imagePath,
        link: parsed.data.link,
      },
    });
  } catch (error) {
    redirectDatabaseError(path, error);
  }

  revalidatePath("/admin/banners");
  revalidatePath("/");
  redirect(`${path}?sucesso=salvo`);
}
