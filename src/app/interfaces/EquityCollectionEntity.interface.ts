export interface EquityCollectionEntity {
  id?: number;
  holdings: HoldingsEntity[];
}
export interface HoldingsEntity {
  clientName: string;
  companyName: string;
  quantity: number;
  rate?: number;
  amount: number;
  purchaseDate: Date | string;
}
