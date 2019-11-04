import { IBusinessInfo } from './IBusinessInfo';
import { IContact } from './IContact';

export interface IReportedBusiness {
    info: IBusinessInfo;
    reportedBy: IContact;
    dateReported: string;
}