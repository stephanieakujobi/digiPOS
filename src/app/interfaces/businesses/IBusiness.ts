import { BusinessSaveState } from '../../classes/businesses/BusinessSaveState';
import { IBusinessInfo } from './IBusinessInfo';

/**
 * The representation of a physical place that can be saved, viewed, and edited by users.
 */
export interface IBusiness {
    info: IBusinessInfo;
    saveState: BusinessSaveState;
    wasManuallySaved: boolean;
    isReported: boolean;
}