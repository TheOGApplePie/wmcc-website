# Assalamualaikum!
## Welcome to the WMCC website repository
### This repository contains the source code for the public-facing website of [wmcc.ca](https://www.wmcc.ca).

---

## Contribution guidelines

There is an AI bot that assists in code reviews, however, its reviews are not taken as final decisions. It is extremely important to rely on **human** code reviews as AI, while helpful, is also error prone and humans can provide better context.

If you are submitting a code change, please reference any relevant issues so that it is easy to keep track of issues and mark them as resolved as necessary. In addition to checkboxes, they also provide the reviewer with the proper context.

When you are working on a change, keep your changes in a separate branch and create a PR to merge into main. Please do not commit to main as it is protected. If you are stuck, please reach out to the community and speak to stakeholders as needed — we're all on the same team In Shaa Allah.

---

## Tech stack

- **Framework**: Next.js 15 (App Router, server components + server actions via `next-safe-action`)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Calendar**: FullCalendar v6 (`dayGrid`, `list`, `rrule`, `luxon3` plugins)
- **Recurring events**: `rrule` v2 for client-side occurrence generation and server-side next/last occurrence computation
- **Microsoft Graph**: Gallery images are fetched from a SharePoint/OneDrive folder via the Microsoft Graph API

---

## Environment variables

The following variables must be set in `.env.local`:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `MAPS_API` | Google Maps Embed API key (for event detail pages) |
| `TENANT_ID` | Azure AD tenant ID (for Microsoft Graph) |
| `CLIENT_ID` | Azure AD app client ID (for Microsoft Graph) |
| `CLIENT_SECRET` | Azure AD app client secret (for Microsoft Graph) |

---

## Site sections

### Announcements
Quick messages displayed on the home page. Each announcement can have a poster, title, description, and an optional call-to-action button. Announcements have an expiry datetime — once passed they are no longer displayed.

### Events
Planned community activities displayed in two places:

**Home page** — shows the next 5 upcoming events across both non-recurring and recurring events, sorted by date. Recurring events have their next occurrences computed server-side via `rrule`.

**Calendar page** — a full FullCalendar view. Non-recurring events are fetched by date range. Recurring events are stored as a single base event row with a recurrence rule; FullCalendar's rrule plugin generates all occurrences client-side. The calendar timezone is `America/Toronto`.

**Event detail page** — reached via `/events/[slug]`. For recurring events, the next (or most recent past) occurrence is computed from the recurrence rule using `rrule` with `tzid: "America/Toronto"`.

#### Recurring event schema
The `recurrence_rule` table defines how an event repeats:

| Column | Type | Description |
|---|---|---|
| `frequency` | `text` | `DAILY`, `WEEKLY`, `MONTHLY`, or `YEARLY` |
| `interval` | `smallint` | Repeat every N intervals (default 1) |
| `by_weekdays` | `text[]` | Weekday codes e.g. `["SA"]`, `["MO", "WE"]` |
| `by_month_day` | `smallint` | Day of month e.g. `15` |
| `by_set_position` | `smallint[]` | Occurrence within period e.g. `[1]` for first, `[-1]` for last |
| `until` | `timestamptz` | Series end date |
| `count` | `smallint` | Max number of occurrences |
| `exdates` | `text[]` | Excluded dates (skipped occurrences) |

Each recurring series has exactly **one** event row in the `events` table (the base event). All occurrences are derived from it via the recurrence rule.

### Gallery
Event detail pages can display a photo gallery fetched from a linked OneDrive/SharePoint folder via Microsoft Graph. Only `.jpg`, `.jpeg`, and `.png` files are shown. Images open in a full-screen modal with previous/next navigation and keyboard support (arrow keys, Escape).

### Donations
An embedded Zeffy donation form is shown on the home page.
