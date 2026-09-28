"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import luxonPlugin from "@fullcalendar/luxon3";
import type { EventInput, EventContentArg } from "@fullcalendar/core";
import { useCallback, useEffect, useRef, useState } from "react";
import EventModal from "./eventModal";
import { fetchEvents } from "../actions/events";
import type { EventOccurrence } from "../app/schemas/events";
import { EVENT_TIME_ZONE } from "../lib/events";

type CalendarRange = { start: Date; end: Date };
type LoadState = "loading" | "error" | "success";

export default function Calendar() {
  const [selected, setSelected] = useState<EventOccurrence | null>(null);
  const [sessions, setSessions] = useState<EventOccurrence[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [mobile, setMobile] = useState(false);
  const calendarRef = useRef<FullCalendar | null>(null);
  const requestId = useRef(0);
  const rangeRef = useRef<CalendarRange | null>(null);

  useEffect(() => {
    const requests = requestId;
    const media = window.matchMedia("(max-width: 500px)");
    const resize = () => {
      setMobile(media.matches);
      calendarRef.current
        ?.getApi()
        .changeView(media.matches ? "listMonth" : "dayGridMonth");
    };
    resize();
    media.addEventListener("change", resize);
    return () => {
      media.removeEventListener("change", resize);
      requests.current++;
    };
  }, []);

  const loadRange = useCallback(async (range: CalendarRange) => {
    rangeRef.current = range;
    const current = ++requestId.current;
    setState("loading");
    setSessions([]);
    try {
      const result = await fetchEvents({ start: range.start, end: range.end });
      if (current !== requestId.current) return;
      if (result.error || !result.data) {
        setState("error");
        return;
      }
      setSessions(result.data);
      setState("success");
    } catch {
      if (current === requestId.current) setState("error");
    }
  }, []);

  function renderEvent(arg: EventContentArg) {
    const session = arg.event.extendedProps.session as EventOccurrence;
    return (
      <button
        type="button"
        className="w-full text-left whitespace-normal"
        onClick={() => setSelected(session)}
        aria-label={`View ${arg.event.title}, ${arg.timeText}`}
      >
        {arg.timeText} {arg.event.title}
      </button>
    );
  }

  const events: EventInput[] = sessions.map((session) => ({
    id: session.id,
    title: session.title,
    start: session.start_at,
    end: session.end_at,
    extendedProps: { session },
  }));
  const toolbar = mobile
    ? { start: "title", center: "", end: "prev,next" }
    : { start: "prev,next", center: "title", end: "dayGridMonth,dayGridWeek" };

  return (
    <>
      <div className="min-h-12 p-2" aria-live="polite">
        {state === "loading" && <output>Loading events…</output>}
        {state === "error" && (
          <div role="alert">
            <p>We couldn’t load events.</p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                if (rangeRef.current) void loadRange(rangeRef.current);
              }}
            >
              Try again
            </button>
          </div>
        )}
        {state === "success" && sessions.length === 0 && (
          <p>No events are scheduled in this date range.</p>
        )}
      </div>
      <EventModal event={selected} closeModal={() => setSelected(null)} />
      <div aria-busy={state === "loading"}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, listPlugin, luxonPlugin]}
          timeZone={EVENT_TIME_ZONE}
          initialView="dayGridMonth"
          headerToolbar={toolbar}
          height="calc(100dvh - 160px)"
          events={events}
          eventContent={renderEvent}
          datesSet={loadRange}
          noEventsContent={state === "success" ? "No events scheduled." : " "}
          windowResizeDelay={100}
        />
      </div>
    </>
  );
}
