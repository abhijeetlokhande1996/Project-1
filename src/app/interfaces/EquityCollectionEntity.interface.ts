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
  amt: number;
  purchaseDate: Date | string;
  isin: string;
  symbol: string;
}

export interface IFEquityCollectionEntity {
  folioNo: number;
  name: string;
  companyName: string;
  quantity: number;
  rate?: number;
  amt: number;
  purchaseDate: Date | string;
  isin: string;
  symbol: string;
}
