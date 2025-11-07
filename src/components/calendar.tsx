"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import { EventClickArg, EventInput } from "@fullcalendar/core/index.js";
import { useEffect, useRef, useState } from "react";
import EventModal from "./eventModal";
import Loading from "./loading";
import { EventImpl } from "@fullcalendar/core/internal";
import { fetchEvents } from "../actions/events";
import { WMCCEvent } from "../app/schemas/events";

export default function Calendar() {
  const [event, setEvent] = useState<EventImpl | null>(null);
  const [events, setEvents] = useState<EventInput[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [toolbarHeader, setToolbarHeader] = useState({
    start: "prev,next",
    center: "title",
    end: "dayGridMonth,dayGridWeek",
  });
  const calendarRef = useRef<FullCalendar | null>(null);

  function handleResize() {
    const calendarApi = calendarRef.current?.getApi?.();
    if (!calendarApi) {
      return;
    }
    if (window.innerWidth > 500) {
      setToolbarHeader({
        start: "prev,next",
        center: "title",
        end: "dayGridMonth,dayGridWeek",
      });
      if (
        calendarApi.view.type !== "dayGridMonth" &&
        calendarApi.view.type !== "dayGridWeek"
      ) {
        calendarApi.changeView("dayGridMonth");
      }
    } else {
      setToolbarHeader({
        start: "title",
        center: "",
        end: "prev,next",
      });
      if (calendarApi.view.type !== "listMonth") {
        calendarApi.changeView("listMonth");
      }
    }
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize, { passive: true });
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function handleEventClick(event: EventClickArg) {
    setEvent(event.event);
    setModalIsOpen(true);
  }

  async function handleDatesSet(args: { start: Date; end: Date }) {
    const { start, end } = args;
    setCalendarLoading(true);
    const fetchedEvents = await fetchEvents({
      start,
      end,
    });
    const data = fetchedEvents.data?.data;

    const mappedEvents = data?.map((event: WMCCEvent) => {
      return {
        ...event,
        start: event.start_date,
        end: event.end_date,
      };
    });

    setEvents(mappedEvents?.length ? mappedEvents : []);
    setCalendarLoading(false);
  }

  return (
    <>
      {calendarLoading ? <Loading></Loading> : <></>}
      <EventModal
        event={event}
        modalIsOpen={modalIsOpen}
        closeModal={() => setModalIsOpen(false)}
      ></EventModal>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, listPlugin]}
        loading={(loading) => {
          setCalendarLoading(loading);
        }}
        initialView="dayGridMonth"
        headerToolbar={toolbarHeader}
        height={"calc(100dvh - 100px)"}
        events={events}
        eventClick={handleEventClick}
        datesSet={handleDatesSet}
        windowResizeDelay={100}
      />
    </>
  );
}
