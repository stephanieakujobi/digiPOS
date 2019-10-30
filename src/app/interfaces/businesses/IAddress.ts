import { LatLng } from '@ionic-native/google-maps';

/**
 * The representation of a physical address.
 */
export interface IAddress {
    street: string;
    city: string;
    region: string;
    country: string;
    postalCode: string;
    fullAddress: string;
    coordinates?: LatLng;
}