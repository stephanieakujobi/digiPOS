import { ILatLng } from '@ionic-native/google-maps';

export interface IMapPlace {
    name: string;
    address: string;
    position: ILatLng;
    isSaved: boolean;
}