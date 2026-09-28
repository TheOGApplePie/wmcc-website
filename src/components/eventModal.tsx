"use client";
import { useEffect, useRef } from "react";
import Image from "./eventPoster";
import Link from "next/link";
import type { EventOccurrence } from "../app/schemas/events";
import { eventHref, formatEventTime } from "../lib/events";

export default function EventModal({
  event,
  closeModal,
}: Readonly<{
  event: EventOccurrence | null;
  closeModal: () => void;
}>) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!event || !dialog) return;
    const previousFocus = document.activeElement;
    dialog.showModal();
    return () => {
      dialog.close();
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [event]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={closeModal}
      aria-labelledby="event-modal-title"
      className="m-auto rounded-xl p-6 w-full sm:w-3/4 xl:w-1/2 max-h-[90dvh] backdrop:bg-black/50"
    >
      {event && (
        <>
          <button
            type="button"
            autoFocus
            onClick={closeModal}
            className="btn-primary mb-4"
          >
            Close
          </button>
          <h2 id="event-modal-title" className="text-2xl">
            {event.title}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 py-4">
            <Image
              src={event.poster_url || "/wmcc-black.png"}
              alt={event.poster_alt ?? event.title}
              height={300}
              width={300}
            />
            <div>
              <p>{event.location || "Location to be announced"}</p>
              <p>
                <time dateTime={event.start_at}>
                  {formatEventTime(event.start_at)}
                </time>
              </p>
              <p>
                Ends{" "}
                <time dateTime={event.end_at}>
                  {formatEventTime(event.end_at)}
                </time>
              </p>
              <Link
                className="btn-primary inline-block mt-4"
                href={eventHref(
                  event.navigation_slug,
                  event.id,
                  event.schedule_id,
                )}
              >
                Learn more
              </Link>
            </div>
          </div>
        </>
      )}
    </dialog>
  );
}
