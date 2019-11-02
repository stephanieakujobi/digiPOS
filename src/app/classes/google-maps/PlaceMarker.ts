import { Marker, GoogleMap, HtmlInfoWindow, GoogleMapsEvent, MarkerIcon } from '@ionic-native/google-maps';
import { IMapPlace } from 'src/app/interfaces/google-maps/IMapPlace';
import { InfoWindow } from './InfoWindow';

export class PlaceMarker {
    private _place: IMapPlace;
    private _marker: Marker;

    private onSavedCallback: Function;
    private onUnsavedCallback: Function;
    private onRouteCallback: Function;

    private constructor(place: IMapPlace, marker: Marker, onSaved: Function, onUnsaved: Function, onRoute: Function) {
        this._place = place;
        this._marker = marker;

        this.onSavedCallback = onSaved;
        this.onUnsavedCallback = onUnsaved;
        this.onRouteCallback = onRoute;

        this.addPlaceInfoWindow();
    }

    public static async instantiate(map: GoogleMap, place: IMapPlace, onSaved: Function, onUnsaved: Function, onRoute: Function): Promise<PlaceMarker> {
        let placeMarker: PlaceMarker;

        await map.addMarker({ position: place.position }).then((marker: Marker) => {
            marker.setAnimation("DROP");

            if(place.isSaved) {
                marker.setIcon({
                    url: "assets/images/map-icons/business-marker-unreported.png",
                    size: {
                        width: 24,
                        height: 38
                    }
                });
            }

            placeMarker = new PlaceMarker(place, marker, onSaved, onUnsaved, onRoute);
        });

        return placeMarker;
    }

    private addPlaceInfoWindow() {
        const infoWindow = InfoWindow.ForPlaceLocation(this.place,
            wasSaved => {
                if(wasSaved) {
                    this.onSavedCallback(this.place);
                }
                else {
                    this.onUnsavedCallback(this.place);
                }
            },
            () => this.onRouteCallback(this.place)
        );

        this.marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
            infoWindow.open(this.marker);
        });
    }

    public remove() {
        this._place = null;
        this._marker.remove();
    }

    public get place(): IMapPlace {
        return this._place;
    }

    public get marker(): Marker {
        return this._marker;
    }
}