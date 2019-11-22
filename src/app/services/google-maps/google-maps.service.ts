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
import { PopupsService } from '../global/popups/popups.service';
import { PlaceMarker } from 'src/app/classes/google-maps/PlaceMarker';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { GlobalServices } from 'src/app/classes/global/GlobalServices';
import { ReportedPlace } from 'src/app/models/places/ReportedPlace';

/**
 * The GoogleMapsService provides the functions the app needs for the user interacting with a GooleMap.
 */
@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService implements OnDestroy {
  private map: GoogleMap;
  private mapShouldFollowUser: boolean;
  private userPos: ILatLng;

  private searchMarker: PlaceMarker;
  private nearbyMarkers: PlaceMarker[];
  public specialMarkers: PlaceMarker[];

  private subscriptions: Subscription;
  private pFormatter: PlaceFormatter;

  private readonly apiHost = "https://cpos-capstone-server.herokuapp.com";

  /**
   * Creates a new GoogleMapsService.
   * @param geolocation The Geolocation used to track the user's device.
   * @param fbpService The FirebasePlacesService used to display Places on the map.
   * @param http The HTTP used to create HTTP requests to the Google Maps API.
   * @param popupsService the PopupsService used to display various pop-up messages to the user.
   * @param launchNavigator the LaunchNavigator used to launch the user's native maps application when starting a route to a Place on the map.
   */
  constructor(
    private geolocation: Geolocation,
    private fbpService: FirebasePlacesService,
    private http: HTTP,
    private popupsService: PopupsService,
    private launchNavigator: LaunchNavigator
  ) {
    this.mapShouldFollowUser = false;
    this.nearbyMarkers = [];
    this.specialMarkers = [];
    this.subscriptions = new Subscription();
    this.pFormatter = new PlaceFormatter();
  }

  /**
   * Creates a new GoogleMap centered on the user's current location.
   * @param mapElementId The id attribute of an HTML element to insert the map.
   * @param onComplete The callback function to run when the map has finished initializing.
   */
  public async initMap(mapElementId: string, onComplete: () => void) {
    await this.createMap(mapElementId);

    this.fbpService.loadReportedPlaces(() => {
      this.subscribeEvents();
      onComplete();
    })
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  /**
   * Creates a new map on the page and centers the camera & user marker to the user's current location when initialized.
   * @param mapElementId The id attribute of an HTML element to insert the map.
   */
  private async createMap(mapElementId: string) {
    const mapOptions: GoogleMapOptions = {
      controls: {
        myLocation: true,
        zoom: true,
        myLocationButton: false,
        mapToolbar: false,
        indoorPicker: false
      }
    }

    this.map = GoogleMaps.create(mapElementId, mapOptions);

    const userGeoPos = await this.geolocation.getCurrentPosition();
    this.userPos = new LatLng(userGeoPos.coords.latitude, userGeoPos.coords.longitude);

    await this.map.moveCamera({
      target: this.userPos,
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
      this.userPos = new LatLng(pos.coords.latitude, pos.coords.longitude);

      if(this.mapShouldFollowUser) {
        this.map.animateCamera({
          target: this.userPos,
          duration: 100
        });
      }
    }));

    this.subscriptions.add(this.map.on(GoogleMapsEvent.MAP_DRAG).subscribe(() => {
      this.mapShouldFollowUser = false;
    }));
  }

  /**
   * Centers a map on an optional ILatLng position.
   * If no position is specified, then the map is centered on the user's position instead.
   * @param position The optional position to center the map onto.
   * @param zoom The optional zoom the set the map's camera to.
   */
  public async centerMap(position?: ILatLng, zoom?: number) {
    const centerPosition: ILatLng = position != null ? position : this.userPos;
    const cameraZoom = zoom != null ? zoom : this.map.getCameraZoom();

    await this.map.animateCamera({
      target: centerPosition,
      duration: 500,
      zoom: cameraZoom
    });

    this.mapShouldFollowUser = position == null;
  }

  /**
   * Pins the specified special PlaceMarkers on the map.
   * @param saved Whether to show PlaceMarkers representing the user's saved Places on the map.
   * @param savedReported Whether to show PlaceMarkers representing the user's saved and reported Places on the map.
   * @param otherReported Whether to show PlaceMarkers representing all other reported Places in the database on the map.
   */
  public async pinSpecialMarkers(saved: boolean, savedReported: boolean, otherReported: boolean) {
    this.clearSpecialMarkers();

    if(saved) {
      const places: Place[] = this.fbpService.savedPlaces.filter(p => !p.isReported);
      places.forEach(async p => await this.addPlaceMarker(this.pFormatter.mapPlaceFromPlace(p)));
    }

    if(savedReported) {
      const places: Place[] = this.fbpService.savedPlaces.filter(p => p.isReported);
      places.forEach(async p => await this.addPlaceMarker(this.pFormatter.mapPlaceFromPlace(p)));
    }

    if(otherReported) {
      const places: ReportedPlace[] = [];

      this.fbpService.reportedPlaces.forEach(rp => {
        if(!this.fbpService.savedPlaces.find(sp => sp.info.address.addressString == rp.info.address.addressString)) {
          places.push(rp);
        }
      });

      places.forEach(async p => await this.addPlaceMarker(this.pFormatter.mapPlaceFromReportedPlace(p, false)));
    }
  }

  /**
   * Removes all special PlaceMarkers from the map.
   */
  public clearSpecialMarkers() {
    this.specialMarkers.forEach(m => m.remove());
    this.specialMarkers = [];
  }

  /**
   * Removes all generic PlaceMarkers pinned from searching Places.
   */
  public clearNearbyMarkers() {
    this.nearbyMarkers.forEach(m => m.remove());
    this.nearbyMarkers = [];
  }

  /**
   * Removes the generic map marker pinned by searching for a place.
   */
  public clearSearchMarker() {
    if(this.searchMarker != null) {
      this.searchMarker.remove();
    }
  }

  /**
   * Pins and centers the map on a MapPlace.
   * @param place The Place to view.
   */
  public async viewPlace(place: MapPlace) {
    const existingPM: PlaceMarker = this.specialMarkers.find(m => m.place.address == place.address);
    this.hideAllInfoWindows();

    if(existingPM != null) {
      await this.centerMap(place.position);
      existingPM.showInfoWindow();
    }
    else {
      await this.addPlaceSearchMarker(place);
    }
  }

  /**
   * Hides any InfoWindows showing from all special PlaceMarkers, nearby PlaceMarkers, and the search PlaceMarker.
   */
  private hideAllInfoWindows() {
    this.specialMarkers.forEach(m => m.hideInfoWindow());
    this.nearbyMarkers.forEach(m => m.hideInfoWindow());

    if(this.searchMarker != null) {
      this.searchMarker.hideInfoWindow();
    }
  }

  /**
   * Adds a PlaceMarker and assigns the reference to the cached searchMarker.
   * @param place The MapPlace to associate with the PlaceMarker.
   */
  private async addPlaceSearchMarker(place: MapPlace) {
    if(this.searchMarker != null) {
      this.searchMarker.remove();
    }

    this.searchMarker = await this.addPlaceMarker(place, false);
    this.centerMap(place.position);
    this.searchMarker.showInfoWindow();
  }

  /**
   * Adds a new PlaceMarker onto the map. The location of the PlaceMarker on the map will be on the position value of the associated MapPlace.
   * @param place The MapPlace to associate with the PlaceMarker.
   * @param cacheReference Whether to cache a reference to this PlaceMarker. True by default.
   * @returns The newly created Placemarker.
   */
  public async addPlaceMarker(place: MapPlace, cacheReference: boolean = true): Promise<PlaceMarker> {
    const placeMarker = await PlaceMarker.instantiate(this.map, place,
      () => this.onPlaceMarkerSaved(placeMarker),
      () => this.onPlaceMarkerUnaved(placeMarker),
      () => this.onPlaceMarkerStartRoute(placeMarker),
    );

    if(cacheReference) {
      if((place.isSaved || place.isReported) && !this.markerExistsInCollection(place, this.specialMarkers)) {
        this.specialMarkers.push(placeMarker);
      }
      else {
        this.nearbyMarkers.push(placeMarker);
      }
    }

    return placeMarker;
  }

  /**
   * Compares the address of a MapPlace to the addresses of a collection of PlaceMarkers for a match.
   * @param place The MapPlace whose address to search.
   * @param collection The collection of PlaceMarkers to search for the MapPlace's address in.
   * @returns True if the MapPlace's address was found in the collection, and false if not.
   */
  private markerExistsInCollection(place: MapPlace, collection: PlaceMarker[]): boolean {
    return !(collection.length == 0 || (collection.find(m => m.place.address == place.address) == null));
  }

  /**
   * The callback function for when the user saves a Place from a PlaceMarker's InfoWindow.
   * Converts the MapPlace reference to a Place and uses the FirebasePlacesService to save the Place.
   * @param placeMarker The PlaceMarker that was saved.
   */
  private async onPlaceMarkerSaved(placeMarker: PlaceMarker) {
    const place: Place = this.pFormatter.placeFromMapPlace(placeMarker.place);
    const result: CRUDResult = await this.fbpService.addPlace(place);

    this.updatePlaceMarker(result, placeMarker);
  }

  /**
   * The callback function for when the user un-saves a Place from a PlaceMarker's InfoWindow.
   * Converts the MapPlace reference to a Place and uses the FirebasePlacesService to delete the Place.
   * If the user's saved Places preferences require confirmation before deleting a Place, then they will be prompted beforehand.
   * @param placeMarker The PlaceMarker that was un-saved.
   */
  private async onPlaceMarkerUnaved(placeMarker: PlaceMarker) {
    const place: Place = this.pFormatter.placeFromMapPlace(placeMarker.place);
    let result: CRUDResult = await this.fbpService.addPlace(place);

    if(GlobalServices.placesPrefsService.prefs.askBeforeDelete) {
      this.popupsService.showConfirmationAlert("Delete Place", "Are you sure you want to delete this place?",
        async () => {
          result = await this.fbpService.deletePlace(place);
          this.updatePlaceMarker(result, placeMarker);
        }
      );
    }
    else {
      result = await this.fbpService.deletePlace(place);
      this.updatePlaceMarker(result, placeMarker);
    }
  }

  /**
   * The callback function for when the user starts a route to a Place from a PlaceMarker's InfoWindow.
   * Uses the LaunchNavigator to launch the native maps application on the user's device with the destination set to the PlaceMarker's MapPlace.
   * @param placeMarker The PlaceMarker that the user has started a route to.
   */
  private async onPlaceMarkerStartRoute(placeMarker: PlaceMarker) {
    let options: LaunchNavigatorOptions = {
      start: `${this.userPos.lat}, ${this.userPos.lng}`,
      app: GlobalServices.mapsPrefsService.prefs.prefMapsApp
    }

    this.launchNavigator.navigate(placeMarker.place.address, options)
      .catch(() => {
        this.popupsService.showToast("Failed to launch maps - unknown error.")
      });
  }

  /**
   * Removes and re-adds a PlaceMarker based on the success of a provided CRUDResult.
   * Used for when the user saves or un-saves a PlaceMarker.
   * @param result The CRUDResult operation that was performed.
   * @param placeMarker The PlaceMarker to update.
   */
  private updatePlaceMarker(result: CRUDResult, placeMarker: PlaceMarker) {
    if(result.wasSuccessful) {
      const place: MapPlace = placeMarker.place;
      place.isSaved = !place.isSaved;

      const cachedIndex = this.specialMarkers.indexOf(this.specialMarkers.find(m => m.place.address == place.address));
      if(cachedIndex != -1) {
        this.specialMarkers.splice(cachedIndex, 1);
      }

      placeMarker.remove();
      this.addPlaceMarker(place);
    }

    this.popupsService.showToast(result.message);
  }

  /**
   * Makes an HTTP request to the Google Maps API, searching for a Place based on the provided query string.
   * The query string should ideally be either be a name or address, but any kind of input value will be accepted.
   * @param queryString the string value to search with the API request.
   * @param callback The callback function containing the search result formatted as a MapPlace.
   */
  public findPlace(queryString: string, callback: (place: MapPlace) => void) {
    this.http.get(`${this.apiHost}/findplace?searchtext=${queryString}&lat=${this.userPos.lat}&lng=${this.userPos.lng}`, {}, {})
      .then(response => {
        const places: MapPlace[] = this.parsePlacesResponse(response);

        if(places.length == 0) {
          this.popupsService.showToast("Could not find any places in your area.");
          callback(null);
        }
        else {
          if(places[0].isSaved || places[0].isReported) {
            this.viewPlace(places[0]);
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

  /**
   * Makes an HTTP request to the Google Maps API, searching for nearby Places within a radius.
   * @param radius The radius in meters to search for places from the user's current location.
   * @param callback The callback function containing the search results formatted as an array of MapPlaces.
   */
  public findNearby(radius: number, callback: (places: MapPlace[]) => void) {
    this.centerMap(this.userPos, 10);

    this.http.get(`${this.apiHost}/findnearby?lat=${this.userPos.lat}&lng=${this.userPos.lng}&radius=${radius}`, {}, {})
      .then(response => {
        const places: MapPlace[] = this.parsePlacesResponse(response);
        const arrLength = places.length;

        if(arrLength == 0) {
          this.popupsService.showToast("Could not find any places in your area.");
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

  /**
   * Parses the response returned from a Google Maps API request into an array of MapPlaces.
   * @param response The HTTP response returned from a Google Maps API request.
   * @returns an array of MapPlaces from the response data.
   */
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
        isSaved: this.fbpService.savedAddressExists(address),
        isReported: this.fbpService.reportedAddressExists(address)
      });
    }

    return results;
  }
}