/**
 * 프로모 이벤트 공통 로직.
 *
 * 사용처:
 *   - payment-confirm: 결제 시 적용 가능한 이벤트 1개 결정 + redemption 기록
 *   - check-subscription: UI 표시용 — 이 번호가 받을 수 있는 이벤트 목록
 *
 * 정책:
 *   - 같은 이벤트는 번호당 1회 (DB unique constraint 로 강제)
 *   - 결제 시 적용 가능한 이벤트가 여럿이면 가장 큰 보너스 1개만 — stacking 안 함
 *   - 합산 보너스가 필요하면 별도 이벤트(예: bonus_days=10)로 발행
 */

export interface PromoEvent {
  id: number;
  code: string;
  name: string;
  bonus_days: number;
  bonus_months?: number;   // 캘린더 월 보너스(setMonth, 28/30/31 자동). 컬럼 없으면 undefined→0. bonus_days 와 합산.
  eligible_for: "first_payment" | "all" | "returning";
}

export interface UserContext {
  hadPriorPayment: boolean;   // subscribers.last_payment_id IS NOT NULL
  isReturning: boolean;       // subscribers 가 존재하면서 status !== 'active'
}

// 어떤 supabase 클라이언트 형식이든 받기 위해 타입 자체는 any 로 처리 (SupabaseClient<Database> 의 generics 분기 회피)
// deno-lint-ignore no-explicit-any
type Sb = any;

/**
 * 현재 시점에 활성화된 promo_events.
 * active=true AND starts_at <= now AND (ends_at IS NULL OR ends_at > now)
 */
export async function getActiveEvents(supabase: Sb): Promise<PromoEvent[]> {
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from("promo_events")
    .select("*")   // bonus_months 컬럼이 없어도(미추가 상태) 안 깨지도록 * 사용
    .eq("active", true)
    .lte("starts_at", nowIso)
    .or(`ends_at.is.null,ends_at.gt.${nowIso}`);
  if (error) throw error;
  return (data ?? []) as PromoEvent[];
}

/**
 * 사용자 컨텍스트(첫 결제 여부 등)에 이벤트 자격 조건 매칭.
 */
export function matchEligibility(event: PromoEvent, ctx: UserContext): boolean {
  switch (event.eligible_for) {
    case "first_payment": return !ctx.hadPriorPayment;
    case "all":           return true;
    case "returning":     return ctx.isReturning;
    default:              return false;
  }
}

/**
 * 특정 전화번호가 이미 redeem 한 이벤트 ID 집합.
 */
export async function getRedeemedEventIds(supabase: Sb, phone: string): Promise<Set<number>> {
  const { data, error } = await supabase
    .from("promo_redemptions")
    .select("event_id")
    .eq("phone", phone);
  if (error) throw error;
  return new Set(((data ?? []) as { event_id: number }[]).map((r) => r.event_id));
}

/**
 * UI 표시 / 적용 후보 — 자격 매칭 + 미수령 이벤트, 보너스 큰 순.
 */
export async function getEligibleEvents(
  supabase: Sb,
  phone: string,
  ctx: UserContext,
): Promise<PromoEvent[]> {
  const events = await getActiveEvents(supabase);
  const redeemed = await getRedeemedEventIds(supabase, phone);
  return events
    .filter((e) => matchEligibility(e, ctx))
    .filter((e) => !redeemed.has(e.id))
    // 보너스 큰 순 — 월은 ~31일로 환산해 비교(정렬용 근사치)
    .sort((a, b) => ((b.bonus_months ?? 0) * 31 + b.bonus_days) - ((a.bonus_months ?? 0) * 31 + a.bonus_days));
}

/**
 * 결제 시점에 실제로 적용할 1개 이벤트 결정.
 * 적용 가능한 이벤트가 없으면 null.
 */
export async function pickBonusEvent(
  supabase: Sb,
  phone: string,
  ctx: UserContext,
): Promise<PromoEvent | null> {
  const eligible = await getEligibleEvents(supabase, phone, ctx);
  return eligible[0] ?? null;
}

/**
 * 이벤트 적용 기록.
 * 동시 결제 race condition: unique constraint 위반 시 silent skip (이미 적용된 것으로 간주).
 */
export async function recordRedemption(
  supabase: Sb,
  event: PromoEvent,
  opts: { subscriberId: string; phone: string; paymentId?: string | null },
): Promise<void> {
  const { error } = await supabase
    .from("promo_redemptions")
    .insert({
      event_id: event.id,
      subscriber_id: opts.subscriberId,
      phone: opts.phone,
      payment_id: opts.paymentId ?? null,
      bonus_days_applied: event.bonus_days,
    });
  if (error) {
    const msg = String((error as { message?: string }).message ?? "");
    // 23505 = unique_violation; race condition 으로 다른 요청이 먼저 insert 한 경우
    if (msg.includes("duplicate") || msg.includes("23505")) return;
    throw error;
  }
}
