"use client";

import { useEffect, useRef } from "react";

import { HONEYPOT_FIELD, RENDERED_AT_FIELD } from "@/lib/spam-guard";

// Drop into any FormData-based form (inside the <form>, anywhere) to give
// the API route's isBotSubmission() check something to look at. Real users
// never see or interact with either field — see src/lib/spam-guard.ts for
// how they're used server-side. The timestamp is set imperatively in an
// effect (not read from a ref or computed during render) to keep the
// component's render pure.
export function HoneypotField() {
  const renderedAtInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renderedAtInputRef.current) {
      renderedAtInputRef.current.value = String(Date.now());
    }
  }, []);

  return (
    <>
      <div
        style={{ position: "absolute", left: "-9999px", top: 0, width: 1, height: 1, overflow: "hidden" }}
        aria-hidden="true"
      >
        <label htmlFor={HONEYPOT_FIELD}>Leave this field blank</label>
        <input type="text" id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name={RENDERED_AT_FIELD} ref={renderedAtInputRef} readOnly />
    </>
  );
}
