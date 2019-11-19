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
import { PlacesPrefsService } from '../places/preferences/places-prefs.service';
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
  private userPos: ILatLng;

  private searchMarker: PlaceMarker;
  private savedMarkers: PlaceMarker[];
  private reportedMarkers: PlaceMarker[];
  private nearbyMarkers: PlaceMarker[];

  private subscriptions: Subscription;
  private pFormatter: PlaceFormatter;

  private readonly serverDomain = "https://cpos-capstone-server.herokuapp.com";

  /**
   * Creates a new GoogleMapsService.
   * @param platform The Platform used to detect when the native device is ready for native system calls to be made.
   * @param geolocation The Geolocation used to track the user's device.
   * @param fbpService The FirebasePlacesService used to display Places on the map.
   * @param http The HTTP used to create HTTP requests to the Google Maps API.
   * @param popupsService the PopupsService used to display various pop-up messages to the user.
   * @param launchNavigator the LaunchNavigator used to launch the user's native maps application when starting a route to a Place on the map.
   */
  constructor(
    private platform: Platform,
    private geolocation: Geolocation,
    private fbpService: FirebasePlacesService,
    private http: HTTP,
    private popupsService: PopupsService,
    private launchNavigator: LaunchNavigator
  ) {
    this.mapShouldFollowUser = false;
    this.nearbyMarkers = [];
    this.savedMarkers = [];
    this.reportedMarkers = [];
    this.subscriptions = new Subscription();
    this.pFormatter = new PlaceFormatter();
  }

  /**
   * Creates a new GoogleMap centered on the user's current location.
   * @param mapElementId The id attribute of an HTML element to insert the map.
   * @param onComplete The callback function to run when the map has finished initializing.
   */
  public async initMap(mapElementId: string, onComplete: () => void) {
    await this.platform.ready();
    await this.createMap(mapElementId);
    this.subscribeEvents();
    onComplete();
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
   */
  public async centerMap(position?: ILatLng) {
    const centerPosition: ILatLng = position == null ? this.userPos : position;

    await this.map.animateCamera({
      target: centerPosition,
      duration: 500
    });

    this.mapShouldFollowUser = position == null;
  }

  /**
   * Searches the user's saved Places for the provided Place, and if an existing match is found, the map will be centered on the Place.
   * @param place The saved Place to view.
   */
  public async viewSavedPlace(place: MapPlace) {
    this.viewPlaceInPlaceMarkers(place, this.savedMarkers);
  }

  public async viewReportedPlace(place: MapPlace) {
    this.viewPlaceInPlaceMarkers(place, this.reportedMarkers);
  }

  private async viewPlaceInPlaceMarkers(place: MapPlace, collection: PlaceMarker[]) {
    const result: PlaceMarker[] = collection.filter(m => m.place.address == place.address);

    if(result.length != 0) {
      for(const placeMarker of this.savedMarkers) {
        placeMarker.hideInfoWindow();
      }
      for(const placeMarker of this.reportedMarkers) {
        placeMarker.hideInfoWindow();
      }

      await this.centerMap(result[0].place.position);
      result[0].showInfoWindow();
    }
  }

  /**
   * Adds a PlaceMarker at the locations of all the user's saved Places.
   */
  public async pinSavedPlaces() {
    this.clearSavedMarkers();

    for(const place of this.fbpService.savedPlaces) {
      await this.addPlaceMarker(this.pFormatter.mapPlaceFromPlace(place));
    }
  }

  public async pinReportedPlaces() {
    this.clearReportedMarkers();

    for(const place of this.fbpService.reportedPlaces) {
      await this.addPlaceMarker(this.pFormatter.mapPlaceFromReportedPlace(place, this.fbpService.placeIsSavedAndReported(place)));
    }
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
      if(place.isSaved || place.isReported) {
        if(place.isSaved && (this.savedMarkers.length == 0 || (this.savedMarkers.filter(m => m.place.address == place.address).length == 0))) {
          this.savedMarkers.push(placeMarker);
        }
        if(place.isReported && (this.reportedMarkers.length == 0 || (this.reportedMarkers.filter(m => m.place.address == place.address).length == 0))) {
          this.reportedMarkers.push(placeMarker);
        }
      }
      else {
        this.nearbyMarkers.push(placeMarker);
      }
    }

    return placeMarker;
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

    if(PlacesPrefsService.prefs.askBeforeDelete) {
      this.popupsService.showConfirmationAlert("Delete Place", "Are you sure you want to delete this place?",
        async () => {
          result = await this.fbpService.deletePlace(place);
          this.updatePlaceMarker(result, placeMarker);
        },
        null
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
      app: this.launchNavigator.APP.GOOGLE_MAPS
    }

    this.launchNavigator.navigate(placeMarker.place.address, options)
      .catch(err => {
        console.log(err);
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

      if(!place.isSaved) {
        this.savedMarkers.splice(this.savedMarkers.indexOf(placeMarker, 1));
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
    queryString = this.pFormatter.formatAddressString(queryString);

    this.http.get(`${this.serverDomain}/findplace?searchtext=${queryString}&lat=${this.userPos.lat}&lng=${this.userPos.lng}`, {}, {})
      .then(response => {
        const places: MapPlace[] = this.parsePlacesResponse(response);

        if(places.length == 0) {
          this.popupsService.showToast("Could not find a place with this address.");
          callback(null);
        }
        else {
          if(places[0].isSaved) {
            this.viewSavedPlace(places[0]);
          }
          else if(places[0].isReported) {
            this.viewReportedPlace(places[0]);
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
    this.http.get(`${this.serverDomain}/findnearby?lat=${this.userPos.lat}&lng=${this.userPos.lng}&radius=${radius}`, {}, {})
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

  /**
   * Removes all cached PlaceMarkers pinning the user's saved Places.
   */
  public clearSavedMarkers() {
    this.clearPlaceMarkers(this.savedMarkers);
  }

  public clearReportedMarkers() {
    this.clearPlaceMarkers(this.reportedMarkers);
  }

  /**
   * Removes all general PlaceMarkers pinned from searching Places.
   */
  public clearNearbyMarkers() {
    this.clearPlaceMarkers(this.nearbyMarkers);

    if(this.searchMarker != null) {
      this.searchMarker.remove();
    }
  }

  private clearPlaceMarkers(markers: PlaceMarker[]) {
    const arrLength = markers.length;

    for(let i = 0; i < arrLength; i++) {
      markers[i].remove();
    }

    markers.splice(0, arrLength);
  }
}