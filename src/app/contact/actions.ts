"use server";

import type { ContactFormData } from "@fourplusweb/ui";

// Placeholder submit handler — Phase 10 ще го замени с Resend API call.
export async function submitContactPlaceholder(data: ContactFormData): Promise<void> {
  console.log("[contact] submission received", data);
}
