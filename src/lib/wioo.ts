/**
 * Producers confirmed as Women in Olive Oil members.
 * Add a producer's id here after membership is confirmed with WIOO.
 */
export const WIOO_PRODUCER_IDS: string[] = [];

export function isWiooMember(producerId?: string | null): boolean {
  return !!producerId && WIOO_PRODUCER_IDS.includes(producerId);
}
