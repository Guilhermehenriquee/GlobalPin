import { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
import type { z } from "zod";
import { NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/validations";
import { getStripe } from "@/lib/stripe";
import { getAppUrl } from "@/lib/utils";
import { getSession } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

type CheckoutPayload = z.infer<typeof checkoutSchema>;

type CanonicalCheckoutItem = {
  productId: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
};

type CheckoutState = {
  items: CanonicalCheckoutItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
};

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

function makeOrderNumber() {
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TNR-${Date.now().toString().slice(-8)}-${suffix}`;
}

function toPaymentMethod(method: CheckoutPayload["paymentMethod"]) {
  if (method === "card") {
    return PaymentMethod.CARD;
  }

  if (method === "boleto") {
    return PaymentMethod.BOLETO;
  }

  return PaymentMethod.PIX;
}

function calculateTotals(items: CanonicalCheckoutItem[], shippingMethod: CheckoutPayload["shippingMethod"], coupon?: string): Omit<CheckoutState, "items"> {
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const discount = coupon?.trim().toUpperCase() === "FORJA10" && subtotal >= 199 ? subtotal * 0.1 : 0;
  const shipping = subtotal >= 399 ? 0 : shippingMethod === "express" ? 49.9 : 29.9;
  const total = Math.max(subtotal - discount + shipping, 0);

  return { subtotal, discount, shipping, total };
}

async function resolveCheckoutItems(items: CheckoutPayload["items"]) {
  if (!hasDatabaseUrl()) {
    return items.map((item) => ({
      productId: item.id,
      name: item.name,
      slug: item.slug,
      sku: item.slug,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }));
  }

  const prisma = getPrisma();
  const products = await prisma.product.findMany({
    where: {
      active: true,
      OR: [{ id: { in: items.map((item) => item.id) } }, { slug: { in: items.map((item) => item.slug) } }],
    },
    select: {
      id: true,
      slug: true,
      name: true,
      sku: true,
      price: true,
      salePrice: true,
      stock: true,
    },
  });

  const byId = new Map(products.map((product) => [product.id, product]));
  const bySlug = new Map(products.map((product) => [product.slug, product]));

  return items.map((item) => {
    const product = byId.get(item.id) || bySlug.get(item.slug);

    if (!product || product.stock < item.quantity) {
      throw new Error("PRODUCT_UNAVAILABLE");
    }

    return {
      productId: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      price: Number(product.salePrice || product.price),
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    };
  });
}

async function buildCheckoutState(data: CheckoutPayload): Promise<CheckoutState> {
  const items = await resolveCheckoutItems(data.items);
  const totals = calculateTotals(items, data.shippingMethod, data.coupon);

  return { items, ...totals };
}

async function createPersistedOrder(
  data: CheckoutPayload,
  state: CheckoutState,
  options: {
    provider: string;
    providerRef?: string;
    pixCopyPaste?: string;
    paid?: boolean;
  },
) {
  if (!hasDatabaseUrl()) {
    return null;
  }

  const prisma = getPrisma();
  const session = await getSession();
  const user =
    session?.id && session.id !== "env-admin"
      ? await prisma.user.findUnique({
          where: { id: session.id },
          select: { id: true },
        })
      : null;
  const couponCode = data.coupon?.trim().toUpperCase();
  const coupon = couponCode
    ? await prisma.coupon.findUnique({
        where: { code: couponCode },
        select: { id: true },
      })
    : null;
  const number = makeOrderNumber();

  return prisma.order.create({
    data: {
      number,
      status: options.paid ? OrderStatus.PAID : OrderStatus.AWAITING_PAYMENT,
      subtotal: state.subtotal,
      discount: state.discount,
      shipping: state.shipping,
      total: state.total,
      shippingMethod: data.shippingMethod === "express" ? "Entrega expressa" : "Entrega padrao",
      customerSnapshot: data.customer,
      deliverySnapshot: data.address,
      userId: user?.id,
      couponId: coupon?.id,
      items: {
        create: state.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          sku: item.sku,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
      },
      payment: {
        create: {
          method: toPaymentMethod(data.paymentMethod),
          status: options.paid ? PaymentStatus.PAID : PaymentStatus.PENDING,
          provider: options.provider,
          providerRef: options.providerRef,
          pixQrCode: data.paymentMethod === "pix" ? options.pixCopyPaste : undefined,
          pixCopyPaste: data.paymentMethod === "pix" ? options.pixCopyPaste : undefined,
          amount: state.total,
          paidAt: options.paid ? new Date() : undefined,
        },
      },
    },
  });
}

export async function POST(request: Request) {
  const body = await request.text();
  let json: unknown;

  try {
    json = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "JSON invalido." }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dados de checkout invalidos." }, { status: 400 });
  }

  const data = parsed.data;
  const appUrl = getAppUrl();
  let state: CheckoutState;

  try {
    state = await buildCheckoutState(data);
  } catch (error) {
    console.error("TITANOR checkout item error", error);
    return NextResponse.json({ error: "Produto indisponivel ou estoque insuficiente." }, { status: 409 });
  }

  if (!process.env.STRIPE_SECRET_KEY || process.env.NEXT_PUBLIC_ENABLE_MOCK_PAYMENTS === "true") {
    const pixCopyPaste =
      "00020126580014br.gov.bcb.pix0136titanor-demo-pix-key520400005303986540" +
      state.total.toFixed(2).replace(".", "") +
      "5802BR5915TITANOR DEMO6009SAO PAULO62070503***6304ABCD";

    try {
      const order = await createPersistedOrder(data, state, {
        provider: "mock",
        pixCopyPaste,
        paid: data.paymentMethod === "card",
      });
      const orderNumber = order?.number || makeOrderNumber();

      return NextResponse.json({
        mode: "mock",
        orderNumber,
        pixCopyPaste: data.paymentMethod === "pix" ? pixCopyPaste : undefined,
        message:
          data.paymentMethod === "pix"
            ? "Pedido registrado. Escaneie o QR Code visual ou copie o codigo Pix de demonstracao."
            : "Pedido registrado em modo demonstracao.",
      });
    } catch (error) {
      console.error("TITANOR checkout database error", error);
      return NextResponse.json({ error: "Nao foi possivel registrar o pedido no banco." }, { status: 502 });
    }
  }

  try {
    const order = await createPersistedOrder(data, state, {
      provider: "stripe",
    });
    const stripe = getStripe();
    const discountMultiplier = state.subtotal > 0 ? (state.subtotal - state.discount) / state.subtotal : 1;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "pt-BR",
      customer_email: data.customer.email,
      line_items: [
        ...state.items.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: "brl",
            product_data: {
              name: item.name,
              metadata: {
                slug: item.slug,
                size: item.size || "",
                color: item.color || "",
              },
            },
            unit_amount: Math.round(item.price * discountMultiplier * 100),
          },
        })),
        ...(state.shipping > 0
          ? [
              {
                quantity: 1,
                price_data: {
                  currency: "brl",
                  product_data: {
                    name: data.shippingMethod === "express" ? "Frete expresso" : "Frete padrao",
                  },
                  unit_amount: Math.round(state.shipping * 100),
                },
              },
            ]
          : []),
      ],
      shipping_address_collection: {
        allowed_countries: ["BR"],
      },
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${appUrl}/meus-pedidos?checkout=sucesso`,
      cancel_url: `${appUrl}/checkout?checkout=cancelado`,
      metadata: {
        brand: "TITANOR",
        orderId: order?.id || "",
        orderNumber: order?.number || "",
        paymentMethod: data.paymentMethod,
        coupon: data.coupon || "",
        subtotal: state.subtotal.toFixed(2),
        discount: state.discount.toFixed(2),
        shipping: state.shipping.toFixed(2),
        deliveryZipCode: data.address.zipCode,
        deliveryCity: data.address.city,
        deliveryState: data.address.state,
        document: data.customer.document,
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Sessao de pagamento sem URL." }, { status: 500 });
    }

    if (order) {
      await getPrisma().payment.update({
        where: { orderId: order.id },
        data: { providerRef: session.id },
      });
    }

    return NextResponse.json({
      mode: "stripe",
      url: session.url,
    });
  } catch (error) {
    console.error("TITANOR checkout provider error", error);
    return NextResponse.json({ error: "Nao foi possivel iniciar o pagamento." }, { status: 502 });
  }
}
