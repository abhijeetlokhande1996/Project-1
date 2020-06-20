export interface EquityCollectionEntity {
  folioNumber: number;
  holdings?: (HoldingsEntity)[] | null;
}
export interface HoldingsEntity {
  clientName: string;
  companyName:string;
  quantity: number;
  Rate: number;
  amount: number;
}
