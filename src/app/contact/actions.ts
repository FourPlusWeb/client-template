"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { ContactFormData } from "@fourplusweb/ui";
import { siteConfig } from "../../../site.config";
import { ContactFormNotification } from "../../emails/ContactFormNotification";

const ContactSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email().max(254),
  phone: z.string().max(30).optional().or(z.literal("")),
  message: z.string().min(10).max(5000),
  website: z.string().max(0).optional().or(z.literal("")),
  captchaToken: z.string().optional(),
});

export type ContactFormResult =
  | { status: "success" }
  | { status: "error"; error: string };

const ratelimit = new Ratelimit({
  redis: new Redis({
    url: process.env.UPSTASH_REST_API_URL ?? "",
    token: process.env.UPSTASH_REST_API_TOKEN ?? "",
  }),
  limiter: Ratelimit.fixedWindow(3, "5 m"),
  analytics: false,
  prefix: "contact-form",
});

function maskEmail(value: string): string {
  return value.replace(/(.{2}).*(@.*)/, "$1***$2");
}

async function verifyCaptcha(token: string): Promise<boolean> {
  const config = siteConfig as {
    captcha?: { provider: "hcaptcha" | "turnstile"; siteKey: string; secret: string };
  };
  const captcha = config.captcha;
  if (!captcha?.secret || !captcha?.siteKey) {
    console.warn("[contact] captcha misconfigured, skipping verification");
    return true;
  }

  const endpoint =
    captcha.provider === "hcaptcha"
      ? "https://hcaptcha.com/siteverify"
      : "https://challenges.cloudflare.com/turnstile/v0/siteverify";

  try {
    const params = new URLSearchParams({
      secret: captcha.secret,
      response: token,
    });

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const data = await response.json();
    return captcha.provider === "hcaptcha"
      ? (data as { success: boolean }).success
      : (data as { success: boolean }).success;
  } catch {
    return false;
  }
}

export async function submitContact(
  data: ContactFormData & { captchaToken?: string },
): Promise<ContactFormResult> {
  const parsed = ContactSchema.safeParse(data);
  if (!parsed.success) {
    return {
      status: "error",
      error: "Неправилни данни. Моля проверете полетата.",
    };
  }

  if (parsed.data.website && parsed.data.website.length > 0) {
    return { status: "success" };
  }

  const siteConfigTyped = siteConfig as {
    captcha?: { provider: "hcaptcha" | "turnstile"; siteKey: string; secret: string };
  };
  if (siteConfigTyped.captcha) {
    const token = parsed.data.captchaToken;
    if (!token) {
      return {
        status: "error",
        error: "Captcha validation failed. Please try again.",
      };
    }
    const valid = await verifyCaptcha(token);
    if (!valid) {
      return {
        status: "error",
        error: "Captcha validation failed. Please try again.",
      };
    }
  }

  const hdrs = await headers();
  const ip =
    hdrs.get("x-nf-client-connection-ip") ??
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  if (process.env.UPSTASH_REST_API_URL && process.env.UPSTASH_REST_API_TOKEN) {
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return {
        status: "error",
        error:
          "Твърде много заявки. Моля, опитайте отново след няколко минути.",
      };
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      console.error("[contact] RESEND_API_KEY missing in production");
      return {
        status: "error",
        error: `Формата временно не работи. Моля, напишете директно на ${siteConfig.contact.email}`,
      };
    }
    console.log("[contact] DEV: RESEND_API_KEY missing, skipping real send.", {
      name: parsed.data.name,
      email: maskEmail(parsed.data.email),
      ip: ip.slice(0, 8) + "…",
      messageChars: parsed.data.message.length,
    });
    return { status: "success" };
  }

  const domain = siteConfig.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const notifyEmail =
    process.env.RESEND_NOTIFY_EMAIL ?? siteConfig.contact.email;
  const fromEmail = process.env.RESEND_FROM ?? `noreply@${domain}`;

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: `${siteConfig.name} <${fromEmail}>`,
      to: notifyEmail,
      replyTo: parsed.data.email,
      subject: `Ново запитване от ${parsed.data.name}`,
      react: ContactFormNotification({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || undefined,
        message: parsed.data.message,
        submittedAt: new Date().toLocaleString("bg-BG"),
        siteUrl: siteConfig.url,
        siteName: siteConfig.name,
      }),
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return {
        status: "error",
        error: `Изпращането не успя. Опитайте отново или ни пишете на ${siteConfig.contact.email}`,
      };
    }

    console.log("[contact] sent", {
      from: maskEmail(parsed.data.email),
      ip: ip.slice(0, 8) + "…",
      messageChars: parsed.data.message.length,
    });

    return { status: "success" };
  } catch (err) {
    console.error("[contact] unexpected error:", err);
    return {
      status: "error",
      error: "Вътрешна грешка. Моля, опитайте по-късно.",
    };
  }
}
