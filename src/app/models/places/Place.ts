import { PlaceSaveState } from '../../classes/places/PlaceSaveState';
import { PlaceInfo } from './PlaceInfo';

/**
 * The representation of a physical place that can be saved, viewed, and edited by users.
 */
export interface Place {
    info: PlaceInfo;
    saveState: PlaceSaveState;
    wasManuallySaved: boolean;
    isReported: boolean;
    dateSaved?: string;
    dateUpdated?: string;
}