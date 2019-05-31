export interface INetworkStats {
  coins: { released?: number };
  blocks: { amount?: number };
  transactions: { amount?: number; totalvalue?: number | null };
}
