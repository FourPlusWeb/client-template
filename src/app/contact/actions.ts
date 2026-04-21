"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import type { ContactFormData } from "@fourplusweb/ui";
import { siteConfig } from "../../../site.config";
import { ContactFormNotification } from "../../emails/ContactFormNotification";

// Re-declare the schema server-side. The @fourplusweb/ui ContactForm
// already validates client-side, but any direct POST bypasses that.
// Keep limits mirrored with the ui package.
const ContactSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email().max(254),
  phone: z.string().max(30).optional().or(z.literal("")),
  message: z.string().min(10).max(5000),
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactFormResult =
  | { status: "success" }
  | { status: "error"; error: string };

// Per-process, per-IP counter. Resets on cold start; fine for SMB volume
// combined with honeypot + Zod revalidation. Upgrade to a shared store
// (Upstash/Redis) if we ever scale beyond a single function instance.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX = 3;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count += 1;
  return true;
}

function maskEmail(value: string): string {
  return value.replace(/(.{2}).*(@.*)/, "$1***$2");
}

export async function submitContact(
  data: ContactFormData,
): Promise<ContactFormResult> {
  const parsed = ContactSchema.safeParse(data);
  if (!parsed.success) {
    return {
      status: "error",
      error: "Неправилни данни. Моля проверете полетата.",
    };
  }

  // Honeypot: silent-success on non-empty website field. Bot doesn't
  // learn the trap exists.
  if (parsed.data.website && parsed.data.website.length > 0) {
    return { status: "success" };
  }

  const hdrs = await headers();
  const ip =
    hdrs.get("x-nf-client-connection-ip") ??
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return {
      status: "error",
      error:
        "Твърде много заявки. Моля, опитайте отново след няколко минути.",
    };
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

    // Metadata-only log — never log the message body (GDPR: minimize
    // logged personal data).
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
