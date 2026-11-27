import { createClient } from '@supabase/supabase-js';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { cleanCognitoEntry } from '../../../../../lib/registration-entry';

export const dynamic = 'force-dynamic';
const MAX_BYTES = 128 * 1024;
const reply = (status: number) => Response.json({ ok: status === 200 }, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(request: Request, { params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const id = Number(eventId);
  if (!/^[1-9]\d*$/.test(eventId) || !Number.isSafeInteger(id)) return reply(400);
  if (request.headers.get('origin') !== new URL(request.url).origin || !request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return reply(403);
  const { UPSTASH_REDIS_REST_URL: url, UPSTASH_REDIS_REST_TOKEN: token, SUPABASE_SERVICE_ROLE_KEY: key, NEXT_PUBLIC_SUPABASE_URL: supabaseUrl } = process.env;
  if (!url || !token || !key || !supabaseUrl) { console.error('Registration delivery configuration missing'); return reply(503); }
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip');
    if (!ip) return reply(503);
    const limit = new Ratelimit({ redis: new Redis({ url, token }), limiter: Ratelimit.slidingWindow(10, '1 m'), prefix: 'registration' });
    if (!(await limit.limit(ip)).success) return reply(429);
    if (Number(request.headers.get('content-length')) > MAX_BYTES || !request.body) return reply(413);
    const reader = request.body.getReader();
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > MAX_BYTES) { await reader.cancel(); return reply(413); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    let body: unknown;
    try { body = JSON.parse(new TextDecoder().decode(bytes)); } catch { return reply(400); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return reply(400);
    const { formId, entry } = body as Record<string, unknown>;
    if (typeof formId !== 'string' || !formId || formId.length > 200 || !entry || typeof entry !== 'object' || Array.isArray(entry)) return reply(400);
    const supabase = createClient(supabaseUrl, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await supabase.rpc('append_browser_event_registration', { p_event_id: id, p_form_id: formId, p_entry: cleanCognitoEntry(entry) });
    if (error) { console.error('Registration delivery RPC failed', { eventId: id, code: error.code }); return reply(503); }
    return reply(data === true ? 200 : 400);
  } catch {
    console.error('Registration delivery failed', { eventId: id });
    return reply(503);
  }
}
