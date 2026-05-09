/**
 * 만료 임박 안내 발송 Edge Function (D-1, KST 20:00 크론)
 *
 * 1) 내일(KST 기준) 안에 만료되는 active 구독자 조회
 * 2) 알리고 친구톡 발송 (VPS 프록시 경유) — 본문에 만료일·재구독 URL 인라인
 * 3) send_logs INSERT (template_code='expiry_notice', message_type='friendtalk')
 *
 * ⚠ 친구톡 사용 이유:
 *   - 알림톡 검수에서 '재구매 유도' 표현이 거절됨
 *   - 친구톡은 자유 텍스트, 검수 없음
 *   - 단점: 채널 미친구·광고 수신 거부자에겐 미도달 (해결: /help 안내)
 *
 * ⚠ 알리고는 IP 화이트리스트 강제라 VPS 프록시(proxy.briefick.com, 115.68.224.225) 경유.
 *   알리고 친구톡 API의 버튼(WL) 파라미터는 VPS 프록시가 현재 미지원이라
 *   본문에 URL 텍스트로 박음 — 친구톡은 URL을 자동 클릭 가능 링크로 파싱.
 *
 * 필수 ENV:
 *   ALIGO_PROXY_URL · ALIGO_PROXY_SECRET · CRON_SECRET
 * 선택:
 *   SITE_URL (기본: https://briefick.com)
 *   SHOP_NAME (기본: 브리픽)
 */

import { createClient } from "jsr:@supabase/supabase-js@2";

const SITE_URL = Deno.env.get("SITE_URL") ?? "https://briefick.com";
const SHOP_NAME = Deno.env.get("SHOP_NAME") ?? "브리픽";

type Target = { id: string; phone: string; name: string | null; paid_until: string };

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

// ═══ 알리고 프록시 호출 (VPS 경유) ═══
type AligoSendResult = {
  code: number;
  message: string;
  info: {
    type?: string;
    mid?: number;
    current?: string;
    unit?: number;
    total?: number;
    scnt?: number;
    fcnt?: number;
  } | null;
  raw: unknown;
};

async function aligoSendFriendtalk(opts: {
  proxyUrl: string;
  proxySecret: string;
  receivers: Target[];
  message: string;
  buttonName?: string;
  buttonUrl?: string;
}): Promise<AligoSendResult> {
  const { proxyUrl, proxySecret, receivers, message, buttonName, buttonUrl } = opts;
  const phones = receivers.map((r) => r.phone);
  // 친구톡 버튼 — 알리고 /akv10/friend/send/ button_1 JSON 형식.
  // VPS 프록시가 button 필드를 받아 알리고 API에 그대로 forward 한다고 가정.
  const button = (buttonName && buttonUrl) ? {
    button: [{
      name: buttonName,
      linkType: "WL",
      linkTypeName: "웹링크",
      linkMo: buttonUrl,
      linkPc: buttonUrl,
    }],
  } : undefined;
  const res = await fetch(proxyUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Proxy-Secret": proxySecret,
    },
    body: JSON.stringify({ phones, message, ...(button ? { button } : {}) }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`aligo proxy ${res.status}: ${JSON.stringify(json).slice(0, 400)}`);
  }
  return {
    code: Number(json.code ?? -1),
    message: typeof json.message === "string" ? json.message : "",
    info: json.info ?? null,
    raw: json,
  };
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

    const proxyUrl    = Deno.env.get("ALIGO_PROXY_URL");
    const proxySecret = Deno.env.get("ALIGO_PROXY_SECRET");
    if (!proxyUrl || !proxySecret) {
      return new Response(JSON.stringify({ ok: false, error: "aligo proxy env missing" }), {
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

    const renewUrl = `${SITE_URL.replace(/\/$/, "")}/renew`;
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

    let result: AligoSendResult | null = null;
    let errMsg: string | null = null;
    try {
      result = await aligoSendFriendtalk({
        proxyUrl, proxySecret, receivers: list, message,
        buttonName: "재구독 하러가기",
        buttonUrl: renewUrl,
      });
      if (result.code !== 0) errMsg = `aligo code=${result.code}: ${result.message}`;
    } catch (e) {
      errMsg = e instanceof Error ? e.message : String(e);
    }

    // 알리고는 per-phone 실패 정보를 안 줌 — 부분 실패면 어느 폰이 실패했는지 모름.
    // - 전체 실패(errMsg): 모두 status=fail · delivery_state=fail
    // - 부분 실패(fcnt > 0): status=success(그룹 전송 자체는 성공) + delivery_state=unknown
    // - 전체 성공: 모두 ok
    const fcnt = result?.info?.fcnt ?? 0;
    const total = result?.info?.total ?? list.length;
    const partialFailed = !errMsg && fcnt > 0;
    const groupId = result?.info?.mid ? String(result.info.mid) : null;

    const batchId = crypto.randomUUID();
    const rows = list.map((t) => {
      const failed = !!errMsg;
      return {
        subscriber_id: t.id,
        phone: t.phone,
        message,
        char_count: message.length,
        status: failed ? "fail" : "success",
        message_type: "friendtalk",
        template_code: "expiry_notice",
        provider: "aligo",
        provider_code: groupId,
        provider_message: errMsg ?? (partialFailed ? `partial: ${fcnt}/${total} failed` : "ok"),
        provider_msg_id: groupId,
        batch_id: batchId,
      };
    });
    const { error: logErr } = await supabase.from("send_logs").insert(rows);
    if (logErr) console.error("[expiry-notice] send_logs insert failed", logErr);

    // delivery_state 일괄 갱신 (unknown은 갱신 skip)
    if (!errMsg && !partialFailed) {
      await supabase
        .from("subscribers")
        .update({ delivery_state: "ok" })
        .in("id", list.map((t) => t.id));
    } else if (errMsg) {
      await supabase
        .from("subscribers")
        .update({ delivery_state: "fail" })
        .in("id", list.map((t) => t.id));
    }

    const sent = rows.filter((r) => r.status === "success").length;
    const failedCount = rows.length - sent;

    return new Response(JSON.stringify({
      ok: !errMsg,
      dateLabel,
      count: list.length,
      sent,
      failed: failedCount,
      partial: partialFailed ? fcnt : 0,
      batchId,
      groupId,
    }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("[expiry-notice]", err);
    return new Response(JSON.stringify({
      ok: false, error: err instanceof Error ? err.message : String(err),
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});
