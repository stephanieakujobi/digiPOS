import { PlaceInfo } from './PlaceInfo';
import { Contact } from './Contact';

/**
 * The representation of a Place that has been reported to CPOS by a sales representative using the app.
 */
export interface ReportedPlace {
    info: PlaceInfo;
    reportedBy: Contact;
    dateReported: string;
}