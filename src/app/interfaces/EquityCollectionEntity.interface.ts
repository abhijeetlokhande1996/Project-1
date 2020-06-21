export interface IEquityCollectionEntity {
  folioNo: number;
  name: string;
  holdings: HoldingsEntity[];
}
export interface HoldingsEntity {
  name: string;
  companyName: string;
  quantity: number;
  rate?: number;
  amount: number;
  purchaseDate: Date | string;
}

export interface IFEquityCollectionEntity {
  folioNo: number;
  name: string;
  companyName: string;
  quantity: number;
  rate?: number;
  amount: number;
  purchaseDate: Date | string;
}
