"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { EventClickArg } from "@fullcalendar/core/index.js";
import { useState } from "react";
import EventModal from "./eventModal";
import Loading from "./loading";

export default function Calendar({ initialEvents }) {
  const [event, setEvent] = useState(null);
  const [events, setEvents] = useState(initialEvents);
  const [eventLocation, setEventLocation] = useState({ x: 0, y: 0 });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(true);
  function handleEventClick(event: EventClickArg) {
    setEventLocation({ x: event.jsEvent.clientX, y: event.jsEvent.clientY });
    setEvent(event.event);
    setModalIsOpen(true);
  }
  async function handleDatesSet(args: { start: Date; end: Date }) {
    const { start, end } = args;
    setCalendarLoading(true);
    const data = await fetch(
      `/api/events/fetchEvents?start=${start.toISOString()}&end=${end.toISOString()}`,
    );
    const { currentEvents } = await data.json();
    const mappedEvents = currentEvents.map((event) => {
      return {
        ...event,
        start: event.startdate,
        end: event.enddate,
      };
    });
    setEvents(mappedEvents);
    setCalendarLoading(false);
  }

  return (
    <>
      {calendarLoading ? <Loading></Loading> : <></>}
      <EventModal
        event={event}
        modalIsOpen={modalIsOpen}
        closeModal={() => setModalIsOpen(false)}
        eventPosition={eventLocation}
      ></EventModal>

      <FullCalendar
        plugins={[dayGridPlugin]}
        loading={(loading) => {
          setCalendarLoading(loading);
        }}
        initialView="dayGridMonth"
        headerToolbar={{
          right: "dayGridMonth,dayGridWeek",
          left: "prev,next",
          center: "title",
        }}
        eventSources={[events]}
        eventClick={handleEventClick}
        datesSet={handleDatesSet}
      />
    </>
  );
}
