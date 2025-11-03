import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import dayjs from "dayjs";
import { EventImpl } from "@fullcalendar/core/internal";

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
  const startDate = dayjs(event.extendedProps.start_date).format(
    "dddd, MMMM D, YYYY h:mm A",
  );
  return (
    <div className="p-4 m-auto absolute left-0 z-10 sm:w-1/2 border shadow-md rounded-md bg-white">
      <div className="pb-4 text-center">
        <button className="float-start text-2xl" onClick={closeModal}>
          <FontAwesomeIcon icon={faClose} />
        </button>

        <h1 className="text-3xl">{event.title}</h1>
      </div>
      <div className="grid justify-start gap-4 grid-cols-4">
        <div className="col-span-2">
          <Image
            src={event.extendedProps.poster_url}
            alt={event.extendedProps.poster_alt}
            height={300}
            width={300}
          />
        </div>
        <div className="col-span-2">
          <p className="text-xl">{event.extendedProps.description}</p>
          <h2 className="py-4 text-2xl">Location and time</h2>
          <p>{startDate}</p>
          <p>{event.extendedProps.location}</p>
        </div>
      </div>
    </div>
  );
}
