export interface Scheme {
  schemeName: string;
  freqType: string;
  startDate: Date;
  endDate: Date;
  installmentAmt: number;
  folioNo: number;
  amt: number | string;
  units: number;
  nav: number;
}
export interface SipInterface {
  id: number;
  clientName: string;
  regDate: Date;
  schemes: Array<Scheme>;
}

export interface IFSipInterface {
  id: number;
  clientName: string;
  regDate: Date | string;
  folioNo: number | string;
  schemeName: string;
  freqType: string;
  startDate: Date | string;
  endDate: Date | string;
  amt: number | string;
  units: number;
  nav: number;
}
