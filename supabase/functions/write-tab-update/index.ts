/**
 * write-tab-update — 헤드라인·changes update entry INSERT 단일 진입점.
 *
 * sandbox가 새 데이터 갱신 시 호출. source_hash 계산·is_archive=false 고정 +
 * trigger가 자동으로 main 5건 초과분을 archive로 이동·main 5건 한도 유지.
 *
 * 인증: X-Briefick-Secret 헤더 (BRIEFICK_WRITE_SECRET secret 일치)
 *
 * Body: {
 *   tab_id: 'kr'|'stocks'|'ai'|'commodity'|'unicorn'|'jp',
 *   entry: {
 *     date: "2026-05-14 19:10 KST",  // 필수
 *     summary?: string,               // AI탭은 entries 사용
 *     changes?: array,                // 다른 탭 형식
 *     entries?: array,                // AI탭 형식
 *     ...
 *   }
 * }
 *
 * 응답: { ok: true, id: 12345, deduped?: true } 또는 4xx/5xx
 *
 * 배포: supabase functions deploy write-tab-update --no-verify-jwt
 */

import { notify } from "../_shared/notify.ts";

const VALID_TABS = new Set(["kr", "stocks", "ai", "commodity", "unicorn", "jp"]);

// "2026-05-12 19:10 KST" → ISO with +09:00. tab_updates.entry_date에 박힘
function kstToISO(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/);
  if (!m) return null;
  const [, Y, M, D, h, mm, ss] = m;
  return `${Y}-${M}-${D}T${h}:${mm}:${ss || "00"}+09:00`;
}

async function sha256Hex(s: string): Promise<string> {
  const data = new TextEncoder().encode(s);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

// AI(entries 형식) / 다른 탭(summary 형식) 둘 다 안정적인 dedup 키
async function makeHash(tab_id: string, entry: Record<string, unknown>): Promise<string> {
  const date = String(entry.date ?? "");
  let body = "";
  if (Array.isArray(entry.entries) && entry.entries.length) {
    const e0 = entry.entries[0] as Record<string, unknown>;
    body = String(e0?.text ?? "").slice(0, 200);
  } else {
    body = String(entry.summary ?? "").slice(0, 200);
  }
  return await sha256Hex(`${tab_id}|${date}|${body}`);
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const writeSecret = Deno.env.get("BRIEFICK_WRITE_SECRET");
  if (!writeSecret) {
    return new Response("BRIEFICK_WRITE_SECRET not configured", { status: 500 });
  }
  if (req.headers.get("X-Briefick-Secret") !== writeSecret) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const secretKey = Deno.env.get("BRIEFICK_SUPABASE_SECRET_KEY") ?? "";
  if (!supabaseUrl || !secretKey) {
    return new Response("SUPABASE_URL·BRIEFICK_SUPABASE_SECRET_KEY not configured", { status: 500 });
  }

  let body: { tab_id?: string; entry?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const tab_id = String(body.tab_id ?? "");
  if (!VALID_TABS.has(tab_id)) {
    return new Response(`invalid tab_id: ${tab_id}`, { status: 400 });
  }
  const entry = body.entry;
  if (!entry || typeof entry !== "object") {
    return new Response("entry required (object)", { status: 400 });
  }
  const entryDate = kstToISO(entry.date);
  if (!entryDate) {
    return new Response(`invalid entry.date: ${entry.date}`, { status: 400 });
  }

  const source_hash = await makeHash(tab_id, entry);

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/tab_updates?on_conflict=tab_id,source_hash`, {
      method: "POST",
      headers: {
        "apikey": secretKey,
        "Authorization": `Bearer ${secretKey}`,
        "Content-Type": "application/json",
        // ignore-duplicates → 같은 hash 두 번 보내도 silent OK (멱등)
        "Prefer": "resolution=ignore-duplicates,return=representation",
      },
      body: JSON.stringify([{
        tab_id,
        entry_date: entryDate,
        summary: entry.summary ?? null,
        changes: entry.changes ?? null,
        raw: entry,
        is_archive: false,
        source_hash,
      }]),
    });
    if (!res.ok) {
      const t = await res.text();
      await notify("write-tab-update", "failure", `${tab_id} ${res.status}: ${t.slice(0, 200)}`);
      return new Response(`insert ${res.status}: ${t.slice(0, 300)}`, { status: 502 });
    }
    const rows = await res.json();
    const deduped = !rows || rows.length === 0;
    return new Response(JSON.stringify({
      ok: true,
      tab_id,
      id: rows[0]?.id,
      deduped,
      source_hash,
    }), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    await notify("write-tab-update", "failure", (e as Error).message.slice(0, 200));
    return new Response(`fetch failed: ${(e as Error).message}`, { status: 502 });
  }
});
