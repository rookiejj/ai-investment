/**
 * 만료 임박 알림톡 발송 Edge Function (D-1, KST 20:00 크론)
 *
 * 1) 내일(KST 기준) 안에 만료되는 active 구독자 조회
 * 2) 솔라피 알림톡(ATA) 발송 — 재구독 페이지(/renew) 링크 버튼 동봉
 * 3) send_logs INSERT (template_code='expiry_notice')
 *
 * 필수 ENV:
 *   SOLAPI_API_KEY · SOLAPI_API_SECRET · SOLAPI_PFID · SOLAPI_SENDER
 *   CRON_SECRET
 *   ALIMTALK_EXPIRY_TEMPLATE_ID  (카카오 승인 후 설정. 미설정 시 발송 스킵)
 * 선택:
 *   SITE_URL (기본: https://roysbriefing.vercel.app)
 *   SHOP_NAME (기본: 브리픽)
 */

import { createClient } from "jsr:@supabase/supabase-js@2";

const SOLAPI_API = "https://api.solapi.com";
const SITE_URL = Deno.env.get("SITE_URL") ?? "https://roysbriefing.vercel.app";
const SHOP_NAME = Deno.env.get("SHOP_NAME") ?? "브리픽";

type Target = { id: string; phone: string; name: string | null; paid_until: string };

