export interface Scheme {
  schemeName: string;
  freqType: string;
  startDate: Date;
  endDate: Date;
  installmentAmt: number;
}
export interface SipInterface {
  clientName: string;
  regDate: Date;
  folioNo: number;
  schemes: Array<Scheme>;
}

export interface IFSipInterface {
  clientName: string;
  regDate: Date | string;
  folioNo: number | string;
  schemeName: string;
  freqType: string;
  startDate: Date | string;
  endDate: Date | string;
  installmentAmt: number | string;
}
