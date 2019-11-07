import { Injectable, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Subscription } from 'rxjs';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  ILatLng,
  LatLng,
} from '@ionic-native/google-maps';
import { MapPlace } from 'src/app/models/google-maps/MapPlace';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { FirebasePlacesService } from '../firebase/places/firebase-places.service';
import { PlaceFormatter } from 'src/app/classes/places/PlaceFormatter';
import { Place } from 'src/app/models/places/Place';
import { CRUDResult } from 'src/app/classes/CRUDResult';
import { AppPlacesPrefsService } from '../places/preferences/app-places-prefs.service';
import { PopupsService } from '../global/popups.service';
import { PlaceMarker } from 'src/app/classes/google-maps/PlaceMarker';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';

@Injectable({
  providedIn: 'root'
})

/**
 * The GoogleMapsService provides the functions the app needs for the user interacting with a GooleMap.
 */
export class GoogleMapsService implements OnDestroy {
  private map: GoogleMap;
  private mapShouldFollowUser: boolean;
  private userPosition: ILatLng;

  private searchMarker: PlaceMarker;
  private savedMarkers: PlaceMarker[];
  private nearbyMarkers: PlaceMarker[];

  private subscriptions: Subscription;
  private bFormatter: PlaceFormatter;

  /**
   * Creates a new GoogleMapsService.
   * @param platform The Platform used to detect when the native device is ready for native system calls to be made.
   * @param geolocation The Geolocation used to track the user's device.
   */
  constructor(
    private platform: Platform,
    private geolocation: Geolocation,
    private fbbService: FirebasePlacesService,
    private http: HTTP,
    private popupsService: PopupsService,
    private launchNavigator: LaunchNavigator
  ) {
    this.mapShouldFollowUser = false;
    this.nearbyMarkers = [];
    this.savedMarkers = [];
    this.subscriptions = new Subscription();
    this.bFormatter = new PlaceFormatter();
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

  public centerOnSavedPlace(place: MapPlace) {
    const placeMarkers: PlaceMarker[] = this.savedMarkers.filter(m => m.place.address == place.address);

    if(placeMarkers.length != 0) {
      this.centerMap(placeMarkers[0].place.position);
      placeMarkers[0].marker.setAnimation("BOUNCE");
    }
  }

  public pinSavedPlaces() {
    this.clearSavedMarkers();

    this.fbbService.savedPlaces.forEach(place => {
      this.addPlaceMarker(this.bFormatter.mapPlaceFromPlace(place));
    });
  }

  public async addPlaceSearchMarker(place: MapPlace) {
    if(this.searchMarker != null) {
      this.searchMarker.remove();
    }

    this.searchMarker = await this.addPlaceMarker(place, false);
    this.centerMap(place.position);
  }

  public async addPlaceMarker(place: MapPlace, saveReference: boolean = true): Promise<PlaceMarker> {
    const placeMarker = await PlaceMarker.instantiate(this.map, place,
      () => this.onPlaceMarkerSaved(placeMarker),
      () => this.onPlaceMarkerUnaved(placeMarker),
      () => this.onPlaceMarkerStartRoute(placeMarker),
    );

    if(saveReference) {
      if(place.isSaved) {
        if(this.savedMarkers.length == 0) {
          this.savedMarkers.push(placeMarker);
        }
        else if(this.savedMarkers.filter(m => m.place.address == place.address).length == 0) {
          this.savedMarkers.push(placeMarker);
        }
      }
      else {
        this.nearbyMarkers.push(placeMarker);
      }
    }

    return placeMarker;
  }

  private async onPlaceMarkerSaved(placeMarker: PlaceMarker) {
    const place: Place = this.bFormatter.placeFromMapPlace(placeMarker.place);
    const result: CRUDResult = await this.fbbService.addPlace(place);

    this.updatePlaceMarker(result, placeMarker);
  }

  private async onPlaceMarkerUnaved(placeMarker: PlaceMarker) {
    const place: Place = this.bFormatter.placeFromMapPlace(placeMarker.place);
    let result: CRUDResult = await this.fbbService.addPlace(place);

    if(AppPlacesPrefsService.prefs.askBeforeDelete) {
      this.popupsService.showConfirmationAlert("Delete Place", "Are you sure you want to delete this place?",
        async () => {
          result = await this.fbbService.deletePlace(place);
          this.updatePlaceMarker(result, placeMarker);
        },
        null
      );
    }
    else {
      result = await this.fbbService.deletePlace(place);
      this.updatePlaceMarker(result, placeMarker);
    }
  }

  private async onPlaceMarkerStartRoute(placeMarker: PlaceMarker) {
    let options: LaunchNavigatorOptions = {
      start: `${this.userPosition.lat}, ${this.userPosition.lng}`,
      app: this.launchNavigator.APP.GOOGLE_MAPS
    }

    this.launchNavigator.navigate(placeMarker.place.address, options)
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );
  }

