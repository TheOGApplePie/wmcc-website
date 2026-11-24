"use client";

import { useEffect, useId, useRef, useState } from "react";
import { checkBeforeSubmit, deliverRegistration } from "../lib/registration-client";

type CognitoFormProps = { formId: string; eventId?: number };
type CognitoEvent = { preventDefault(): void; data: { entry: unknown } };
type CognitoApi = (key: string) => { mount(form: string, selector: string): { on(type: string, handler: (event: CognitoEvent) => Promise<void>): void } };
declare global { interface Window { Cognito?: CognitoApi } }

let scriptPromise: Promise<void> | undefined;
function loadCognito() {
  if (window.Cognito) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://www.cognitoforms.com/f/seamless.js";
      script.onload = () => resolve();
      script.onerror = () => { script.remove(); scriptPromise = undefined; reject(new Error("Cognito unavailable")); };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

export default function CognitoForm({ formId, eventId }: CognitoFormProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const id = `cognito-${useId().replace(/:/g, "")}`;
  const [message, setMessage] = useState("");
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let active = true;
    // Preserve the provider's existing automatic embed for non-event forms.
    if (eventId === undefined) {
      const script = document.createElement("script");
      script.src = "https://www.cognitoforms.com/f/seamless.js";
      script.dataset.key = "QJD3GMUmOUmpeqIApCdhlA";
      script.dataset.form = formId;
      container.appendChild(script);
    } else {
      loadCognito().then(() => {
        if (!active) return;
        if (!window.Cognito) throw new Error("Cognito unavailable");
        const form = window.Cognito("QJD3GMUmOUmpeqIApCdhlA").mount(formId, `#${id}`);
        form.on("beforeSubmit", async event => {
          if (!active) { event.preventDefault(); return; }
          await checkBeforeSubmit(event, eventId, text => { if (active) setMessage(text); });
          if (!active) event.preventDefault();
        });
        form.on("afterSubmit", async event => {
          if (!active) return;
          await deliverRegistration(eventId, formId, event.data.entry, text => { if (active) setMessage(text); });
        });
      }).catch(() => { if (active) setMessage("The registration form could not be loaded. Please try again later."); });
    }
    return () => { active = false; container.replaceChildren(); };
  }, [formId, eventId, id]);
  return <><p role="alert">{message}</p><div id={id} ref={containerRef} className="cognito-form" /></>;
}
