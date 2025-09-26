"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import { EventClickArg } from "@fullcalendar/core/index.js";
import { useEffect, useRef, useState } from "react";
import EventModal from "./eventModal";
import Loading from "./loading";

export default function Calendar() {
  const [event, setEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [toolbarHeader, setToolbarHeader] = useState({
    start: "prev,next",
    center: "title",
    end: "dayGridMonth,dayGridWeek",
  });
  const calendarRef = useRef(null);
  const handleResize = () => {
    const calendarApi = calendarRef.current.getApi();
    console.log(calendarApi.view.type === "listMonth");
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
  };

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
    const data = await fetch(
      `/api/events/?start=${start.toISOString()}&end=${end.toISOString()}`
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
        eventSources={[events]}
        eventClick={handleEventClick}
        datesSet={handleDatesSet}
        windowResizeDelay={100}
      />
    </>
  );
}
