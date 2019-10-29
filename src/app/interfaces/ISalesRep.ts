import { IContact } from './businesses/IContact';
import { IBusiness } from './businesses/IBusiness';

/**
 * The representation of a sales representative user, containing their contact information and saved Businesses.
 */
export interface ISalesRep {
    id?: string;
    info: IContact;
    profilePicUrl: string;
    savedBusinesses: IBusiness[];
}