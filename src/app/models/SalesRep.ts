import { Place } from './places/Place';
import { SalesRepContact } from './global/SalesRepContact';

/**
 * The representation of a sales representative user, containing their contact information and saved Places.
 * A SalesRep instance is created when a user logs into the app, containing their saved data.
 */
export interface SalesRep {
    info: SalesRepContact;
    savedPlaces: Place[];
}