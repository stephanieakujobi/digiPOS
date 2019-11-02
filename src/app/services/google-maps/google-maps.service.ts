import { Injectable, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Subscription } from 'rxjs';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation,
  Environment,
  GoogleMapOptions,
  ILatLng,
  LatLng,
  MarkerOptions,
  HtmlInfoWindow,
  Geocoder,
  GeocoderResult
} from '@ionic-native/google-maps';
import { InfoWindow } from 'src/app/classes/google-maps/InfoWindow';
import { IMapPlace } from 'src/app/interfaces/google-maps/IMapPlace';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { FirebaseBusinessService } from '../firebase/businesses/firebase-business.service';
import { BusinessFormatter } from 'src/app/classes/businesses/BusinessFormatter';
import { IBusiness } from 'src/app/interfaces/businesses/IBusiness';
import { CRUDResult } from 'src/app/classes/CRUDResult';
import { AppBusinessesPrefsService } from '../businesses/preferences/app-businesses-prefs.service';
import { PopupsService } from '../global/popups.service';
import { PlaceMarker } from 'src/app/classes/google-maps/PlaceMarker';

@Injectable({
  providedIn: 'root'
})

/**
 * The GoogleMapsService provides the functions the app needs for the user interacting with a GooleMap.
 */
export class GoogleMapsService implements OnDestroy {
  private map: GoogleMap;
  private userPosition: LatLng;
  private mapShouldFollowUser: boolean;

  private markers: PlaceMarker[];
  private searchMarker: PlaceMarker;
  private subscriptions: Subscription;
  private bFormatter: BusinessFormatter;

  /**
   * Creates a new GoogleMapsService.
   * @param platform The Platform used to detect when the native device is ready for native system calls to be made.
   * @param geolocation The Geolocation used to track the user's device.
   */
  constructor(
    private platform: Platform,
    private geolocation: Geolocation,
    private fbbService: FirebaseBusinessService,
    private geocoder: NativeGeocoder,
    private http: HTTP,
    private popupsService: PopupsService
  ) {
    this.mapShouldFollowUser = false;
    this.markers = [];
    this.subscriptions = new Subscription();
    this.bFormatter = new BusinessFormatter();
  }

  /**
   * Creates a new GoogleMap centered on the user's current location.
   * @param mapElementId The id attribute of an HTML element to insert the map.
   */
  public async initMap(mapElementId: string, onComplete: () => void) {
    await this.platform.ready();
    await this.createMap(mapElementId);
    this.subscribeEvents();
    onComplete();
  }

  /**
   * Unsubscribes from all events when this page is unloaded.
   * This prevents the same events being subscribed to multiple times over, which would cause memory leaks.
   * @see https://angular.io/api/core/OnDestroy for more info on ngOnDestroy.
   */
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  /**
   * Creates a new map on the page and centers the camera & user marker to the user's current location when initialized.
   */
  private async createMap(mapElementId: string) {
    let mapOptions: GoogleMapOptions = {
      controls: {
        myLocationButton: false,
        myLocation: true,
        zoom: true
      }
    }

    this.map = GoogleMaps.create(mapElementId, mapOptions);

    let userGeoPos = await this.geolocation.getCurrentPosition();
    this.userPosition = new LatLng(userGeoPos.coords.latitude, userGeoPos.coords.longitude);

    await this.map.moveCamera({
      target: this.userPosition,
      zoom: 18
    });
  }

  /**
   * Initializes the subscribed events that can occur with the service.
   * Events are subsribed so that they can be later disposed to prevent memory leaks.
   */
  private subscribeEvents() {
    //Event called in intervals, tracking the user's current location.
    this.subscriptions.add(this.geolocation.watchPosition({ enableHighAccuracy: true }).subscribe((pos: Geoposition) => {
      this.userPosition = new LatLng(pos.coords.latitude, pos.coords.longitude);

      if(this.mapShouldFollowUser) {
        this.map.animateCamera({
          target: this.userPosition,
          duration: 100
        });
      }
    }));

    this.subscriptions.add(this.map.on(GoogleMapsEvent.MAP_DRAG).subscribe(() => {
      this.mapShouldFollowUser = false;
    }));
  }

  public async centerMap(position?: ILatLng) {
    const centerPosition: ILatLng = position == null ? this.userPosition : position;

    await this.map.animateCamera({
      target: centerPosition,
      duration: 500
    });

    this.mapShouldFollowUser = position == null;
  }

