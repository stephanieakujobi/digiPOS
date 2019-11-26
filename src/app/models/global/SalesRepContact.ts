import { Contact } from './Contact';

/**
 * The representation of contact information for a SalesRep using the application.
 * Extends Contact.
 */
export interface SalesRepContact extends Contact {
    jobTitle: string;
}