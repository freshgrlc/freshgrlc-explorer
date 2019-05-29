export interface INetworkStats {
  blocks: {amount?: number};
  transactions: {amount?: number, totalvalue?: number | null}
}
