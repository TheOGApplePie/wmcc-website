"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function EventsError({
  reset,
}: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <main className="p-12 text-center">
      <h1 className="text-2xl">Events are temporarily unavailable</h1>
      <p role="alert" className="my-4">
        We couldn’t load this page. Please try again.
      </p>
      <button
        type="button"
        className="btn-primary"
        disabled={pending}
        onClick={() =>
          startTransition(() => {
            router.refresh();
            reset();
          })
        }
      >
        {pending ? "Retrying…" : "Try again"}
      </button>
    </main>
  );
}
