import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Informe seu nome completo."),
  email: z.string().email("E-mail invalido.").toLowerCase(),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
  lgpdConsent: z.coerce.boolean(),
});

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Informe e-mail ou admin.").toLowerCase(),
  password: z.string().min(1, "Informe sua senha."),
});

export const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        price: z.number().positive(),
        quantity: z.number().int().positive(),
        size: z.string().optional(),
        color: z.string().optional(),
      }),
    )
    .min(1),
  customer: z.object({
    name: z.string().min(3),
    email: z.string().email(),
    document: z.string().min(11),
    phone: z.string().min(10),
  }),
  address: z.object({
    zipCode: z.string().min(8),
    street: z.string().min(3),
    number: z.string().min(1),
    district: z.string().min(2),
    city: z.string().min(2),
    state: z.string().length(2),
  }),
  shippingMethod: z.enum(["standard", "express"]),
  paymentMethod: z.enum(["pix", "card", "boleto"]),
  coupon: z.string().optional(),
});
