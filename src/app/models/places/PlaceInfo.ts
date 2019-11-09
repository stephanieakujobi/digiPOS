import { Contact } from './Contact';
import { Address } from './Address';

/**
 * The container representing the information about a Place that was filled in by the user.
 * This is the information that CPOS requests from their sales representatives about a place.
 */
export interface PlaceInfo {
    name: string;
    address: Address;
    owner: Contact;
    contactPerson: Contact;
    currentProvider: string;
    notes: string;
}
