// 결제 완료 알림톡 발송 (알리고 VPS 프록시 경유) — 공용.
//
// payment-confirm(클라이언트 복귀 정상 흐름)과 payment-webhook(orphan 복구 안전망)이
// 모두 이 함수를 호출한다. 둘 중 먼저 결제를 풀처리하는 쪽이 알림톡을 보낸다(멱등 가드로
// 한쪽만 풀처리되므로 정확히 1회 발송). 분리 전엔 webhook이 먼저 처리하면 알림톡이 누락됐다(2026-06-06).
//
// 동적 IP의 Edge Function은 알리고 IP 화이트리스트를 통과 못 해 VPS 프록시를 경유한다.
// env: ALIGO_PROXY_ALIMTALK_URL · ALIGO_PROXY_SECRET · ALIGO_PAYMENT_TPL_CODE

const SHOP_NAME = "브리픽";

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
