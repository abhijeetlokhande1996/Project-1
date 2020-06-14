import { Scheme } from './sip.interface';

export interface IMutualFund {
    clientName: string;
    regDate: Date;
    folioNo: number;
    schemes: Array<Scheme>;

}