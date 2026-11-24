import { getRegistrationOpen } from '../../../../../lib/public-content';

export const dynamic = 'force-dynamic';
export async function GET(_request: Request, { params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const id = Number(eventId);
  if (!/^[1-9]\d*$/.test(eventId) || !Number.isSafeInteger(id)) {
    return Response.json({ open: false }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  }
  const open = await getRegistrationOpen(id);
  return Response.json({ open }, { headers: { 'Cache-Control': 'no-store' } });
}
