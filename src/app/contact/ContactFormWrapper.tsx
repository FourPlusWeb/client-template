"use client";

import { useState } from "react";
import { ContactForm, type ContactFormData } from "@fourplusweb/ui";
import { submitContact } from "./actions";

type SubmitStatus =
  | { kind: "idle" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export function ContactFormWrapper() {
  const [status, setStatus] = useState<SubmitStatus>({ kind: "idle" });

  async function handleSubmit(data: ContactFormData) {
    setStatus({ kind: "idle" });
    const result = await submitContact(data);
    if (result.status === "error") {
      setStatus({ kind: "error", message: result.error });
      // Throwing keeps the form filled (react-hook-form does not reset on
      // a rejected onSubmit), so the user can retry without retyping.
      throw new Error(result.error);
    }
    setStatus({ kind: "success" });
  }

  return (
    <div>
      <ContactForm onSubmit={handleSubmit} />
      {status.kind === "success" ? (
        <p
          role="status"
          className="mt-4 text-body text-[color:var(--color-primary)]"
        >
          Благодарим! Получихме съобщението ви и ще се свържем в рамките на
          един работен ден.
        </p>
      ) : null}
      {status.kind === "error" ? (
        <p role="alert" className="mt-4 text-body text-red-600">
          {status.message}
        </p>
      ) : null}
    </div>
  );
}
