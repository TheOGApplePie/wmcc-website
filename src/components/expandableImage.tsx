"use client";
import Image from "next/image";
import { useState } from "react";
export default function ExpandableImage({
  src,
  alt,
}: Readonly<{
  src: string;
  alt: string;
}>) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Image
        src={src}
        alt={alt}
        height={400}
        width={400}
        className="hover:cursor-pointer max-h-72"
        onClick={() => setShowModal(true)}
      />
      {showModal && (
        <div className="p-4 m-auto fixed top-1/2 bottom-1/2 left-0 right-0 z-[19] h-fit sm:w-fit border shadow-md rounded-md bg-white">
          <div className="relative">
            <button
              className="absolute top-0 right-5"
              onClick={() => setShowModal(false)}
            >
              X
            </button>
            <Image src={src} alt={alt} height={400} width={400} />
          </div>
        </div>
      )}
    </>
  );
}
