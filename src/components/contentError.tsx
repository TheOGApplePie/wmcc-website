"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function ContentError({
  message,
}: Readonly<{ message: string }>) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <div className="p-8 text-center" role="alert">
      <p>{message}</p>
      <button
        type="button"
        className="btn-primary mt-4"
        disabled={pending}
        onClick={() => startTransition(() => router.refresh())}
      >
        {pending ? "Retrying…" : "Try again"}
      </button>
    </div>
  );
}
