export interface IAddEquity {
  folioNumber: number;
  clientName: string;
  companyName: string;
  quantity: number;
  rate: number;
  amt: number;
  purchaseDate: Date | string;
  isin: string;
  symbol: string;
}
