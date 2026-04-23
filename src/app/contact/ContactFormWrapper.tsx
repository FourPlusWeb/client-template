"use client";

import { useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { ContactForm, type ContactFormData } from "@fourplusweb/ui";
import { submitContact } from "./actions";
import { siteConfig } from "../../../site.config";

type SubmitStatus =
  | { kind: "idle" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export function ContactFormWrapper() {
  const [status, setStatus] = useState<SubmitStatus>({ kind: "idle" });
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const config = siteConfig as { captcha?: { siteKey: string } };
  const captchaKey = config.captcha?.siteKey;

  async function handleSubmit(data: ContactFormData) {
    setStatus({ kind: "idle" });
    const result = await submitContact({ ...data, captchaToken });
    if (result.status === "error") {
      setStatus({ kind: "error", message: result.error });
      throw new Error(result.error);
    }
    setStatus({ kind: "success" });
    setCaptchaToken("");
  }

  return (
    <div>
      <ContactForm onSubmit={handleSubmit} />
      {captchaKey ? (
        <div className="mt-4">
          <HCaptcha
            sitekey={captchaKey}
            onVerify={(token) => setCaptchaToken(token)}
            onExpire={() => setCaptchaToken("")}
          />
        </div>
      ) : null}
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