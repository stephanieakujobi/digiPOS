import { BusinessSaveState } from '../../classes/businesses/BusinessSaveState';
import { IContact } from './IContact';
import { IAddress } from './IAddress';

/**
 * The representation of a physical place that can be saved, viewed, and edited by users.
 */
export interface IBusiness {
    name: string;
    address: IAddress;
    owner: IContact;
    contactPerson: IContact;
    currentProvider: string;
    notes: string;
    saveState: BusinessSaveState;
    wasManuallySaved: boolean;
    isReported: boolean;
}