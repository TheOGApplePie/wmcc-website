"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { usesCognitoPolicy } from "../lib/cognito-policy";

export default function CspNavigationBoundary({
  allowsCognito,
  children,
}: Readonly<{ allowsCognito: boolean; children: ReactNode }>) {
  // A client-side navigation cannot change the CSP of the current document.
  const documentPolicy = useRef(allowsCognito);
  const pathname = usePathname();
  const needsNewDocument = usesCognitoPolicy(pathname) !== documentPolicy.current;

  useEffect(() => {
    if (needsNewDocument) window.location.reload();
  }, [needsNewDocument]);

  return needsNewDocument ? null : children;
}
