import { banners as seedBanners, categories as seedCategories, coupons as seedCoupons, products as seedProducts, recentOrders } from "./catalog";
import { getPrisma } from "./prisma";

export const prismaOrderStatuses = [
  { value: "AWAITING_PAYMENT", label: "aguardando pagamento" },
  { value: "PAID", label: "pago" },
  { value: "PICKING", label: "em separacao" },
  { value: "SHIPPED", label: "enviado" },
  { value: "DELIVERED", label: "entregue" },
  { value: "CANCELED", label: "cancelado" },
] as const;

export type PrismaOrderStatusValue = (typeof prismaOrderStatuses)[number]["value"];

export type AdminProductRow = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId?: string;
  category: string;
  brand: string;
  stock: number;
  price: number;
  salePrice?: number | null;
  active: boolean;
};

export type AdminCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  active: boolean;
};

export type AdminOrderRow = {
  id: string;
  number: string;
  customer: string;
  total: number;
  status: string;
  statusLabel: string;
  createdAt: string;
};

export type AdminCouponRow = {
  id: string;
  code: string;
  discountPct?: number | null;
  discountValue?: number | null;
  minOrderValue?: number | null;
  active: boolean;
};

export type AdminCustomerRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export type AdminBannerRow = {
  id: string;
  title: string;
  subtitle?: string | null;
  image: string;
  link?: string | null;
  active: boolean;
};

export type CustomerOrderRow = {
  id: string;
  number: string;
  total: number;
  statusLabel: string;
  createdAt: string;
  trackingCode?: string | null;
};

function labelForStatus(status: string) {
  return prismaOrderStatuses.find((item) => item.value === status)?.label || status.toLowerCase();
}

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

export async function getAdminProducts(): Promise<AdminProductRow[]> {
  if (!hasDatabaseUrl()) {
    return seedProducts.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      category: product.category,
      brand: product.brand,
      stock: product.stock,
      price: product.price,
      salePrice: product.salePrice,
      active: true,
    }));
  }

  try {
    const prisma = getPrisma();
    const rows = await prisma.product.findMany({
      include: { category: true },
      orderBy: { updatedAt: "desc" },
    });

    return rows.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      categoryId: product.categoryId,
      category: product.category.name,
      brand: product.brand,
      stock: product.stock,
      price: Number(product.price),
      salePrice: product.salePrice ? Number(product.salePrice) : null,
      active: product.active,
    }));
  } catch {
    return seedProducts.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      category: product.category,
      brand: product.brand,
      stock: product.stock,
      price: product.price,
      salePrice: product.salePrice,
      active: true,
    }));
  }
}

export async function getAdminCategories(): Promise<AdminCategoryRow[]> {
  if (!hasDatabaseUrl()) {
    return seedCategories.map((category) => ({
      id: category.slug,
      name: category.name,
      slug: category.slug,
      description: category.description,
      active: true,
    }));
  }

  try {
    const prisma = getPrisma();
    const rows = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    if (rows.length === 0) {
      return seedCategories.map((category) => ({
        id: category.slug,
        name: category.name,
        slug: category.slug,
        description: category.description,
        active: true,
      }));
    }

    return rows.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      active: category.active,
    }));
  } catch {
    return seedCategories.map((category) => ({
      id: category.slug,
      name: category.name,
      slug: category.slug,
      description: category.description,
      active: true,
    }));
  }
}

export async function getAdminOrders(): Promise<AdminOrderRow[]> {
  if (!hasDatabaseUrl()) {
    return recentOrders.map((order) => ({
      id: order.id,
      number: order.id,
      customer: order.customer,
      total: order.total,
      status: order.status,
      statusLabel: order.status,
      createdAt: order.date,
    }));
  }

  try {
    const prisma = getPrisma();
    const rows = await prisma.order.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return rows.map((order) => ({
      id: order.id,
      number: order.number,
      customer: order.user?.name || String((order.customerSnapshot as { name?: string })?.name || "Cliente"),
      total: Number(order.total),
      status: order.status,
      statusLabel: labelForStatus(order.status),
      createdAt: order.createdAt.toLocaleDateString("pt-BR"),
    }));
  } catch {
    return recentOrders.map((order) => ({
      id: order.id,
      number: order.id,
      customer: order.customer,
      total: order.total,
      status: order.status,
      statusLabel: order.status,
      createdAt: order.date,
    }));
  }
}

export async function getCustomerOrders(userId: string): Promise<CustomerOrderRow[]> {
  if (!hasDatabaseUrl()) {
    return recentOrders.map((order) => ({
      id: order.id,
      number: order.id,
      total: order.total,
      statusLabel: order.status,
      createdAt: order.date,
    }));
  }

  try {
    const prisma = getPrisma();
    const rows = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return rows.map((order) => ({
      id: order.id,
      number: order.number,
      total: Number(order.total),
      statusLabel: labelForStatus(order.status),
      createdAt: order.createdAt.toLocaleDateString("pt-BR"),
      trackingCode: order.trackingCode,
    }));
  } catch {
    return recentOrders.map((order) => ({
      id: order.id,
      number: order.id,
      total: order.total,
      statusLabel: order.status,
      createdAt: order.date,
    }));
  }
}

export async function getAdminCoupons(): Promise<AdminCouponRow[]> {
  if (!hasDatabaseUrl()) {
    return seedCoupons.map((coupon) => ({
      id: coupon.code,
      code: coupon.code,
      discountPct: coupon.discountPercent,
      minOrderValue: coupon.minOrderValue,
      active: coupon.active,
    }));
  }

  try {
    const prisma = getPrisma();
    const rows = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });

    return rows.map((coupon) => ({
      id: coupon.id,
      code: coupon.code,
      discountPct: coupon.discountPct,
      discountValue: coupon.discountValue ? Number(coupon.discountValue) : null,
      minOrderValue: coupon.minOrderValue ? Number(coupon.minOrderValue) : null,
      active: coupon.active,
    }));
  } catch {
    return seedCoupons.map((coupon) => ({
      id: coupon.code,
      code: coupon.code,
      discountPct: coupon.discountPercent,
      minOrderValue: coupon.minOrderValue,
      active: coupon.active,
    }));
  }
}

export async function getAdminCustomers(): Promise<AdminCustomerRow[]> {
  if (!hasDatabaseUrl()) {
    return [
      {
        id: "seed-admin",
        name: "Admin TITANOR",
        email: "admin@titanor.com.br",
        role: "ADMIN",
        createdAt: "Seed",
      },
    ];
  }

  try {
    const prisma = getPrisma();
    const rows = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return rows.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toLocaleDateString("pt-BR"),
    }));
  } catch {
    return [
      {
        id: "seed-admin",
        name: "Admin TITANOR",
        email: "admin@titanor.com.br",
        role: "ADMIN",
        createdAt: "Seed",
      },
    ];
  }
}

export async function getAdminBanners(): Promise<AdminBannerRow[]> {
  if (!hasDatabaseUrl()) {
    return seedBanners.map((banner, index) => ({
      id: `seed-banner-${index}`,
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image,
      active: true,
    }));
  }

  try {
    const prisma = getPrisma();
    const rows = await prisma.banner.findMany({
      orderBy: { position: "asc" },
    });

    return rows.map((banner) => ({
      id: banner.id,
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image,
      link: banner.link,
      active: banner.active,
    }));
  } catch {
    return seedBanners.map((banner, index) => ({
      id: `seed-banner-${index}`,
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image,
      active: true,
    }));
  }
}
