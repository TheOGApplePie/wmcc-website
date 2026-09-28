"use client";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";

export default function EventPoster({
  src,
  alt,
  ...props
}: Readonly<ImageProps>) {
  const [failedSource, setFailedSource] = useState<ImageProps["src"] | null>(
    null,
  );
  const fallback = !src || failedSource === src;
  return (
    <Image
      {...props}
      src={fallback ? "/wmcc-black.png" : src}
      alt={fallback ? "WMCC" : alt}
      onError={() => setFailedSource(src)}
    />
  );
}
