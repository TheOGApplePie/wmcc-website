"use client";
import { useEffect, useRef } from "react";
import Image from "./eventPoster";
import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CTALink from "./CTALink";
import type { CalendarSelection } from "../app/schemas/events";
import { calendarEventHref, formatEventTime } from "../lib/events";

export default function EventModal({
  event,
  closeModal,
}: Readonly<{
  event: CalendarSelection | null;
  closeModal: () => void;
}>) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const detailsHref = event ? calendarEventHref(event) : null;
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
      className="m-auto bg-white rounded-md shadow-md border p-4 w-full sm:w-3/4 xl:w-1/2 max-h-[90dvh] overflow-y-auto backdrop:bg-black/40"
    >
      {event && (
        <>
          <div className="pb-4 text-center">
            <button
              type="button"
              autoFocus
              className="float-start text-2xl"
              onClick={closeModal}
              aria-label="Close event details"
            >
              <FontAwesomeIcon icon={faClose} />
            </button>
          </div>
          <div
            className={`block sm:grid justify-start gap-4 ${
              event.poster_url ? "grid-cols-4" : "grid-cols-2"
            }`}
          >
            {event.poster_url && (
              <div className="flex justify-center col-span-2">
                <Image
                  className="self-center"
                  src={event.poster_url}
                  alt={event.poster_alt || `Poster for ${event.title}`}
                  height={300}
                  width={300}
                />
              </div>
            )}
            <div className="py-3 grid items-center text-center col-span-2">
              <h1 id="event-modal-title">{event.title}</h1>
              <div>
                <h2 className="py-4">Location and time</h2>
                <p>{event.location || "Location to be announced"}</p>
                <p>
                  <time dateTime={event.start_at}>
                    {formatEventTime(event.start_at)}
                  </time>
                </p>
              </div>
              {detailsHref && (
                <CTALink
                  className="text-xl"
                  href={detailsHref}
                >
                  Learn more
                </CTALink>
              )}
            </div>
          </div>
        </>
      )}
    </dialog>
  );
}