// ═══ 솔라피 HMAC 인증 ═══
async function solapiAuthHeader(apiKey: string, apiSecret: string): Promise<string> {
  const date = new Date().toISOString();
  const salt = crypto.randomUUID().replace(/-/g, "");
  const msg = date + salt;
  const keyBytes = new TextEncoder().encode(apiSecret);
  const dataBytes = new TextEncoder().encode(msg);
  const cryptoKey = await crypto.subtle.importKey(
    "raw", keyBytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const sigBuf = await crypto.subtle.sign("HMAC", cryptoKey, dataBytes);
  const sig = Array.from(new Uint8Array(sigBuf))
    .map((b) => b.toString(16).padStart(2, "0")).join("");
  return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${sig}`;
}

// ═══ KST 기준 내일 날짜 범위 ═══
// 실행 시점(KST) 기준 "내일"의 00:00 ~ 23:59:59.999 을 UTC ISO로 반환
function tomorrowKstBounds(now: Date): { startIso: string; endIso: string; dateLabel: string } {
  const kstNowMs = now.getTime() + 9 * 3600000;
  const tomorrowKst = new Date(kstNowMs + 86400000);
  const y = tomorrowKst.getUTCFullYear();
  const m = tomorrowKst.getUTCMonth();
  const d = tomorrowKst.getUTCDate();
  // 내일 00:00 KST == UTC(y,m,d,0,0,0) - 9h
  const startMs = Date.UTC(y, m, d, 0, 0, 0) - 9 * 3600000;
  const endMs   = Date.UTC(y, m, d, 23, 59, 59, 999) - 9 * 3600000;
  const mm = String(m + 1).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return {
    startIso: new Date(startMs).toISOString(),
    endIso: new Date(endMs).toISOString(),
    dateLabel: `${y}-${mm}-${dd}`,
  };
}

// ═══ 솔라피 알림톡 발송 ═══
async function solapiSendExpiryAlimtalk(opts: {
  apiKey: string;
  apiSecret: string;
  pfId: string;
  sender: string;
  templateId: string;
  targets: Target[];
  expiryDate: string;          // YYYY-MM-DD
  renewUrl: string;
}): Promise<{ ok: boolean; groupId?: string; raw: unknown; error?: string }> {
  const { apiKey, apiSecret, pfId, sender, templateId, targets, expiryDate, renewUrl } = opts;
  const messages = targets.map((t) => ({
    to: t.phone,
    from: sender,
    type: "ATA",
    kakaoOptions: {
      pfId,
      templateId,
      disableSms: true,
      variables: {
        "#{상점명}": SHOP_NAME,
        "#{만료일}": expiryDate,
      },
      buttons: [{
        buttonType: "WL",
        buttonName: "재구독하기",
        linkMo: renewUrl,
        linkPc: renewUrl,
      }],
    },
  }));
  const auth = await solapiAuthHeader(apiKey, apiSecret);
  try {
    const res = await fetch(`${SOLAPI_API}/messages/v4/send-many`, {
      method: "POST",
      headers: { "Authorization": auth, "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    const j = await res.json();
    if (!res.ok) {
      return { ok: false, raw: j, error: `solapi ${res.status}: ${JSON.stringify(j).slice(0, 400)}` };
    }
    return { ok: true, groupId: j.groupId, raw: j };
  } catch (e) {
    return { ok: false, raw: null, error: e instanceof Error ? e.message : String(e) };
  }
}

// ═══ Handler ═══
Deno.serve(async (req) => {
  try {
    // 자체 인증 (verify_jwt=false로 배포)
    const cronSecret = Deno.env.get("CRON_SECRET");
    const headerSecret = req.headers.get("x-cron-secret")
      ?? (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
    if (!cronSecret || headerSecret !== cronSecret) {
      return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
        status: 401, headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey     = Deno.env.get("SOLAPI_API_KEY");
    const apiSecret  = Deno.env.get("SOLAPI_API_SECRET");
    const pfId       = Deno.env.get("SOLAPI_PFID");
    const sender     = Deno.env.get("SOLAPI_SENDER");
    const templateId = Deno.env.get("ALIMTALK_EXPIRY_TEMPLATE_ID");

    if (!apiKey || !apiSecret || !pfId || !sender) {
      return new Response(JSON.stringify({ ok: false, error: "solapi env missing" }), {
        status: 500, headers: { "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const dryRun = url.searchParams.get("dry") === "1";

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const now = new Date();
    const { startIso, endIso, dateLabel } = tomorrowKstBounds(now);

    // 내일 만료 예정자 조회
    const { data: targets, error: selErr } = await supabase
      .from("subscribers")
      .select("id, phone, name, paid_until")
      .eq("status", "active")
      .gte("paid_until", startIso)
      .lte("paid_until", endIso);

    if (selErr) throw selErr;
    const list = (targets ?? []) as Target[];

    if (dryRun) {
      return new Response(JSON.stringify({
        ok: true, dryRun: true, dateLabel, startIso, endIso, count: list.length,
        phones: list.map((t) => t.phone),
      }), { headers: { "Content-Type": "application/json" } });
    }

    if (!list.length) {
      return new Response(JSON.stringify({ ok: true, dateLabel, count: 0, sent: 0 }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // 템플릿 미승인 시 발송 스킵 (로그만 남김)
    if (!templateId) {
      console.warn("[expiry-notice] ALIMTALK_EXPIRY_TEMPLATE_ID not set — skipping send");
      return new Response(JSON.stringify({
        ok: true, dateLabel, count: list.length, sent: 0,
        skipped: "ALIMTALK_EXPIRY_TEMPLATE_ID not set",
      }), { headers: { "Content-Type": "application/json" } });
    }

    const renewUrl = `${SITE_URL.replace(/\/$/, "")}/renew`;
    const result = await solapiSendExpiryAlimtalk({
      apiKey, apiSecret, pfId, sender, templateId,
      targets: list, expiryDate: dateLabel, renewUrl,
    });

    const batchId = crypto.randomUUID();
    const ok = result.ok;
    const rows = list.map((t) => ({
      subscriber_id: t.id,
      phone: t.phone,
      message: `구독 만료 안내 (만료일 ${dateLabel})`,
      char_count: 0,
      status: ok ? "success" : "fail",
      message_type: "alimtalk",
      template_code: "expiry_notice",
      provider: "solapi",
      provider_code: ok ? (result.groupId ?? null) : null,
      provider_message: ok ? "ok" : (result.error ?? JSON.stringify(result.raw).slice(0, 400)),
      provider_msg_id: ok ? (result.groupId ?? null) : null,
      batch_id: batchId,
    }));
    const { error: logErr } = await supabase.from("send_logs").insert(rows);
    if (logErr) console.error("[expiry-notice] send_logs insert failed", logErr);

    return new Response(JSON.stringify({
      ok,
      dateLabel,
      count: list.length,
      sent: ok ? list.length : 0,
      failed: ok ? 0 : list.length,
      batchId,
      groupId: result.groupId ?? null,
    }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("[expiry-notice]", err);
    return new Response(JSON.stringify({
      ok: false, error: err instanceof Error ? err.message : String(err),
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});
