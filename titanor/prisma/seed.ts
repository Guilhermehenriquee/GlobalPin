import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";
import { banners, categories, coupons, products } from "../src/lib/catalog";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@titanor.com.br";
  const adminPasswordPlain = process.env.ADMIN_PASSWORD || "Titanor@2026";
  const adminPassword = await bcrypt.hash(adminPasswordPlain, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Admin TITANOR",
      passwordHash: adminPassword,
      role: Role.ADMIN,
      lgpdConsentAt: new Date(),
    },
    create: {
      name: "Admin TITANOR",
      email: adminEmail,
      passwordHash: adminPassword,
      role: Role.ADMIN,
      lgpdConsentAt: new Date(),
    },
  });

  const categoryMap = new Map<string, string>();

  for (const category of categories) {
    const saved = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        image: category.image,
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
      },
    });

    categoryMap.set(category.slug, saved.id);
  }

  for (const product of products) {
    const categoryId = categoryMap.get(product.categorySlug);

    if (!categoryId) {
      continue;
    }

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        fullDescription: product.fullDescription,
        price: product.price,
        salePrice: product.salePrice,
        images: product.images,
        stock: product.stock,
        sku: product.sku,
        brand: product.brand,
        size: product.size,
        color: product.color,
        variations: product.variations,
        rating: product.rating,
        featured: product.featured || false,
        bestSeller: product.bestSeller || false,
        promotion: product.promotion || false,
        specs: product.specs,
        modality: product.modality,
        categoryId,
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        fullDescription: product.fullDescription,
        price: product.price,
        salePrice: product.salePrice,
        images: product.images,
        stock: product.stock,
        sku: product.sku,
        brand: product.brand,
        size: product.size,
        color: product.color,
        variations: product.variations,
        rating: product.rating,
        featured: product.featured || false,
        bestSeller: product.bestSeller || false,
        promotion: product.promotion || false,
        specs: product.specs,
        modality: product.modality,
        categoryId,
      },
    });
  }

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {
        discountPct: coupon.discountPercent,
        minOrderValue: coupon.minOrderValue,
        active: coupon.active,
      },
      create: {
        code: coupon.code,
        description: `Cupom inicial ${coupon.code}`,
        discountPct: coupon.discountPercent,
        minOrderValue: coupon.minOrderValue,
        active: coupon.active,
      },
    });
  }

  for (const [position, banner] of banners.entries()) {
    await prisma.banner.upsert({
      where: { id: `seed-banner-${position}` },
      update: {
        title: banner.title,
        subtitle: banner.subtitle,
        image: banner.image,
        position,
      },
      create: {
        id: `seed-banner-${position}`,
        title: banner.title,
        subtitle: banner.subtitle,
        image: banner.image,
        position,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
