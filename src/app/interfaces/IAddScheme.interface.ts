export interface IAddScheme {
  folioNumber: number;
  schemeName: string;
  schemeCode: string;
  startDate: Date;

  amt: number;
  nav: number;
  mFundFamily: string;
  units: string;
  collection?: string;
}
