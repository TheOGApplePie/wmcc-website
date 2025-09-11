import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";

export default function EventModal({
  event,
  modalIsOpen,
  closeModal,
  eventPosition,
}) {
  if (!modalIsOpen) {
    return null;
  }
  const startDate = dayjs(event.extendedProps.startdate).format(
    "dddd, MMMM D, YYYY h:mm A",
  );
  const calendar = document.getElementsByClassName("fc");
  const calendarWidth = calendar.item(0).clientWidth;
  return (
    <div
      className={
        (eventPosition.x <
        window.innerWidth - calendarWidth + (calendarWidth / 7) * 3
          ? "right-0"
          : "left-0") +
        " p-4 sm:mx-3 fixed z-50 sm:w-1/2 border shadow-md rounded-md bg-white"
      }
    >
      <div className="pb-4 text-center">
        <button className="float-start text-2xl" onClick={closeModal}>
          <FontAwesomeIcon icon={faClose} />
        </button>

        <h1 className="text-3xl">{event.title}</h1>
      </div>
      <div className="grid justify-start gap-4 grid-cols-4">
        <div className="col-span-2">
          <img
            src={event.extendedProps.posterurl}
            alt={event.extendedProps.posteralt}
          />
        </div>
        <div className="col-span-2">
          <p className="text-xl">{event.extendedProps.caption}</p>
          <h2 className="py-4 text-2xl">Location and time</h2>
          <p>{startDate}</p>
          <p>{event.extendedProps.location}</p>
        </div>
      </div>
    </div>
  );
}
