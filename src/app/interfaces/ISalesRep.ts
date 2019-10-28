import { IContact } from './businesses/IContact';
import { IBusiness } from './businesses/IBusiness';

export interface ISalesRep {
    id?: string;
    info: IContact;
    profilePicUrl: string;
    savedBusinesses: IBusiness[];
}