  public markSavedPlaces() {
    this.clearMarkers();

    const formatter = new BusinessFormatter();

    this.fbbService.businesses.forEach(business => {
      this.addPlaceMarker(formatter.businessToMapPlace(business));
    });
  }

  public async addPlaceSearchMarker(place: IMapPlace) {
    if(this.searchMarker != null) {
      this.searchMarker.remove();
    }

    this.searchMarker = await this.addPlaceMarker(place);
    this.centerMap(place.position);
  }

  public async addPlaceMarker(place: IMapPlace): Promise<PlaceMarker> {
    const placeMarker = await PlaceMarker.instantiate(this.map, place,
      () => this.onPlaceMarkerSaved(placeMarker),
      () => this.onPlaceMarkerUnaved(placeMarker),
      () => this.onPlaceMarkerStartRoute(placeMarker),
    );

    this.markers.push(placeMarker);

    return placeMarker;
  }

  private async onPlaceMarkerSaved(placeMarker: PlaceMarker) {
    const business: IBusiness = this.bFormatter.mapPlaceToBusiness(placeMarker.place);
    const result: CRUDResult = await this.fbbService.addBusiness(business);

    this.placeUpdatedResult(result, placeMarker);
  }

  private async onPlaceMarkerUnaved(placeMarker: PlaceMarker) {
    const business: IBusiness = this.bFormatter.mapPlaceToBusiness(placeMarker.place);
    let result: CRUDResult = await this.fbbService.addBusiness(business);

    if(AppBusinessesPrefsService.prefs.askBeforeDelete) {
      this.popupsService.showConfirmationAlert("Delete Business", "Are you sure you want to delete this business?",
        async () => {
          result = await this.fbbService.deleteBusiness(business);
          this.placeUpdatedResult(result, placeMarker);
        },
        null
      );
    }
    else {
      result = await this.fbbService.deleteBusiness(business);
      this.placeUpdatedResult(result, placeMarker);
    }
  }

  private async onPlaceMarkerStartRoute(placeMarker: PlaceMarker) {
    console.log("START ROUTE");
  }

  private placeUpdatedResult(result: CRUDResult, placeMarker: PlaceMarker) {
    if(result.wasSuccessful) {
      placeMarker.place.isSaved = !placeMarker.place.isSaved;
      this.addPlaceMarker(placeMarker.place);
      this.markSavedPlaces();
    }

    this.popupsService.showToast(result.message);
  }

  public findAddress(queryString: string, callback: (place: IMapPlace) => void) {
    queryString = new BusinessFormatter().formatAddressString(queryString);

    this.http.get(`http://localhost:3000/findplace?address=${queryString}`, {}, {})
      .then((response: any) => {
        const data = JSON.parse(response.data);

        if(data.candidates.length != 0) {
          const mapPlace: IMapPlace = {
            name: data.candidates[0].name,
            address: data.candidates[0].formatted_address,
            position: {
              lat: data.candidates[0].geometry.location.lat,
              lng: data.candidates[0].geometry.location.lng
            },
            isSaved: this.fbbService.savedAddressExists(data.candidates[0].formatted_address as string)
          };

          this.addPlaceSearchMarker(mapPlace);
          callback(mapPlace);
        }
      })
      .catch(() => {
        this.popupsService.showToast("A network error occurred while searching for an address.");
        callback(null);
      });

    // Geocoder.geocode({ address: "Sheridan College, Brampton, Ontario" }).then((results: GeocoderResult[]) => {
    //   console.log(results);
    // });

    // this.geocoder.forwardGeocode(queryString, { useLocale: true, maxResults: 1 })
    //   .then((result: NativeGeocoderResult[]) => {
    //     const position = new LatLng(parseInt(result[0].latitude), parseInt(result[0].longitude));
    //     this.placeMarker(position);
    //   })
    //   .catch(error => {
    //     document.getElementById("debug-text").innerText = error.toString();
    //   })
  }

  public updateSavedPlace(place: IMapPlace) {
    place.isSaved = this.fbbService.savedAddressExists(place.address);
  }

  public clearMarkers() {
    const arrLength = this.markers.length;

    for(let i = 0; i < arrLength; i++) {
      this.markers[i].remove();
    }
  }
}
