/**
 * 만료 임박 안내 발송 Edge Function (D-1, KST 20:00 크론)
 *
 * 1) 내일(KST 기준) 안에 만료되는 active 구독자 조회
 * 2) 솔라피 친구톡(CTA) 발송 — 본문에 만료일 자동 삽입 + /renew 링크 버튼
 * 3) send_logs INSERT (template_code='expiry_notice', message_type='friendtalk')
 *
 * ⚠ 친구톡 사용 이유:
 *   - 알림톡 검수에서 '재구매 유도' 표현이 거절됨
 *   - 친구톡은 자유 텍스트 + 버튼 가능, 검수 없음
 *   - 단점: 채널 미친구·광고 수신 거부자에겐 미도달 (해결: /help 안내)
 *
 * 필수 ENV:
 *   SOLAPI_API_KEY · SOLAPI_API_SECRET · SOLAPI_PFID · SOLAPI_SENDER
 *   CRON_SECRET
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
function tomorrowKstBounds(now: Date): { startIso: string; endIso: string; dateLabel: string } {
  const kstNowMs = now.getTime() + 9 * 3600000;
  const tomorrowKst = new Date(kstNowMs + 86400000);
  const y = tomorrowKst.getUTCFullYear();
  const m = tomorrowKst.getUTCMonth();
  const d = tomorrowKst.getUTCDate();
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

// ═══ 본문 ═══
function buildExpiryMessage(expiryDate: string): string {
  return `안녕하세요! ${SHOP_NAME}입니다.

구독 중이신 서비스가 내일(${expiryDate}) 종료될 예정입니다.

${SHOP_NAME}은 자동 결제가 없는 상품으로, 만료 전 재결제하셔야 끊김 없이 뉴스를 받으실 수 있습니다.

아래 버튼을 눌러 재구독을 진행해주세요.`;
}

// ═══ 솔라피 친구톡 발송 ═══
async function solapiSendExpiryFriendtalk(opts: {
  apiKey: string;
  apiSecret: string;
  pfId: string;
  sender: string;
  targets: Target[];
  message: string;
  renewUrl: string;
}): Promise<{ ok: boolean; groupId?: string; raw: unknown; error?: string; failedMessageList: Array<{ to: string; statusMessage: string }> }> {
  const { apiKey, apiSecret, pfId, sender, targets, message, renewUrl } = opts;
  const messages = targets.map((t) => ({
    to: t.phone,
    from: sender,
    text: message,
    type: "CTA",
    kakaoOptions: {
      pfId,
      disableSms: true,
      bms: { targeting: "I" },  // I = 채널 친구만
      buttons: [{
        buttonType: "WL",
        buttonName: "재구독 신청하기",
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
      return {
        ok: false, raw: j, failedMessageList: [],
        error: `solapi ${res.status}: ${JSON.stringify(j).slice(0, 400)}`,
      };
    }
    return {
      ok: true,
      groupId: j.groupId,
      raw: j,
      failedMessageList: j.failedMessageList ?? [],
    };
  } catch (e) {
    return {
      ok: false, raw: null, failedMessageList: [],
      error: e instanceof Error ? e.message : String(e),
    };
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

    const apiKey    = Deno.env.get("SOLAPI_API_KEY");
    const apiSecret = Deno.env.get("SOLAPI_API_SECRET");
    const pfId      = Deno.env.get("SOLAPI_PFID");
    const sender    = Deno.env.get("SOLAPI_SENDER");

    if (!apiKey || !apiSecret || !pfId || !sender) {
      return new Response(JSON.stringify({ ok: false, error: "solapi env missing" }), {
        status: 500, headers: { "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const dryRun = url.searchParams.get("dry") === "1";

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("BRIEFICK_SUPABASE_SECRET_KEY")!,
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

    const message = buildExpiryMessage(dateLabel);

    if (dryRun) {
      return new Response(JSON.stringify({
        ok: true, dryRun: true, dateLabel, startIso, endIso,
        count: list.length, phones: list.map((t) => t.phone),
        charCount: message.length, message,
      }), { headers: { "Content-Type": "application/json" } });
    }

    if (!list.length) {
      return new Response(JSON.stringify({ ok: true, dateLabel, count: 0, sent: 0 }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const renewUrl = `${SITE_URL.replace(/\/$/, "")}/renew`;
    const result = await solapiSendExpiryFriendtalk({
      apiKey, apiSecret, pfId, sender,
      targets: list, message, renewUrl,
    });

    // 부분 실패 처리
    const failedMap = new Map<string, string>();
    for (const f of result.failedMessageList) failedMap.set(f.to, f.statusMessage ?? "");

    const batchId = crypto.randomUUID();
    const apiOk = result.ok;
    const rows = list.map((t) => {
      const partialFail = failedMap.get(t.phone);
      const failed = !apiOk || partialFail !== undefined;
      return {
        subscriber_id: t.id,
        phone: t.phone,
        message,
        char_count: message.length,
        status: failed ? "fail" : "success",
        message_type: "friendtalk",
        template_code: "expiry_notice",
        provider: "solapi",
        provider_code: apiOk ? (result.groupId ?? null) : null,
        provider_message: failed
          ? (partialFail ?? result.error ?? "send failed")
          : "ok",
        provider_msg_id: apiOk ? (result.groupId ?? null) : null,
        batch_id: batchId,
      };
    });
    const { error: logErr } = await supabase.from("send_logs").insert(rows);
    if (logErr) console.error("[expiry-notice] send_logs insert failed", logErr);

    const sent = rows.filter((r) => r.status === "success").length;
    const failedCount = rows.length - sent;

    return new Response(JSON.stringify({
      ok: apiOk,
      dateLabel,
      count: list.length,
      sent,
      failed: failedCount,
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
