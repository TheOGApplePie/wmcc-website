"use client";

import { useEffect, useRef, useState } from "react";

const formPath = "/embed/donation-form/donate-to-support-our-community-centre";
const formUrl = `https://www.zeffy.com${formPath}`;

function FallbackForm() {
  return (
    <iframe
      title="Donation form powered by Zeffy"
      src={formUrl}
      className="w-full h-[600px] border-0"
      allow="payment"
    />
  );
}

export default function ZeffyDonation({ nonce }: Readonly<{ nonce: string }>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const script = document.createElement("script");
    script.src = "https://www.zeffy.com/embed/v2/zeffy-embed.js";
    script.nonce = nonce;
    script.onerror = () => setFailed(true);
    container.appendChild(script);
    return () => {
      script.onerror = null;
      script.remove();
    };
  }, [nonce]);

  return (
    <div className="w-full max-w-3xl" ref={containerRef}>
      {!failed && <div data-zeffy-embed="" data-form-url={formPath} />}
      {failed && <FallbackForm />}
      <noscript><FallbackForm /></noscript>
      <p className="mt-4 text-center">
        <a className="underline underline-offset-4" href="https://www.zeffy.com/en-CA/donation-form/donate-to-support-our-community-centre">
          Open the donation form on Zeffy
        </a>
      </p>
    </div>
  );
}
