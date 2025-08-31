"use client";
import { useEffect } from "react";

export default function MasjidboxWidget() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://masjidbox.com/widgets/loader.js";
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <a
        data-masjidbox-widget="6sWyjAptQu-_pEdxsZrtL"
        data-masjidbox-ifr
        href="https://masjidbox.com/prayer-times/wmcc"
      >
        Prayer Times WMCC (Waterdown Muslim Community Centre)
      </a>
    </div>
  );
}
