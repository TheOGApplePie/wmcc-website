"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchSimilarEvents } from "../actions/events";
import { eventHref } from "../lib/events";
import type { PublicEvent } from "../app/schemas/events";

type Result = { data: PublicEvent[] | null; error: string | null };
export default function MissingEventSuggestions() {
  const params = useParams<{ slug?: string }>();
  const slug = params.slug ?? "";
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  useEffect(() => {
    let ignore = false;
    setResult(null);
    fetchSimilarEvents(slug)
      .then((value) => {
        if (!ignore) setResult(value);
      })
      .catch(() => {
        if (!ignore)
          setResult({
            data: null,
            error: "Suggestions are temporarily unavailable.",
          });
      });
    return () => {
      ignore = true;
    };
  }, [slug, attempt]);
  if (!result)
    return <output className="block my-8">Loading suggestions…</output>;
  if (result.error)
    return (
      <div className="my-8" role="alert">
        <p>{result.error}</p>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setAttempt((value) => value + 1)}
        >
          Try again
        </button>
      </div>
    );
  if (!result.data?.length) return null;
  return (
    <section className="my-8">
      <h2 className="text-2xl mb-4">You may be looking for</h2>
      <ul className="space-y-4">
        {result.data.map((event) => (
          <li key={event.id}>
            <Link className="underline" href={eventHref(event.navigation_slug)}>
              {event.title}
            </Link>
            <p>{event.location}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
