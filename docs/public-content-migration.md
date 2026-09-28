# Public events and announcements migration

## Data contract

The website requires announcement migrations 026–027 and event migrations 028–029, with event occurrences fully backfilled. It does not expand recurrence rules or fall back to legacy dates.

- All event readers explicitly filter published parents, including direct URLs and suggestions.
- Calendar and upcoming lists exclude cancelled sessions, cancelled schedules and superseded sessions.
- The calendar uses start_at < rangeEnd and end_at > rangeStart. End boundaries are exclusive.
- Dates are displayed in America/Toronto. Occurrence UUIDs identify calendar entries and session links.
- The homepage includes sessions already underway and displays the first five ordered by start_at, then id.
- Session and announcement pagination advances by actual returned rows, including when the database row cap is below the requested batch.
- Announcements require a null/past publish_at and future expires_at, ordered by display_order (nulls last), then id.
- Server content uses request-time reads through the existing cookie-aware anon-key client. No privileged credentials or shared content cache were added.

## URLs

The single event route is /events/{slug}. Slugs identify events, never schedules.

Optional ?schedule={scheduleUuid}&session={occurrenceUuid} parameters select a schedule and a specific occurrence. Both UUIDs are validated, and their parent event must match the event resolved by slug. A session must also belong to the requested schedule. Invalid, mismatched or unpublished references return the not-found UI. Session-only links remain supported.

A schedule-only link shows the selected schedule's label, initial timing, effective poster and location, even when cancelled or ended. A session link additionally shows the exact session's effective timing and cancellation/supersession status.

The next occurrence is the selected schedule's earliest active future session, strictly after the selected occurrence when one is provided. When none exists, or the selected schedule is cancelled, the page shows the event's earliest future session from another active schedule, clearly identifying the change. If no future session exists anywhere under the event, it shows an empty state. Failures have separate retry states.

A bare event link selects the earliest current/upcoming session. Published events without upcoming sessions still display their shared details. Other dates and schedules remain available in an expandable list; pagination preserves both selection UUIDs.

Duplicate published event slugs are a data integrity error that must be reconciled before release. The reader does not select an arbitrary event or use a schedule UUID to disambiguate the parent. No records are merged. Missing links show published similar-event suggestions. Events without slugs link back to the events calendar.

## UI states

- Homepage announcements/events stream independently with loading fallbacks, retryable failures, empty messages and success content.
- Calendar range requests clear stale entries and ignore out-of-order responses. Failures have a retry button.
- Event routes have loading, error/retry and not-found boundaries.
- Published unscheduled events display their content and an empty sessions message.
- Upcoming sessions have pagination; gallery failures do not hide event content.
- Calendar entries use native buttons; the event modal uses a native modal dialog with Escape handling and focus restoration.
- Event/announcement images use a WMCC fallback after load failure.
- Carousel pauses on focus/hover, has explicit play/pause controls and renders only the active slide.

## Verification

Run:

- npm run test:events
- npm run lint
- node node_modules/typescript/bin/tsc --noEmit --incremental false
- npm run build

The reader tests execute the production TypeScript modules with an in-memory Supabase query adapter. They cover overlap boundaries, DST formatting, publication visibility, history links, duplicate slugs, suggestions, pagination, failure propagation, and announcement timing/order. They do not prove live RLS or browser behavior.

ESLint enforces native semantic elements and keyboard handling, prohibits nested ternaries, and limits cognitive complexity to 15 in the changed event/announcement code. These are local checks corresponding to S6848, S1082, S3358 and S3776; a SonarQube scan was not run.

## Staging release checklist

1. Recheck the admin audit: event 360 had conflicting recurrence end conditions, and five duplicate-slug groups require URL review. These are historical findings, not a fresh database audit.
2. Follow the admin backup, preflight, migration and backfill sequence. Confirm every schedule has materialized_version = version before enabling readers.
3. Verify anonymous and staff-cookie requests both exclude drafts/archives and scheduled/expired announcements.
4. Exercise multiple schedules on the same date, rescheduling, cancelled/superseded direct links, overnight sessions, DST boundaries, and ranges larger than the row cap.
5. Check inherited and overridden poster/alt pairs and locations, missing/broken images, no-schedule events, pagination and duplicate-slug errors.
6. Test desktop/mobile calendar views, keyboard-only opening/closing and focus restoration, loading/error/retry/empty states, and rapid date navigation.
7. Verify announcement publication, expiry and ordering after page refresh, including carousel pause behavior.
8. Deploy with the coordinated admin cutover. Do not revert to legacy readers after new schedules are created.

No shared database migrations or backfills were run from this repository. Browser acceptance against migrated staging remains required.
