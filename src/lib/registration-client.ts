export function registrationVisible(upcoming: boolean, formId: string | null | undefined, open: boolean) {
  return Boolean(upcoming && formId && open);
}

export async function checkBeforeSubmit(
  event: { preventDefault(): void }, eventId: number,
  setMessage: (message: string) => void, request: typeof fetch = fetch,
) {
  setMessage('');
  try {
    const response = await request(`/api/events/${eventId}/registration-availability`, { cache: 'no-store', signal: AbortSignal.timeout(10000) });
    if (!response.ok || (await response.json()).open !== true) throw new Error('Unavailable');
  } catch {
    event.preventDefault();
    setMessage('Registration is closed or could not be checked. Please try again later.');
  }
}

export async function deliverRegistration(eventId: number, formId: string, entry: unknown,
  setMessage: (message: string) => void, request: typeof fetch = fetch) {
  try {
    const response = await request(`/api/events/${eventId}/registrations`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formId, entry }), signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error('Delivery failed');
  } catch {
    setMessage('Your form was submitted, but we could not confirm that WMCC received the details. Please contact WMCC; do not submit the form again.');
  }
}
