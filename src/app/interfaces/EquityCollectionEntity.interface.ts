export interface IEquityCollectionEntity {
  folioNumber: number;
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

export interface IFEquityCollectionEntity {
  folioNumber: number;
  clientName: string;
  companyName: string;
  quantity: number;
  rate?: number;
  amount: number;
  purchaseDate: Date | string;
}
