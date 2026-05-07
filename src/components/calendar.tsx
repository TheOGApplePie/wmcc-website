"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import rrulePlugin from "@fullcalendar/rrule";
import luxonPlugin from "@fullcalendar/luxon3";
import { EventClickArg, EventInput } from "@fullcalendar/core/index.js";
import { useEffect, useRef, useState } from "react";
import EventModal from "./eventModal";
import Loading from "./loading";
import { EventImpl } from "@fullcalendar/core/internal";
import { fetchEvents, fetchRecurringBaseEvents } from "../actions/events";
import { RecurringBaseEvent, RecurrenceRule } from "../app/schemas/events";

function toFloatingToronto(isoDate: string): string {
  const date = new Date(isoDate);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}`;
}

interface FCRRuleInput {
  freq: string;
  dtstart: string;
  interval?: number;
  byweekday?: string[];
  bymonthday?: number;
  bysetpos?: number[];
  until?: string;
  count?: number;
}

function buildRRuleObj(dtstart: string, rule: RecurrenceRule): FCRRuleInput {
  const options: FCRRuleInput = {
    freq: rule.frequency.toUpperCase(),
    dtstart: toFloatingToronto(dtstart),
  };
  if (rule.interval && rule.interval > 1) options.interval = rule.interval;
  if (rule.by_weekdays?.length) options.byweekday = rule.by_weekdays;
  if (rule.by_month_day) options.bymonthday = rule.by_month_day;
  if (rule.by_set_position?.length) options.bysetpos = rule.by_set_position;
  if (rule.until) options.until = toFloatingToronto(rule.until);
  if (rule.count) options.count = rule.count;
  return options;
}

function calcDuration(start: string, end: string): string {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export default function Calendar() {
  const [event, setEvent] = useState<EventImpl | null>(null);
  const [regularEvents, setRegularEvents] = useState<EventInput[]>([]);
  const [recurringEvents, setRecurringEvents] = useState<EventInput[]>([]);
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

  useEffect(() => {
    fetchRecurringBaseEvents({}).then((result) => {
      const data: RecurringBaseEvent[] = (result?.data?.data ?? []) as RecurringBaseEvent[];
      const rruleInputs: EventInput[] = data
        .map((ev) => {
          const rule = Array.isArray(ev.recurrence_rule)
            ? ev.recurrence_rule[0]
            : ev.recurrence_rule;
          if (!rule) return null;
          return {
            ...ev,
            id: String(ev.id),
            rrule: buildRRuleObj(ev.start_date, rule),
            duration: calcDuration(ev.start_date, ev.end_date),
            exdate: rule.exdates?.map(toFloatingToronto) ?? [],
          };
        })
        .filter(Boolean) as EventInput[];
      setRecurringEvents(rruleInputs);
    });
  }, []);

  function handleEventClick(event: EventClickArg) {
    setEvent(event.event);
    setModalIsOpen(true);
  }

  async function handleDatesSet(args: { start: Date; end: Date }) {
    const { start, end } = args;
    setCalendarLoading(true);
    const fetchedEvents = await fetchEvents({ start, end });
    const data = fetchedEvents.data?.data ?? [];
    const mappedEvents: EventInput[] = data.map((ev) => ({
      ...ev,
      start: ev.start_date,
      end: ev.end_date,
    }));
    setRegularEvents(mappedEvents);
    setCalendarLoading(false);
  }

  return (
    <>
      {calendarLoading && <Loading></Loading>}
      <EventModal
        event={event}
        modalIsOpen={modalIsOpen}
        closeModal={() => setModalIsOpen(false)}
      ></EventModal>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, listPlugin, rrulePlugin, luxonPlugin]}
        loading={(loading) => {
          setCalendarLoading(loading);
        }}
        initialView="dayGridMonth"
        headerToolbar={toolbarHeader}
        height={"calc(100dvh - 100px)"}
        events={[...recurringEvents, ...regularEvents]}
        eventClassNames={"hover:cursor-pointer"}
        eventClick={handleEventClick}
        datesSet={handleDatesSet}
        windowResizeDelay={100}
      />
    </>
  );
}
