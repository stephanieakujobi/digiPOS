import { LatLng } from '@ionic-native/google-maps';

/**
 * The representation of a physical address.
 */
export interface IAddress {
    addressString: string;
    position?: LatLng;
}