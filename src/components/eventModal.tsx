import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { EventImpl } from "@fullcalendar/core/internal";
import CTALink from "./CTALink";

interface EventModalProps {
  event: EventImpl | null;
  modalIsOpen: boolean;
  closeModal: () => void;
}
export default function EventModal({
  event,
  modalIsOpen,
  closeModal,
}: Readonly<EventModalProps>) {
  if (!modalIsOpen || !event) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[19] flex items-center justify-center">
      <button
        className="absolute inset-0 bg-black/40 cursor-default"
        onClick={closeModal}
        aria-label="Close modal"
      />
      <dialog open aria-label={event?.title ?? "Event details"} className="relative m-0 bg-white rounded-md shadow-md border p-4 w-full sm:w-3/4 xl:w-1/2 max-h-[90dvh] overflow-y-auto z-10">
        <div className="pb-4 text-center">
          <button className="float-start text-2xl" onClick={closeModal} aria-label="Close event details">
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>
        <div
          className={`block sm:grid justify-start gap-4 ${
            event.extendedProps.poster_url ? "grid-cols-4" : "grid-cols-2"
          }`}
        >
          {event.extendedProps.poster_url && (
            <div className="flex justify-center col-span-2">
              <Image
                className="self-center"
                src={event.extendedProps.poster_url}
                alt={event.extendedProps.poster_alt || `Poster for ${event.title}`}
                height={300}
                width={300}
              />
            </div>
          )}
          <div className="py-3 grid items-center text-center col-span-2">
            <h1>{event.title}</h1>
            <div>
              <h2 className="py-4">Location and time</h2>
              <p>{event.extendedProps.location}</p>
              <p>
                {(event.start ?? new Date(event.extendedProps.start_date as string)).toLocaleString(
                  "en-CA",
                  { timeZone: "America/Toronto", dateStyle: "full", timeStyle: "medium" },
                )}
              </p>
            </div>
            {event.extendedProps.navigation_slug && (
              <CTALink href={`/events/${event.extendedProps.navigation_slug}`} variant="ghost" className="text-xl">
                Learn more
              </CTALink>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
}
