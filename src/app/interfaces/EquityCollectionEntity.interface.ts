export interface IEquityCollectionEntity {
  id: number;
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
  id: number;
  name: string;
  companyName: string;
  quantity: number;
  rate?: number;
  amt: number;
  purchaseDate: Date | string;
  isin: string;
  symbol: string;
}
