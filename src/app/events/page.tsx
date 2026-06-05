import Calendar from "../../components/calendar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Browse upcoming and recurring events at the Waterdown Muslim Community Centre.",
};

export default async function Events() {
  return (
    <div className="p-4 mx-auto">
      <Calendar />
    </div>
  );
}
