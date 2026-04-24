import { fetchOneEvent, fetchRecurringEventDetails } from "../../../actions/events";
import Image from "next/image";
import { ClientSecretCredential } from "@azure/identity";
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import Link from "next/link";
import ExpandableImage from "../../../components/expandableImage";
export default async function EventDetails({
  params,
}: Readonly<{
  params: Promise<{ id: number }>;
}>) {
  const { id } = await params;
  const event = (await fetchOneEvent({ id })).data?.data[0];
  if (!event) {
    return (
      <div className="w-full h-[77dvh] flex justify-center items-center">
        <div>
          <h1>No event could be found</h1>
        </div>
      </div>
    );
  }
  let displayDate: string = event.start_date as string;
  let occurrenceLabel = "";
  if (event.recurrence_rule_id) {
    const recurringDetails = (
      await fetchRecurringEventDetails({
        recurrence_rule_id: event.recurrence_rule_id,
      })
    ).data;
    if (recurringDetails?.nextOccurrence) {
      displayDate = recurringDetails.nextOccurrence.start_date as string;
      occurrenceLabel = "Next occurrence";
    } else if (recurringDetails?.lastOccurrence) {
      displayDate = recurringDetails.lastOccurrence.start_date as string;
      occurrenceLabel = "Last occurrence";
    }
  }

  const apiKey = process.env.MAPS_API;
  const googleMapsURL =
    "https://www.google.com/maps/embed/v1/place?key=" +
    apiKey +
    `&q=${event.location}`;
  let driveItem: { value: Record<string, string>[] } = { value: [] };
  if (event.gallery_url) {
    const credential = new ClientSecretCredential(
      process.env.TENANT_ID!,
      process.env.CLIENT_ID!,
      process.env.CLIENT_SECRET!,
    );
    const shareUrl = event.gallery_url;
    const encodedUrl = encodeSharingUrl(shareUrl);
    const authProvider = new TokenCredentialAuthenticationProvider(credential, {
      scopes: ["https://graph.microsoft.com/.default"],
    });
    const graphClient = Client.initWithMiddleware({
      authProvider: authProvider,
    });
    driveItem = await graphClient
      .api(`/shares/${encodedUrl}/driveItem/children`)
      .get();
  }

  return (
    <div>
      <div className="sm:py-10 sm:px-5 flex flex-col items-center bg-[var(--main-colour-blue)]">
        <div className="sm:border sm:rounded-2xl sm:shadow-lg bg-[#111111] sm:bg-slate-50">
          <div className="hidden sm:block sm:pt-5">
            <h1 className="text-center">{event.title}</h1>
          </div>
          <div className="sm:py-5 sm:grid sm:grid-cols-2 max-w-4xl">
            <div className="p-3 sm:col-span-1">
              <Image
                className="rounded-2xl shadow-lg sm:shadow-none"
                src={event.poster_url || "https://picsum.photos/300/500"}
                alt={event.poster_alt || "Dummy Image"}
                height={700}
                width={800}
              />
            </div>
            <div className="p-4 col-span-1 text-white sm:text-black sm:bg-slate-50 bg-[var(--main-colour-blue)]">
              <h1 className="block sm:hidden text-center py-3">
                {event.title}
              </h1>
              <p className="text-xl whitespace-pre-wrap">{event.description}</p>
              <div className="py-2">
                <h3>Event Location</h3>
                <p>{event.location}</p>
                <iframe
                  title="googlemaps"
                  className="w-full"
                  src={googleMapsURL}
                ></iframe>
                <p>
                  {occurrenceLabel && (
                    <span className="font-semibold">{occurrenceLabel}: </span>
                  )}
                  {new Date(displayDate).toLocaleString("en-CA", {
                    timeZone: "America/New_York",
                    dateStyle: "full",
                    timeStyle: "medium",
                  })}
                </p>
                {event.recurrence_rule && (
                  <p className="mt-1 italic">
                    {buildRecurrenceString(
                      event.recurrence_rule as unknown as {
                        frequency: string;
                        interval?: number | null;
                        by_weekdays?: string[] | null;
                        by_month_day?: number | null;
                        by_set_position?: number[] | null;
                      },
                      occurrenceLabel === "Last occurrence",
                    )}
                  </p>
                )}
              </div>

              {event.call_to_action_link && (
                <button className="text-xl rounded py-4 px-2 hover:bg-[var(--secondary-colour-green-light)] text-white sm:hover:text-white sm:text-[var(--main-colour-blue)] transition-colors">
                  <Link href={event.call_to_action_link}>
                    {event.call_to_action_caption}
                  </Link>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="p-5">
        <h2>See our memorable moments from this event</h2>
      </div>
      <div className="p-10 flex items-start gap-4 overflow-x-scroll">
        {driveItem.value.length ? (
          driveItem.value.map((item, index) => {
            return (
              <ExpandableImage
                key={index}
                src={item["@microsoft.graph.downloadUrl"]}
                alt="Dummy Image"
              />
            );
          })
        ) : (
          <div>
            <h3>We don&apos;t have any memories to share just yet.</h3>
          </div>
        )}
      </div>
    </div>
  );
}
function buildRecurrenceString(
  rule: {
    frequency: string;
    interval?: number | null;
    by_weekdays?: string[] | null;
    by_month_day?: number | null;
    by_set_position?: number[] | null;
  },
  terminated = false,
): string {
  const DAY_MAP: Record<string, string> = {
    MO: "Monday",
    TU: "Tuesday",
    WE: "Wednesday",
    TH: "Thursday",
    FR: "Friday",
    SA: "Saturday",
    SU: "Sunday",
  };
  const ORDINAL_MAP: Record<string, string> = {
    "1": "first",
    "2": "second",
    "3": "third",
    "4": "fourth",
    "-1": "last",
  };

  const freq = rule.frequency?.toUpperCase();
  const interval = rule.interval && rule.interval > 1 ? rule.interval : null;

  const freqLabel: Record<string, [string, string]> = {
    DAILY: ["day", "days"],
    WEEKLY: ["week", "weeks"],
    MONTHLY: ["month", "months"],
    YEARLY: ["year", "years"],
  };
  const [singular, plural] = freqLabel[freq] ?? [
    freq.toLowerCase(),
    freq.toLowerCase() + "s",
  ];
  let base = interval ? `every ${interval} ${plural}` : `every ${singular}`;

  if (rule.by_set_position?.length && rule.by_weekdays?.length) {
    const pos =
      ORDINAL_MAP[String(rule.by_set_position[0])] ??
      `${rule.by_set_position[0]}${ordinalSuffix(rule.by_set_position[0])}`;
    const days = rule.by_weekdays.map((d) => DAY_MAP[d] ?? d).join(" and ");
    base += ` on the ${pos} ${days}`;
  } else if (rule.by_weekdays?.length) {
    const days = rule.by_weekdays.map((d) => DAY_MAP[d] ?? d);
    const joined =
      days.length > 1
        ? days.slice(0, -1).join(", ") + " and " + days[days.length - 1]
        : days[0];
    base += ` on ${joined}`;
  } else if (rule.by_month_day) {
    base += ` on the ${rule.by_month_day}${ordinalSuffix(rule.by_month_day)}`;
  }

  return (terminated ? "Happened " : "Happens ") + base;
}

function ordinalSuffix(n: number): string {
  const abs = Math.abs(n);
  if (abs % 100 >= 11 && abs % 100 <= 13) return "th";
  return ["th", "st", "nd", "rd"][abs % 10] ?? "th";
}

function encodeSharingUrl(url: string) {
  return (
    "u!" +
    Buffer.from(url)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "")
  );
}
