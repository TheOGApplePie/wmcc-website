"use client";

import { useEffect, useRef } from "react";

type CognitoFormProps = {
  formId: string;
};

export default function CognitoForm({ formId }: CognitoFormProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const script = document.createElement("script");
    script.src = "https://www.cognitoforms.com/f/seamless.js";
    script.dataset.key = "QJD3GMUmOUmpeqIApCdhlA";
    script.dataset.form = formId;
    container.appendChild(script);
    return () => container.replaceChildren();
  }, [formId]);

  return <div ref={containerRef} className="cognito-form" />;
}
