import { Marker, GoogleMap, GoogleMapsEvent, MarkerIcon, HtmlInfoWindow, MarkerOptions } from '@ionic-native/google-maps';
import { MapPlace } from 'src/app/models/google-maps/MapPlace';
import { InfoWindow } from './InfoWindow';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

/**
 * A PlaceMarker contains a reference to a Marker that is associated with a MapPlace.
 * When a PlaceMarker is clicked on by the user, an InfoWindow containing the MapPlace's data will be displayed to them.
 * A PlaceMarker cannot be instantiated like usual, as it is an asynchronous operation. The static "instantiate" function must be called instead.
 */
export class PlaceMarker implements OnDestroy {
    private _place: MapPlace;
    private _marker: Marker;
    private infoWindow: HtmlInfoWindow;

    private onSavedCallback: Function;
    private onUnsavedCallback: Function;
    private onRouteCallback: Function;

    private subscriptions: Subscription;

    /**
     * Creates a new PlaceMarker.
     * @param place The MapPlace associated with this PlaceMarker.
     * @param marker The Marker that can be shown on a GoogleMap.
     * @param onSaved A callback function for when the user saves this PlaceMarker's MapPlace.
     * @param onUnsaved A callback function for when the user un-saves this PlaceMarker's MapPlace.
     * @param onRoute A callback function for when the user starts a route for this PlaceMarler's MapPlace.
     */
    private constructor(place: MapPlace, marker: Marker, onSaved: Function, onUnsaved: Function, onRoute: Function) {
        this._place = place;
        this._marker = marker;

        this.onSavedCallback = onSaved;
        this.onUnsavedCallback = onUnsaved;
        this.onRouteCallback = onRoute;

        this.subscriptions = new Subscription();

        this.addPlaceInfoWindow();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * Asynchronously instantiates a new PlaceMarker.
     * @param map The GoogleMap to add the PlaceMarker's Marker onto.
     * @param place The MapPlace whose data will be shown in the InfoWindow of the PlaceMarker's Marker when clicked on by the user.
     * @param onSaved A callback function for when the user saves this PlaceMarker's MapPlace.
     * @param onUnsaved A callback function for when the user un-saves this PlaceMarker's MapPlace.
     * @param onRoute A callback function for when the user starts a route for this PlaceMarler's MapPlace.
     */
    public static async instantiate(map: GoogleMap, place: MapPlace, onSaved: Function, onUnsaved: Function, onRoute: Function): Promise<PlaceMarker> {
        let placeMarker: PlaceMarker;

        await map.addMarker({ position: place.position }).then((marker: Marker) => {
            marker.setAnimation("DROP");

            if(place.isSaved && place.isReported) {
                this.setMarkerIcon(marker, "assets/images/map-icons/place-marker-blue.png");
            }
            else if(place.isSaved && !place.isReported) {
                this.setMarkerIcon(marker, "assets/images/map-icons/place-marker-orange.png");
            }
            else if(!place.isSaved && place.isReported) {
                this.setMarkerIcon(marker, "assets/images/map-icons/place-marker-blue-faded.png");
            }

            placeMarker = new PlaceMarker(place, marker, onSaved, onUnsaved, onRoute);
        });

        return placeMarker;
    }

    /**
     * Assigns a custom MarkerIcon to a map Marker.
     * @param marker The Marker whose MarkerIcon to set.
     * @param iconUrl The URL to the icon image.
     */
    private static setMarkerIcon(marker: Marker, iconUrl: string) {
        marker.setIcon({
            url: iconUrl,
            size: {
                width: 24,
                height: 38
            }
        });
    }

    /**
     * Adds an InfoWindow for this PlaceMarker's Marker containing the information from its associated MapPlace.
     */
    private addPlaceInfoWindow() {
        this.infoWindow = InfoWindow.ForMapPlace(this.place,
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

        this.subscriptions.add(this.marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
            this.infoWindow.open(this.marker);
        }));
    }

    /**
     * Shows the InfoWindow associated with this PlaceMarker.
     */
    public showInfoWindow() {
        //The 1ms delay is here because selecting the "view on map" button on a saved Place resulted in the InfoWindow not displaying properly.
        setTimeout(() => this.infoWindow.open(this.marker), 1);
    }

    /**
     * Hides the InfoWindow associated with this PlaceMarker.
     */
    public hideInfoWindow() {
        this.infoWindow.close();
    }

    /**
     * Destroys this PlaceMarker's MapPlace and its Marker from the GoogleMap it was added to.
     */
    public remove() {
        this._place = null;
        this._marker.remove();
        this.subscriptions.unsubscribe();
    }

    /**
     * The MapPlace associated with this PlaceMarker.
     */
    public get place(): MapPlace {
        return this._place;
    }

    /**
     * The Marker associated with this PlaceMarker.
     */
    public get marker(): Marker {
        return this._marker;
    }
}