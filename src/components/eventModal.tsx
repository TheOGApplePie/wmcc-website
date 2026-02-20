import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { EventImpl } from "@fullcalendar/core/internal";
import Link from "next/link";

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
    <div className="p-4 m-auto absolute top-1/2 bottom-1/2 left-0 right-0 z-[19] h-fit sm:w-3/4 xl:w-1/2 border shadow-md rounded-md bg-white overflow-y-scroll">
      <div className="pb-4 text-center">
        <button className="float-start text-2xl" onClick={closeModal}>
          <FontAwesomeIcon icon={faClose} />
        </button>

        <h1>{event.title}</h1>
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
              alt={
                event.extendedProps.poster_alt || `Poster for ${event.title}`
              }
              height={300}
              width={300}
            />
          </div>
        )}
        <div className="py-3 text-center col-span-2">
          <h2>{event.extendedProps.description}</h2>
          <h3 className="py-4">Location and time</h3>
          <p>{event.extendedProps.location}</p>
          <p>
            {new Date(event.extendedProps.start_date).toLocaleString("en-CA", {
              dateStyle: "full",
              timeStyle: "medium",
            })}
          </p>
          <button className="p-3 rounded-xl text-xl hover:bg-[var(--secondary-colour-green-light)] hover:text-white text-[var(--main-colour-blue)] transition-colors">
            <Link href={`/events/${event.id}`}>Click here to learn more</Link>
          </button>
        </div>
      </div>
    </div>
  );
}
