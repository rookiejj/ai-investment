/**
 * 관리자 API Edge Function
 *
 * 엔드포인트(모두 POST, body.action으로 라우팅):
 *   action='login'              → { password }           → { ok, token }
 *   action='change_password'    → { currentPassword, newPassword }
 *   action='stats'              → { token }              → 도메인별 통합 집계
 *   action='logs'               → { token, filters }     → { rows, total }
 *   action='subscribers'        → { token, filter? }     → { rows }
 *   action='payments'           → { token, filters? }    → { rows, total }
 *   action='expiring_soon'      → { token, days? }       → { rows } — 만료 임박
 *   action='manual_send'        → { token, subscriberIds } → { ok, sent, failed } — 알림톡
 *   action='daily_send_preview' → { token } → { preview, alreadySent } — 매일 뉴스 친구톡 드라이런
 *   action='daily_send_now'     → { token } → { response } — 매일 뉴스 친구톡 즉시 발송
 *   action='notice_send'        → { token, subscriberIds, message } → { response } — 공지 친구톡(커스텀 본문) 발송
 *
 * 인증: login 외 모든 액션은 token(세션) 필요.
 *       token = HMAC(timestamp:version, ADMIN_SESSION_SECRET) + 만료 확인.
 */

import { createClient } from "jsr:@supabase/supabase-js@2";

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12시간

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, authorization",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function json(body: unknown, init: ResponseInit & { cors: Record<string, string> }) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { ...init.cors, "Content-Type": "application/json" },
  });
}

// ───── Token ─────

