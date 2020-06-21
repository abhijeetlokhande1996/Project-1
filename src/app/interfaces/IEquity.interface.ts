export interface IEquity {
  folioNumber: number;
  clientName: string;
  companyName: string;
  quantity: number;
  rate: number;
  amount: number;
  purchaseDate: Date | string;
}