  private updatePlaceMarker(result: CRUDResult, placeMarker: PlaceMarker) {
    if(result.wasSuccessful) {
      placeMarker.place.isSaved = !placeMarker.place.isSaved;
      this.addPlaceMarker(placeMarker.place);
      placeMarker.remove();
    }

    this.popupsService.showToast(result.message);
  }

  public findAddress(queryString: string, callback: (place: MapPlace) => void) {
    queryString = this.bFormatter.formatAddressString(queryString);

    this.http.get(`http://localhost:3000/findplace?address=${queryString}`, {}, {})
      .then(response => {
        const places: MapPlace[] = this.parsePlacesResponse(response);

        if(places.length == 0) {
          this.popupsService.showToast("Could not find a place with this address.");
          callback(null);
        }
        else {
          if(places[0].isSaved) {
            this.centerOnSavedPlace(places[0]);
          }
          else {
            this.addPlaceSearchMarker(places[0]);
          }

          callback(places[0]);
        }
      })
      .catch(() => {
        this.popupsService.showToast("A network error occurred while searching for an address.");
        callback(null);
      });
  }

  public findNearby(radius: number, callback: (places: MapPlace[]) => void) {
    this.http.get(`http://localhost:3000/findnearby?lat=${this.userPosition.lat}&lng=${this.userPosition.lng}&radius=${radius}`, {}, {})
      .then(response => {
        const places: MapPlace[] = this.parsePlacesResponse(response);
        const arrLength = places.length;

        if(arrLength == 0) {
          this.popupsService.showToast("Could not find a place with this address.");
          callback(null);
        }
        else {
          this.clearNearbyMarkers();

          for(let i = 0; i < arrLength; i++) {
            if(!places[i].isSaved) {
              this.addPlaceMarker(places[i]);
            }
          }

          callback(places);
        }
      })
      .catch(() => {
        this.popupsService.showToast("A network error occurred while searching nearby places.");
        callback(null);
      });
  }

  private parsePlacesResponse(response: HTTPResponse): MapPlace[] {
    let results: MapPlace[] = [];

    const data = JSON.parse(response.data);
    const arrLength = data.places.length;

    for(let i = 0; i < arrLength; i++) {
      const address: string = data.places[i].formatted_address ? data.places[i].formatted_address : data.places[i].vicinity;

      results.push({
        name: data.places[i].name,
        address: address,
        position: {
          lat: data.places[i].geometry.location.lat,
          lng: data.places[i].geometry.location.lng
        },
        isSaved: this.fbbService.savedAddressExists(address),
        isReported: this.fbbService.reportedAddressExists(address)
      });
    }

    return results;
  }

  public updateSavedPlace(place: MapPlace) {
    place.isSaved = this.fbbService.savedAddressExists(place.address);
  }

  private clearSavedMarkers() {
    const arrLength = this.savedMarkers.length;

    for(let i = 0; i < arrLength; i++) {
      this.savedMarkers[i].remove();
    }
  }

  public clearNearbyMarkers() {
    const arrLength = this.nearbyMarkers.length;

    for(let i = 0; i < arrLength; i++) {
      this.nearbyMarkers[i].remove();
    }
  }
}