import { ILatLng } from '@ionic-native/google-maps';

export interface IBusinessMapLoc {
    name: string;
    address: string;
    position: ILatLng;
    isSaved: boolean;
}