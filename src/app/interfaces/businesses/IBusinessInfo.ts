import { IContact } from './IContact';
import { IAddress } from './IAddress';

export interface IBusinessInfo {
    name: string;
    address: IAddress;
    owner: IContact;
    contactPerson: IContact;
    currentProvider: string;
    notes: string;
}