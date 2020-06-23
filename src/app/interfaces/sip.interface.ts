export interface Scheme {
  schemeName: string;
  freqType?: string;
  startDate: Date;
  endDate?: Date;
  installmentAmt: number;
  folioNumber: number;
  amt: number | string;
  units: number;
  nav: number;
}
export interface SipInterface {
  id: number;
  name: string;

  schemes: Array<Scheme>;
}

export interface IFSipInterface {
  id: number;
  name: string;

  folioNumber: number | string;
  schemeName: string;
  startDate: Date | string;
  endDate?: Date | string;
  amt: number | string;
  units: number;
  nav: number;
}
