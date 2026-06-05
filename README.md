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
- **Styling**: Tailwind CSS with a custom design token system — all brand colours are CSS variables in `globals.css` and mapped to Tailwind tokens in `tailwind.config.ts`
- **Calendar**: FullCalendar v6 (`dayGrid`, `list`, `rrule`, `luxon3` plugins)
- **Recurring events**: `rrule` v2 for client-side occurrence generation and server-side next/last occurrence computation
- **Microsoft Graph**: Gallery images are fetched from a SharePoint/OneDrive folder via the Microsoft Graph API
- **TypeScript**: Strict mode enabled. Shared DB-facing types (`RecurrenceRule`, `RecurringBaseEvent`, `WMCCEvent`, `SimilarEvent`) live in `src/app/schemas/events.ts`; no `any` types in source files
- **Security**: CSP headers set in `src/app/middleware.ts` via a per-request nonce; reCAPTCHA v2 on the contact form; Upstash Redis rate limiting on form submissions
- **Rate limiting**: Contact form submissions are rate-limited to 5 per IP per minute via `@upstash/ratelimit`

---

## Environment variables

The following variables must be set in `.env.local`:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `MAPS_API` | Google Maps Embed API key (for event detail pages and contact page) |
| `RECAPTCHA_SITE_KEY` | Google reCAPTCHA v2 site key (contact form) |
| `TENANT_ID` | Azure AD tenant ID (for Microsoft Graph) |
| `CLIENT_ID` | Azure AD app client ID (for Microsoft Graph) |
| `CLIENT_SECRET` | Azure AD app client secret (for Microsoft Graph) |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL (rate limiting) |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token (rate limiting) |

---

## Design system

### Colour tokens
All colours are defined as CSS variables in `src/app/globals.css` and exposed as Tailwind utility classes via `tailwind.config.ts`. Never use hardcoded hex values in components.

| Token | CSS variable | Value |
|---|---|---|
| `bg-main-blue` | `--main-colour-blue` | `#1e3a5f` |
| `bg-dark-navy` | `--colour-dark-navy` | `#08101a` |
| `bg-near-black` | `--colour-near-black` | `#111111` |
| `bg-footer-bg` | `--colour-footer-bg` | `#111827` |
| `bg-green` | `--secondary-colour-green` | `#026c54` |
| `bg-green-dark` | `--secondary-colour-green-dark` | `#014d3c` |
| `bg-green-light` | `--secondary-colour-green-light` | `#1b9679` |
| `bg-accent-white` | `--accent-colour-white` | `#f5f0f6` |
| `bg-warning` | `--warning-colour` | `#fbbf24` |
| `text-text-muted` | `--colour-text-muted` | `#6b7280` |

### Button classes
Three reusable button/link classes are defined in `globals.css` inside `@layer components` (so Tailwind utilities can override them):

| Class | Use |
|---|---|
| `btn-primary` | Primary CTAs — green background, darkens on hover (Donate, Submit, carousel CTAs) |
| `btn-ghost` | Secondary CTAs — same green style, no `font-semibold` or `shadow` |
| `btn-nav` | Navigation links — white text, green hover fill |

### CTALink component
`src/components/CTALink.tsx` — use this for **all navigational CTAs** instead of raw `<a>` or `<button><Link>` nesting. It auto-detects internal vs external:
- Internal (`href` starts with `/`): renders as Next.js `<Link>` (prefetching)
- External: renders as `<a target="_blank" rel="noopener noreferrer">`

Props: `href` (required), `variant` (`"primary"` | `"ghost"` | `"nav"`, default `"primary"`), `className`, `onClick`.

Native `<button type="submit">` elements (e.g. the contact form) stay as-is — `CTALink` is for navigation only.

---

## Supabase / RLS notes

**Important:** Supabase PostgREST FK joins are subject to RLS on the *joined* table, not just the parent. If the `recurrence_rule` table (or any future FK-joined table) has RLS enabled, the anon role must have a `SELECT` policy or the join silently returns `null`.

