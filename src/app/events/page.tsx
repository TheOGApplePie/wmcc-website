import Calendar from "../../components/calendar";
import { createClient } from "../../utils/supabase/server";
import dayjs from "dayjs";

export default async function Events() {
  const supabase = await createClient();
  const startOfMonth = dayjs().startOf("month");
  const endOfMonth = dayjs().endOf("month");
  const { data: currentEvents } = await supabase
    .from("events")
    .select(
      "id, posterurl,posteralt,title,startdate, location, enddate, caption",
    )
    .gte("startdate", startOfMonth.toISOString())
    .lte("startdate", endOfMonth.toISOString());
  const events = currentEvents.map((event) => {
    return {
      ...event,
      start: event.startdate,
      end: event.enddate,
    };
  });
  return (
    <div className="p-4 mx-auto">
      <Calendar initialEvents={events}></Calendar>
    </div>
  );
}
