"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function Events() {
  return (
    <div className="container">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{ right: "dayGridMonth,dayGridWeek,dayGridDay" }}
      />
    </div>
  );
}