```sql
CREATE POLICY "Public read access" ON recurrence_rule FOR SELECT TO anon USING (true);
```

Check this for every table in a join chain, not just the root table.

**navigation_slug is mandatory.** All event queries filter `.not("navigation_slug", "is", null)` where navigation is required. Ensure every event has a slug set before publishing — events without slugs are excluded from the home page and similar-event suggestions, and the event detail page is unreachable.

---

## Site sections

### Announcements
Quick messages displayed on the home page carousel. Each announcement can have a poster, title, description, and an optional call-to-action. Announcements have an expiry datetime — once passed they are no longer displayed. The carousel auto-advances every 5 seconds with a pause/play toggle (WCAG 2.2 compliant).

### Events
Planned community activities displayed in three places:

**Home page** — shows the next 5 chronologically upcoming events, merged across non-recurring and recurring events. For each active recurring series, up to 5 future occurrences are computed server-side (`r.between()`) and pooled with all future non-recurring events; the earliest 5 are displayed. Each event pill is a fully clickable card linking to the event detail page.

**Calendar page** — a full FullCalendar view. Non-recurring events are fetched by date range on every calendar navigation. Recurring events are stored as a single base event row with a recurrence rule; FullCalendar's `rrule` plugin generates all occurrences client-side. `dtstart`/`until`/`exdate` values are converted to **floating Toronto local-time strings** (no UTC offset) before being passed to FullCalendar so that `BYDAY` rules are evaluated against Toronto calendar days rather than UTC days.

**Event detail page** — reached via `/events/[slug]`. For recurring events, the next (or most recent past) occurrence is computed from the recurrence rule using `rrule` with `tzid: "America/Toronto"`. The page shows a human-readable recurrence summary (e.g. "Happens every month on the first Saturday"), a Google Maps embed for the venue, and an optional photo gallery. If a slug does not match any event, up to 3 similar events are suggested using per-word `ilike` queries scored by match count (capped at 5 words).

#### Recurring event schema
The `recurrence_rule` table defines how an event repeats. Its TypeScript mirror is the `RecurrenceRule` interface in `src/app/schemas/events.ts`.

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

Each recurring series has exactly **one** event row in the `events` table (the base event). All occurrences are derived from it via the recurrence rule. The full shape of a recurring event with its joined rule is typed as `RecurringBaseEvent` in `src/app/schemas/events.ts`.

### Gallery
Event detail pages can display a photo gallery fetched from a linked OneDrive/SharePoint folder via Microsoft Graph. Only `.jpg`, `.jpeg`, and `.png` files are shown. The gallery section is hidden entirely when no images exist. Images open in a full-screen lightbox (`src/components/expandableImage.tsx`) with previous/next navigation (looping), image counter, keyboard support (arrow keys, Escape), and scroll lock while open.

### Contact
A contact form with reCAPTCHA v2 validation and server-side rate limiting. The form validates name, email (pattern), phone (optional, accepts formatted numbers), and message (20–500 characters). Submissions are stored in the `community-feedback` Supabase table.

### Donations
An embedded Zeffy donation form is shown on the home page. A "Donate" CTA is also present in the header and mobile navigation menu.

---

## Content Security Policy

CSP headers are applied per-request in `src/app/middleware.ts` using a randomly generated nonce. Allowed origins:

| Directive | Allowed origins |
|---|---|
| `script-src` | `self`, nonce, `strict-dynamic`, google.com, gstatic.com, masjidbox.com, recaptcha.net |
| `frame-src` | google.com, recaptcha.net, masjidbox.com, zeffy.com |
| `connect-src` | `self`, Supabase, Upstash, google.com, masjidbox.com |
| `img-src` | `self`, Supabase, gstatic.com, masjidbox.com, `*.sharepoint.com` |
| `font-src` | `self`, fonts.googleapis.com, fonts.gstatic.com |

If a widget or embed stops working, check the browser console for CSP violations first — it is the most common cause.
