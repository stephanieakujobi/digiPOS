import { IContact } from './businesses/IContact';
import { IBusiness } from './businesses/IBusiness';
import { Business } from '../models/businesses/Business';

export interface ISalesRep {
    id?: string;
    info: IContact;
    profilePicUrl: string;
    savedBusinesses: Business[];
}