async function hmacHex(key: string, data: string): Promise<string> {
  const k = new TextEncoder().encode(key);
  const d = new TextEncoder().encode(data);
  const ck = await crypto.subtle.importKey("raw", k, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", ck, d);
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function issueToken(secret: string): Promise<string> {
  const exp = Date.now() + TOKEN_TTL_MS;
  const payload = `${exp}`;
  const sig = (await hmacHex(secret, payload)).slice(0, 32);
  return `${exp}.${sig}`;
}

async function verifyToken(token: string, secret: string): Promise<boolean> {
  if (!token || !token.includes(".")) return false;
  const [expStr, sig] = token.split(".");
  const exp = parseInt(expStr, 10);
  if (!exp || Date.now() > exp) return false;
  const expected = (await hmacHex(secret, expStr)).slice(0, 32);
  return expected === sig;
}

async function hashPassword(pw: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${pw}:${salt}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// deno-lint-ignore no-explicit-any
async function getStoredHash(supabase: any, salt: string, envPassword: string): Promise<string> {
  const { data } = await supabase.from("admin_settings").select("password_hash").eq("id", 1).maybeSingle();
  if (data?.password_hash) return data.password_hash;
  const hash = await hashPassword(envPassword, salt);
  await supabase.from("admin_settings").insert({ id: 1, password_hash: hash });
  return hash;
}

// ───── 알리고 수동 알림톡 (VPS 프록시 경유) ─────
// SOLAPI에서 알리고로 전환 — IP 화이트리스트 강제 회피 위해 VPS 프록시 경유.
// 등록된 템플릿(UH_6780)과 동일한 본문에 변수 치환해 발송.

const MANUAL_TEMPLATE_BODY =
`안녕하세요! #{상점명} 입니다.

구독을 신청해 주셔서 감사합니다.

뉴스를 받지 못하고 계시거나 다른 문제가 발생하는 경우, 아래 버튼을 통해 문제를 해결 해주세요.`;

async function aligoSendManualAlimtalk(phones: string[]): Promise<{ ok: boolean; mid?: string; error?: string; raw?: unknown }> {
  const proxyUrl    = Deno.env.get("ALIGO_PROXY_ALIMTALK_URL");
  const proxySecret = Deno.env.get("ALIGO_PROXY_SECRET");
  const tplCode     = Deno.env.get("ALIGO_MANUAL_TPL_CODE");
  const siteUrl     = Deno.env.get("SITE_URL") ?? "https://roysbriefing.vercel.app";
  const shopName    = Deno.env.get("SHOP_NAME") ?? "브리픽";
  if (!proxyUrl || !proxySecret || !tplCode) {
    return { ok: false, error: "aligo proxy env missing (ALIGO_PROXY_ALIMTALK_URL/ALIGO_PROXY_SECRET/ALIGO_MANUAL_TPL_CODE)" };
  }

  const helpUrl = `${siteUrl.replace(/\/$/, "")}/help`;
  const message = MANUAL_TEMPLATE_BODY.replace("#{상점명}", shopName);
  const button = {
    button: [{
      name: "문제 해결하기",
      linkType: "WL",
      linkTypeName: "웹링크",
      linkMo: helpUrl,
      linkPc: helpUrl,
    }],
  };

  try {
    const res = await fetch(proxyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Proxy-Secret": proxySecret },
      body: JSON.stringify({ phones, message, tpl_code: tplCode, button }),
    });
    const j = await res.json();
    if (!res.ok || j.code !== 0) {
      return { ok: false, error: `aligo proxy ${res.status} code=${j.code ?? "?"}: ${j.message ?? JSON.stringify(j).slice(0, 300)}`, raw: j };
    }
    return { ok: true, mid: j.info?.mid ? String(j.info.mid) : undefined, raw: j };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

// ───── Handler ─────

Deno.serve(async (req) => {
  const origin = req.headers.get("Origin") ?? "";
  const cors = corsHeaders(origin);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json({ ok: false, error: "method not allowed" }, { status: 405, cors });

  try {
    const body = await req.json().catch(() => ({}));
    const action = String(body.action ?? "");
    const password = Deno.env.get("ADMIN_PASSWORD") ?? "";
    const sessionSecret = Deno.env.get("ADMIN_SESSION_SECRET") ?? "";
    if (!password || !sessionSecret) {
      return json({ ok: false, error: "server misconfigured" }, { status: 500, cors });
    }

    // 초기 비번 검증을 위해 먼저 supabase client 준비
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("BRIEFICK_SUPABASE_SECRET_KEY")!,
    );

    // login
    if (action === "login") {
      if (typeof body.password !== "string") {
        return json({ ok: false, error: "invalid password" }, { status: 401, cors });
      }
      const storedHash = await getStoredHash(supabase, sessionSecret, password);
      const inputHash = await hashPassword(body.password, sessionSecret);
      if (inputHash !== storedHash) {
        return json({ ok: false, error: "invalid password" }, { status: 401, cors });
      }
      const token = await issueToken(sessionSecret);
      return json({ ok: true, token, ttlMs: TOKEN_TTL_MS }, { cors });
    }

    // 이하 액션은 토큰 필수
    const token = String(body.token ?? "");
    if (!(await verifyToken(token, sessionSecret))) {
      return json({ ok: false, error: "unauthorized" }, { status: 401, cors });
    }

    // change_password
    if (action === "change_password") {
      const curPw = String(body.currentPassword ?? "");
      const newPw = String(body.newPassword ?? "");
      if (newPw.length < 4) {
        return json({ ok: false, error: "새 비밀번호는 4자 이상이어야 합니다." }, { status: 400, cors });
      }
      const storedHash = await getStoredHash(supabase, sessionSecret, password);
      const curHash = await hashPassword(curPw, sessionSecret);
      if (curHash !== storedHash) {
        return json({ ok: false, error: "현재 비밀번호가 맞지 않습니다." }, { status: 401, cors });
      }
      const newHash = await hashPassword(newPw, sessionSecret);
      const { error: updErr } = await supabase
        .from("admin_settings")
        .upsert({ id: 1, password_hash: newHash, updated_at: new Date().toISOString() });
      if (updErr) throw updErr;
      return json({ ok: true }, { cors });
    }

    // ─── stats ───
    if (action === "stats") {
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000).toISOString();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000).toISOString();
      const fourteenDaysAgo = new Date(now.getTime() - 14 * 86400000).toISOString();
      const sevenDaysLater = new Date(now.getTime() + 7 * 86400000).toISOString();

      const [subsAll, dlv, sendRows, pay7d, pay30d, expiring] = await Promise.all([
        supabase.from("subscribers").select("status"),
        supabase.from("subscribers").select("delivery_state").eq("status", "active"),
        supabase.from("send_logs").select("sent_at, status, message_type").gte("sent_at", fourteenDaysAgo),
        supabase.from("payments").select("amount").eq("status", "paid").gte("paid_at", sevenDaysAgo),
        supabase.from("payments").select("amount, status").gte("paid_at", thirtyDaysAgo),
        supabase.from("subscribers").select("id", { count: "exact", head: true })
          .eq("status", "active").gte("paid_until", now.toISOString()).lte("paid_until", sevenDaysLater),
      ]);

      // 상태별 카운트
      const statusCounts: Record<string, number> = { active:0, paused:0, expired:0, cancelled:0 };
      for (const r of (subsAll.data ?? [])) {
        const s = (r as { status: string }).status;
        statusCounts[s] = (statusCounts[s] ?? 0) + 1;
      }

      const deliveryStates: Record<string, number> = {};
      for (const r of (dlv.data ?? [])) {
        const s = (r as { delivery_state?: string }).delivery_state ?? "unknown";
        deliveryStates[s] = (deliveryStates[s] ?? 0) + 1;
      }

      // 14일 일별 발송량
      const dailyCounts: Record<string, { success: number; fail: number }> = {};
      let send14Success = 0, send14Fail = 0;
      for (const r of (sendRows.data ?? [])) {
        const row = r as { sent_at: string; status: string };
        const day = row.sent_at.slice(0, 10);
        if (!dailyCounts[day]) dailyCounts[day] = { success: 0, fail: 0 };
        if (row.status === "success") { dailyCounts[day].success++; send14Success++; }
        else if (row.status === "fail") { dailyCounts[day].fail++; send14Fail++; }
      }

      const revenue7d = (pay7d.data ?? []).reduce((s, r) => s + ((r as { amount: number }).amount ?? 0), 0);
      const payCount7d = pay7d.data?.length ?? 0;

      // 30일 결제 통계
      let revenue30d = 0, payCount30d = 0, payFailed30d = 0;
      for (const r of (pay30d.data ?? [])) {
        const row = r as { amount: number; status: string };
        if (row.status === "paid") { revenue30d += row.amount ?? 0; payCount30d++; }
        else if (row.status === "failed") payFailed30d++;
      }

      return json({
        ok: true,
        subscribers: {
          active: statusCounts.active,
          paused: statusCounts.paused,
          expired: statusCounts.expired,
          cancelled: statusCounts.cancelled,
          total: (subsAll.data ?? []).length,
        },
        deliveryStates,
        send: {
          daily14d: dailyCounts,
          success14d: send14Success,
          fail14d: send14Fail,
        },
        payments: {
          revenue7d, payCount7d,
          revenue30d, payCount30d, payFailed30d,
          expiringWithin7d: expiring.count ?? 0,
        },
        // 구버전 호환
        activeSubscribers: statusCounts.active,
        daily14d: dailyCounts,
        revenue7d,
        payCount7d,
      }, { cors });
    }

    // ─── payments ───
    if (action === "payments") {
      const f = (body.filters ?? {}) as Record<string, unknown>;
      let q = supabase.from("payments").select(
        "id, subscriber_id, payment_id, provider, amount, currency, status, order_name, paid_at, created_at",
        { count: "exact" },
      );
      if (typeof f.status === "string" && f.status) q = q.eq("status", f.status);
      if (typeof f.from === "string" && f.from) q = q.gte("created_at", f.from);
      if (typeof f.to === "string" && f.to) q = q.lte("created_at", f.to);
      const limit = Math.min(200, Math.max(1, Number(f.limit ?? 50)));
      const offset = Math.max(0, Number(f.offset ?? 0));
      const { data, count, error } = await q.order("created_at", { ascending: false }).range(offset, offset + limit - 1);
      if (error) throw error;

      // 구독자 조인 (phone, name)
      const ids = Array.from(new Set((data ?? []).map((r) => (r as { subscriber_id: string | null }).subscriber_id).filter(Boolean))) as string[];
      const subMap: Record<string, { phone: string; name: string | null }> = {};
      if (ids.length) {
        const { data: subs } = await supabase.from("subscribers").select("id, phone, name").in("id", ids);
        for (const s of (subs ?? [])) {
          const row = s as { id: string; phone: string; name: string | null };
          subMap[row.id] = { phone: row.phone, name: row.name };
        }
      }
      const rows = (data ?? []).map((r) => {
        const row = r as { subscriber_id: string | null };
        const sub = row.subscriber_id ? subMap[row.subscriber_id] : null;
        return { ...r, phone: sub?.phone ?? null, name: sub?.name ?? null };
      });

      return json({ ok: true, rows, total: count ?? 0, limit, offset }, { cors });
    }

    // ─── expiring_soon ───
    if (action === "expiring_soon") {
      const days = Math.min(30, Math.max(1, Number(body.days ?? 7)));
      const now = new Date();
      const until = new Date(now.getTime() + days * 86400000);
      const { data, error } = await supabase
        .from("subscribers")
        .select("id, phone, name, status, delivery_state, paid_until, subscribed_at")
        .eq("status", "active")
        .gte("paid_until", now.toISOString())
        .lte("paid_until", until.toISOString())
        .order("paid_until", { ascending: true })
        .limit(500);
      if (error) throw error;
      return json({ ok: true, rows: data ?? [], days }, { cors });
    }

    // ─── logs ───
    if (action === "logs") {
      const f = (body.filters ?? {}) as Record<string, unknown>;
      let q = supabase.from("send_logs").select(
        "id, sent_at, phone, status, message_type, template_code, provider, provider_code, provider_message, char_count",
        { count: "exact" },
      );
      if (typeof f.status === "string") q = q.eq("status", f.status);
      if (typeof f.message_type === "string") q = q.eq("message_type", f.message_type);
      if (typeof f.template_code === "string" && f.template_code) q = q.eq("template_code", f.template_code);
      if (typeof f.phone === "string" && f.phone) q = q.eq("phone", f.phone);
      if (typeof f.from === "string" && f.from) q = q.gte("sent_at", f.from);
      if (typeof f.to === "string" && f.to) q = q.lte("sent_at", f.to);
      const limit = Math.min(200, Math.max(1, Number(f.limit ?? 50)));
      const offset = Math.max(0, Number(f.offset ?? 0));
      const { data, count, error } = await q.order("sent_at", { ascending: false }).range(offset, offset + limit - 1);
      if (error) throw error;
      return json({ ok: true, rows: data ?? [], total: count ?? 0, limit, offset }, { cors });
    }

    // ─── subscribers ───
    if (action === "subscribers") {
      const f = (body.filter ?? {}) as Record<string, unknown>;
      let q = supabase.from("subscribers").select(
        "id, phone, name, status, delivery_state, paid_until, subscribed_at, metadata",
      );
      if (typeof f.status === "string") q = q.eq("status", f.status);
      if (typeof f.delivery_state === "string") q = q.eq("delivery_state", f.delivery_state);
      const { data, error } = await q.order("subscribed_at", { ascending: false }).limit(500);
      if (error) throw error;
      return json({ ok: true, rows: data ?? [] }, { cors });
    }

    // ─── daily_send_preview / daily_send_now ─── 매일 뉴스 친구톡 수동 트리거
    if (action === "daily_send_preview" || action === "daily_send_now") {
      const cronSecret = Deno.env.get("CRON_SECRET");
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      if (!cronSecret || !supabaseUrl) {
        return json({ ok: false, error: "CRON_SECRET or SUPABASE_URL missing" }, { status: 500, cors });
      }
      const dryRun = action === "daily_send_preview";
      const rawIds = (body as { subscriberIds?: unknown }).subscriberIds;
      const subscriberIds = Array.isArray(rawIds)
        ? (rawIds as unknown[]).filter((x): x is string => typeof x === "string" && x.length > 0)
        : null;
      const proxyBody = JSON.stringify(subscriberIds && subscriberIds.length > 0 ? { subscriberIds } : {});
      const url = `${supabaseUrl}/functions/v1/daily-send${dryRun ? "?dry=1" : ""}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Cron-Secret": cronSecret },
        body: proxyBody,
      });
      const respBody = await res.json().catch(() => ({}));

      // 프리뷰 시 오늘 이미 발송된 daily_news 로그 카운트도 함께 반환
      if (dryRun) {
        const nowMs = Date.now();
        const kstNowMs = nowMs + 9 * 3600000;
        const kstDay = Math.floor(kstNowMs / 86400000);
        const kstDayStartUtcIso = new Date(kstDay * 86400000 - 9 * 3600000).toISOString();
        const { data: already } = await supabase
          .from("send_logs")
          .select("sent_at")
          .eq("template_code", "daily_news")
          .gte("sent_at", kstDayStartUtcIso)
          .order("sent_at", { ascending: false })
          .limit(1);
        const earliestKstHour = new Date(kstNowMs).getUTCHours();
        return json({
          ok: true,
          status: res.status,
          preview: respBody,
          alreadySentToday: (already?.length ?? 0) > 0,
          alreadySentAt: already?.[0]?.sent_at ?? null,
          isAdRestrictedHour: earliestKstHour < 8 || earliestKstHour >= 21,
        }, { cors });
      }

      return json({
        ok: res.ok && (respBody as { ok?: boolean })?.ok !== false,
        status: res.status,
        response: respBody,
      }, { cors });
    }

    // ─── notice_send ─── 공지 친구톡 즉시 발송 (커스텀 본문)
    if (action === "notice_send") {
      const cronSecret = Deno.env.get("CRON_SECRET");
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      if (!cronSecret || !supabaseUrl) {
        return json({ ok: false, error: "CRON_SECRET or SUPABASE_URL missing" }, { status: 500, cors });
      }
      const rawIds = (body as { subscriberIds?: unknown }).subscriberIds;
      const subscriberIds = Array.isArray(rawIds)
        ? (rawIds as unknown[]).filter((x): x is string => typeof x === "string" && x.length > 0)
        : [];
      const message = typeof (body as { message?: unknown }).message === "string"
        ? ((body as { message: string }).message).trim()
        : "";
      if (!subscriberIds.length) return json({ ok: false, error: "subscriberIds required" }, { status: 400, cors });
      if (!message) return json({ ok: false, error: "message required" }, { status: 400, cors });
      if (message.length > 1000) return json({ ok: false, error: `메시지 길이 ${message.length}자 — 1000자 한도 초과` }, { status: 400, cors });

      const proxyBody = JSON.stringify({ subscriberIds, customMessage: message });
      const url = `${supabaseUrl}/functions/v1/daily-send`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Cron-Secret": cronSecret },
        body: proxyBody,
      });
      const respBody = await res.json().catch(() => ({}));
      return json({
        ok: res.ok && (respBody as { ok?: boolean })?.ok !== false,
        status: res.status,
        response: respBody,
      }, { cors });
    }

    // ─── manual_send ─── (알림톡 ATA, 본문은 검수 승인 템플릿 고정)
    if (action === "manual_send") {
      const ids = Array.isArray(body.subscriberIds) ? body.subscriberIds as string[] : [];
      if (!ids.length) return json({ ok: false, error: "subscriberIds required" }, { status: 400, cors });

      // 구독자 조회
      const { data: targets, error: selErr } = await supabase
        .from("subscribers").select("id, phone, name").in("id", ids);
      if (selErr) throw selErr;
      if (!targets?.length) return json({ ok: false, error: "no target" }, { status: 400, cors });

      const phones = targets.map((t) => (t as { phone: string }).phone);
      const result = await aligoSendManualAlimtalk(phones);

      // send_logs 기록 (알림톡 본문은 템플릿 고정이라 메시지 텍스트는 식별용)
      const batchId = crypto.randomUUID();
      const ok = result.ok;
      const logMessage = "수동 발송 알림톡 (문제 해결 안내)";
      const rows = targets.map((t) => ({
        subscriber_id: (t as { id: string }).id,
        phone: (t as { phone: string }).phone,
        message: logMessage,
        char_count: 0,
        status: ok ? "success" : "fail",
        message_type: "alimtalk",
        template_code: "manual",
        provider: "aligo",
        provider_code: result.mid ?? null,
        provider_message: ok ? "ok" : (result.error ?? "unknown"),
        provider_msg_id: result.mid ?? null,
        batch_id: batchId,
      }));
      await supabase.from("send_logs").insert(rows);

      return json({
        ok,
        sent: ok ? phones.length : 0,
        failed: ok ? 0 : phones.length,
        batchId,
        rawResponse: result.raw,
      }, { cors });
    }

    // ─── system_check_instagram ─── IG 비즈 계정 최근 글 timestamp 조회
    if (action === "system_check_instagram") {
      const igToken = Deno.env.get("META_ACCESS_TOKEN");
      const igUser = Deno.env.get("IG_BUSINESS_USER_ID");
      if (!igToken || !igUser) {
        return json({ ok: false, error: "META_ACCESS_TOKEN or IG_BUSINESS_USER_ID missing in env" }, { status: 500, cors });
      }
      const url = `https://graph.facebook.com/v21.0/${igUser}/media?fields=id,timestamp,caption,media_type,permalink&limit=5&access_token=${igToken}`;
      try {
        const r = await fetch(url);
        const j = await r.json();
        if (!r.ok || j.error) {
          return json({ ok: false, error: j.error?.message || `Meta API ${r.status}` }, { status: 500, cors });
        }
        const posts = (j.data || []).slice(0, 5).map((p: Record<string, unknown>) => ({
          id: p.id,
          timestamp: p.timestamp,
          type: p.media_type,
          permalink: p.permalink,
          captionPrefix: typeof p.caption === "string" ? p.caption.split("\n")[0].slice(0, 80) : "",
        }));
        return json({ ok: true, posts }, { cors });
      } catch (e) {
        return json({ ok: false, error: (e as Error).message }, { status: 500, cors });
      }
    }

    // ─── system_retrigger_instagram ─── GitHub workflow_dispatch로 instagram-post 재실행
    // KST 시간으로 mode 자동(05~12 carousel / 13~23 reels / 그 외 all)
    if (action === "system_retrigger_instagram") {
      const ghToken = Deno.env.get("GITHUB_TOKEN");
      if (!ghToken) {
        return json({ ok: false, error: "GITHUB_TOKEN missing in env (Actions:write 권한 PAT 필요)" }, { status: 500, cors });
      }
      const kstHour = new Date(Date.now() + 9 * 3600 * 1000).getUTCHours();
      let mode = "all";
      if (kstHour >= 5 && kstHour <= 12) mode = "carousel";
      else if (kstHour >= 13 && kstHour <= 23) mode = "reels";
      const url = "https://api.github.com/repos/rookiejj/ai-investment/actions/workflows/instagram-post.yml/dispatches";
      try {
        const r = await fetch(url, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${ghToken}`,
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ref: "main", inputs: { mode, dry_run: "false" } }),
        });
        if (!r.ok) {
          const errText = await r.text();
          return json({ ok: false, error: `GitHub API ${r.status}: ${errText.slice(0, 300)}` }, { status: 500, cors });
        }
        // GitHub workflow_dispatch는 204 No Content 반환 — 성공 시 body 없음
        return json({ ok: true, mode, kstHour, message: `${mode} 모드로 instagram-post 워크플로 재실행 시작 — Actions UI에서 진행 상태 확인 가능` }, { cors });
      } catch (e) {
        return json({ ok: false, error: (e as Error).message }, { status: 500, cors });
      }
    }

    return json({ ok: false, error: `unknown action: ${action}` }, { status: 400, cors });
  } catch (err) {
    console.error("[admin-api]", err);
    return json({ ok: false, error: err instanceof Error ? err.message : String(err) }, { status: 500, cors });
  }
});
