// 알림톡 발송 공용 모듈 (알리고 VPS 프록시 경유)
//
// 결제 완료(sendPaymentAlimtalk) · 무료 체험 시작(sendTrialAlimtalk) 두 가지.
// 동적 IP의 Edge Function은 알리고 IP 화이트리스트를 통과 못 해 VPS 프록시를 경유한다.
//
// payment-confirm(클라이언트 복귀)과 payment-webhook(orphan 복구 안전망)이
// sendPaymentAlimtalk를 공유. 둘 중 먼저 결제를 풀처리하는 쪽이 발송(멱등 가드).
//
// env: ALIGO_PROXY_ALIMTALK_URL · ALIGO_PROXY_SECRET
//      · ALIGO_PAYMENT_TPL_CODE (결제용)
//      · ALIGO_TRIAL_TPL_CODE   (무료 체험용)

const SHOP_NAME = "브리픽";

// 알리고 콘솔 등록 템플릿과 동일 문구여야 통과. #{만료일} 치환.
const TRIAL_TEMPLATE_BODY =
`안녕하세요! 브리픽 입니다.

14일 무료 체험이 시작됐습니다.

내일 아침 8시부터 미국·한국 마켓 브리핑을 카카오톡으로 받아보실 수 있습니다.

체험 만료일은 #{만료일} 입니다. 자동 결제가 없으므로 계속 이용하시려면 만료 전에 브리픽에서 결제해 주세요.`;

// 알리고 콘솔 등록 템플릿(UH_6779)과 동일 문구여야 통과. #{상점명}·#{상품명}·#{만료일} 치환.
const PAYMENT_TEMPLATE_BODY =
`안녕하세요! #{상점명} 입니다.

#{상품명} 결제가 완료되었습니다.

내일부터 뉴스를 받아보실 수 있으며, 고객님의 서비스 제공 만료일은 #{만료일} 입니다.

자동 결제가 되지 않는 상품으로, 만료일 전에 재결제가 필요합니다.`;

export async function sendPaymentAlimtalk(opts: {
  phone: string;
  expiryDate: string;   // YYYY-MM-DD (KST)
  productName: string;
}): Promise<{ ok: boolean; mid?: string; error?: string }> {
  const proxyUrl    = Deno.env.get("ALIGO_PROXY_ALIMTALK_URL");
  const proxySecret = Deno.env.get("ALIGO_PROXY_SECRET");
  const tplCode     = Deno.env.get("ALIGO_PAYMENT_TPL_CODE");
  if (!proxyUrl || !proxySecret || !tplCode) {
    return { ok: false, error: "aligo proxy env missing (ALIGO_PROXY_ALIMTALK_URL/ALIGO_PROXY_SECRET/ALIGO_PAYMENT_TPL_CODE)" };
  }

  const message = PAYMENT_TEMPLATE_BODY
    .replace("#{상점명}", SHOP_NAME)
    .replace("#{상품명}", opts.productName)
    .replace("#{만료일}", opts.expiryDate);

  // AC(채널추가) 버튼 — 등록 템플릿 버튼명과 정확히 일치해야 노출(공백 한 칸도 안 됨).
  const button = { button: [{ name: "채널추가", linkType: "AC", linkTypeName: "채널추가" }] };

  try {
    const res = await fetch(proxyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Proxy-Secret": proxySecret },
      body: JSON.stringify({ phones: [opts.phone], message, tpl_code: tplCode, button }),
    });
    const j = await res.json();
    if (!res.ok || j.code !== 0) {
      return { ok: false, error: `aligo proxy ${res.status} code=${j.code ?? "?"}: ${j.message ?? JSON.stringify(j).slice(0, 300)}` };
    }
    return { ok: true, mid: j.info?.mid ? String(j.info.mid) : undefined };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function sendTrialAlimtalk(opts: {
  phone: string;
  trialEndsDate: string;  // YYYY-MM-DD (KST)
}): Promise<{ ok: boolean; mid?: string; error?: string }> {
  const proxyUrl    = Deno.env.get("ALIGO_PROXY_ALIMTALK_URL");
  const proxySecret = Deno.env.get("ALIGO_PROXY_SECRET");
  const tplCode     = Deno.env.get("ALIGO_TRIAL_TPL_CODE");
  if (!proxyUrl || !proxySecret || !tplCode) {
    return { ok: false, error: "aligo proxy env missing (ALIGO_TRIAL_TPL_CODE)" };
  }

  const message = TRIAL_TEMPLATE_BODY.replace("#{만료일}", opts.trialEndsDate);
  const button = { button: [{ name: "채널추가", linkType: "AC", linkTypeName: "채널추가" }] };

  try {
    const res = await fetch(proxyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Proxy-Secret": proxySecret },
      body: JSON.stringify({ phones: [opts.phone], message, tpl_code: tplCode, button }),
    });
    const j = await res.json();
    if (!res.ok || j.code !== 0) {
      return { ok: false, error: `aligo proxy ${res.status} code=${j.code ?? "?"}: ${j.message ?? JSON.stringify(j).slice(0, 300)}` };
    }
    return { ok: true, mid: j.info?.mid ? String(j.info.mid) : undefined };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
