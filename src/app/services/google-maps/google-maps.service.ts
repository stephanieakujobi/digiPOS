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
import { BusinessLocation } from 'src/app/classes/google-maps/BusinessLocation';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';

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
  private subscriptions: Subscription;
  private _mapFinishedCreating: boolean;

  /**
   * Creates a new GoogleMapsService.
   * @param platform The Platform used to detect when the native device is ready for native system calls to be made.
   * @param geolocation The Geolocation used to track the user's device.
   */
  constructor(private platform: Platform, private geolocation: Geolocation, private geocoder: NativeGeocoder) {
    this.mapShouldFollowUser = false;
    this.subscriptions = new Subscription();
    this._mapFinishedCreating = false;
  }

  /**
   * Creates a new GoogleMap centered on the user's current location.
   * @param mapElementId The id attribute of an HTML element to insert the map.
   */
  public async initMap(mapElementId: string) {
    await this.platform.ready();
    await this.createMap(mapElementId);
    this.subscribeEvents();
    this._mapFinishedCreating = true;

    // this.markerTest(); //TEMPORARY
  }

  //TEMPORARY TEST METHOD.
  private markerTest() {
    this.map.addMarker({ position: this.userPosition }).then((marker: Marker) => {
      let bs = new BusinessLocation("Name", "Address", false);
      let infoWindow = InfoWindow.ForBusinessLocation(bs,
        () => {
          console.log("SAVE");
        },
        () => {
          console.log("ROUTE");
        }
      );

      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        infoWindow.open(marker);
      });
    });
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

  public async centerMap(position?: LatLng) {
    const centerPosition = position == null ? this.userPosition: position;

    await this.map.animateCamera({
      target: centerPosition,
      duration: 500
    });

    this.mapShouldFollowUser = position == null;
  }

  private placeMarker(position: LatLng) {
    this.map.addMarker({ position: position }).then((marker: Marker) => {
      let bs = new BusinessLocation("Test", "Address", false);
      let infoWindow = InfoWindow.ForBusinessLocation(bs,
        () => {
          console.log("SAVE");
        },
        () => {
          console.log("ROUTE");
        }
      );

      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        infoWindow.open(marker);
      });
    });
  }

  public findAddress(queryString: string) {
    // Geocoder.geocode({ address: "Sheridan College, Brampton, Ontario" }).then((results: GeocoderResult[]) => {
    //   console.log(results);
    // });

    this.geocoder.forwardGeocode(queryString, { useLocale: true, maxResults: 1 })
      .then((result: NativeGeocoderResult[]) => {
        const position = new LatLng(parseInt(result[0].latitude), parseInt(result[0].longitude));
        this.placeMarker(position);
      })
      .catch(error => {
        document.getElementById("debug-text").innerText = error.toString();
      })
  }

  /**
   * Whether the GoogleMap has finished creating after calling the initMap function.
   */
  public get mapFinishedCreating(): boolean {
    return this._mapFinishedCreating;
  }
}
