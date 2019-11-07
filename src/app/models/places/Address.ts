import { ILatLng } from '@ionic-native/google-maps';

/**
 * The representation of a physical address.
 */
export interface Address {
    addressString: string;
    position?: ILatLng;
}