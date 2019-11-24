import { PlaceInfo } from './PlaceInfo';
import { SalesRepContact } from '../global/SalesRepContact';

/**
 * The representation of a Place that has been reported to CPOS by a sales representative using the app.
 */
export interface ReportedPlace {
    info: PlaceInfo;
    reportedBy: SalesRepContact;
    dateReported: string;
}