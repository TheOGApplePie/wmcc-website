-- Run in the Supabase SQL editor as the database owner.
-- First confirm these four rule rows exist (the public API cannot see them).
SELECT id, frequency
FROM public.recurrence_rule
WHERE id IN (55, 56, 63, 65);

-- Inspect existing policies, including any restrictive policies that could still
-- block access after adding the schedule-based policy below.
SELECT policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'recurrence_rule';

-- Allow visitors to read rules attached to schedules of published events.
-- Existing policies remain intact; RLS stays enabled.
BEGIN;
CREATE POLICY "Read recurrence rules for published event schedules"
ON public.recurrence_rule
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.event_schedules AS schedule
    JOIN public.events AS event ON event.id = schedule.event_id
    WHERE schedule.recurrence_rule_id = recurrence_rule.id
      AND event.publication_status = 'published'
  )
);
COMMIT;
