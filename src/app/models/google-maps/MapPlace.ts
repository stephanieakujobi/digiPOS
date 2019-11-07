import { ILatLng } from '@ionic-native/google-maps';

/**
 * The representation of a Place viewed from a GoogleMap.
 */
export interface MapPlace {
    name: string;
    address: string;
    position: ILatLng;
    isSaved: boolean;
    isReported: boolean;
}