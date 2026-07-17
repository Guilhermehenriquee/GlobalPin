"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { loginSchema, registerSchema } from "@/lib/validations";

function safeCallbackUrl(value: FormDataEntryValue | null) {
  const fallback = "/minha-conta";

  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}

function getAdminEmail() {
  return process.env.ADMIN_EMAIL?.trim().toLowerCase() || "admin@titanor.com.br";
}

function isAdminIdentifier(value: string) {
  const identifier = value.trim().toLowerCase();
  return identifier === "admin" || identifier === getAdminEmail();
}

function normalizeLoginEmail(value: string) {
  return isAdminIdentifier(value) ? getAdminEmail() : value.trim().toLowerCase();
}

function adminCallbackUrl(callbackUrl: string) {
  return callbackUrl === "/minha-conta" ? "/admin" : callbackUrl;
}

async function tryEnvironmentAdminLogin(identifier: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!adminEmail || !adminPassword) {
    return false;
  }

  if (!isAdminIdentifier(identifier) || password.trim() !== adminPassword) {
    return false;
  }

  await createSession({
    id: "env-admin",
    name: "Admin TITANOR",
    email: adminEmail,
    role: "ADMIN",
  });

  return true;
}

function hasEnvironmentAdmin() {
  return Boolean(process.env.ADMIN_EMAIL?.trim() && process.env.ADMIN_PASSWORD?.trim());
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  const callbackUrl = safeCallbackUrl(formData.get("callbackUrl"));

  if (!parsed.success) {
    redirect("/login?erro=dados-invalidos");
  }

  const loginEmail = normalizeLoginEmail(parsed.data.email);
  const isAdminLogin = isAdminIdentifier(parsed.data.email);

  if (await tryEnvironmentAdminLogin(parsed.data.email, parsed.data.password)) {
    redirect(adminCallbackUrl(callbackUrl));
  }

  if (hasEnvironmentAdmin() && isAdminLogin) {
    redirect("/login?erro=credenciais");
  }

  if (!process.env.DATABASE_URL) {
    redirect("/login?erro=configuracao");
  }

  let user;

  try {
    const prisma = getPrisma();
    user = await prisma.user.findUnique({
      where: { email: loginEmail },
    });
  } catch (error) {
    console.error("TITANOR login database error", error);
    redirect("/login?erro=configuracao");
  }

  if (!user) {
    redirect("/login?erro=credenciais");
  }

  const passwordMatches = await bcrypt.compare(parsed.data.password, user.passwordHash);

  if (!passwordMatches) {
    redirect("/login?erro=credenciais");
  }

  await createSession({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  redirect(user.role === "ADMIN" ? adminCallbackUrl(callbackUrl) : callbackUrl);
}

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    lgpdConsent: formData.get("lgpdConsent") === "on",
  });

  if (!parsed.success || !parsed.data.lgpdConsent) {
    redirect("/cadastro?erro=dados-invalidos");
  }

  if (!process.env.DATABASE_URL) {
    redirect("/cadastro?erro=configuracao");
  }

  const prisma = getPrisma();
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  try {
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
        lgpdConsentAt: new Date(),
      },
    });

    await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("TITANOR register database error", error);
    const code = typeof error === "object" && error && "code" in error ? error.code : undefined;
    redirect(code === "P2002" ? "/cadastro?erro=email-existente" : "/cadastro?erro=configuracao");
  }

  redirect("/minha-conta");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}
