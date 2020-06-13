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
