"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Copies `code` to the clipboard with a safe fallback for browsers/contexts
// where the async Clipboard API is unavailable (older Safari, non-HTTPS,
// permission denial). Never throws — worst case, the user sees a manual
// copy prompt instead of a broken button.
export function CopyCodeButton({
  code,
  onCopy,
  className,
}: {
  code: string;
  onCopy?: () => void;
  className?: string;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  async function handleCopy() {
    let copied = false;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
        copied = true;
      }
    } catch {
      copied = false;
    }

    if (!copied) {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = code;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        copied = document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch {
        copied = false;
      }
    }

    setStatus(copied ? "copied" : "error");
    if (copied) onCopy?.();
    window.setTimeout(() => setStatus("idle"), copied ? 2500 : 4000);
  }

  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      <Button type="button" variant="orange" onClick={handleCopy}>
        {status === "copied" ? (
          <Check className="size-4" aria-hidden="true" />
        ) : (
          <Copy className="size-4" aria-hidden="true" />
        )}
        {status === "copied" ? "Code copied" : `Copy Code: ${code}`}
      </Button>
      <p role="status" aria-live="polite" className="min-h-5 text-sm text-charcoal/60">
        {status === "copied" && "Code copied to your clipboard."}
        {status === "error" &&
          `Couldn't copy automatically — please copy manually: ${code}`}
      </p>
    </div>
  );
}
