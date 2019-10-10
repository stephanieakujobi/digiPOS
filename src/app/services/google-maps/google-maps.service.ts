import { Injectable, OnInit, OnDestroy } from '@angular/core';
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
  HtmlInfoWindow
} from '@ionic-native/google-maps';
import { InfoWindow } from 'src/app/classes/google-maps/InfoWindow';
import { BusinessLocation } from 'src/app/classes/google-maps/BusinessLocation';


@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService implements OnDestroy {
  private map: GoogleMap;
  private userPosition: Geoposition;
  private mapLoaded: boolean; //Interpolated in home-tab-page.html
  private mapShouldFollowUser: boolean;

  private subscriptions: Subscription;

  constructor(private platform: Platform, private geolocation: Geolocation) {
    this.mapLoaded = false;
    this.mapShouldFollowUser = false;
    this.subscriptions = new Subscription();
  }

  public async createMap(mapElementId: string) {
    await this.platform.ready();
    await this.loadMap(mapElementId);
    this.subscribeEvents();
    this.mapLoaded = true;

    this.markerTest();
  }

  private markerTest() {
    this.map.addMarker({ position: { lat: this.userPosition.coords.latitude, lng: this.userPosition.coords.longitude } }).then((marker: Marker) => {
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
  private async loadMap(mapElementId: string) {
    let mapOptions: GoogleMapOptions = {
      controls: {
        myLocationButton: false,
        myLocation: true,
        zoom: true
      }
    }

    this.map = GoogleMaps.create(mapElementId, mapOptions);

    this.userPosition = await this.geolocation.getCurrentPosition();

    await this.map.moveCamera({
      target: new LatLng(this.userPosition.coords.latitude, this.userPosition.coords.longitude),
      zoom: 18
    });
  }

  /**
   * Initializes the subscribed events that can occur on the page.
   */
  private subscribeEvents() {
    //Event called in intervals, tracking the user's current location.
    this.subscriptions.add(this.geolocation.watchPosition({ enableHighAccuracy: true }).subscribe((pos: Geoposition) => {
      this.userPosition = pos;

      if(this.mapShouldFollowUser) {
        this.map.animateCamera({
          target: new LatLng(pos.coords.latitude, pos.coords.longitude),
          duration: 100
        });
      }
    }));

    this.subscriptions.add(this.map.on(GoogleMapsEvent.MAP_DRAG).subscribe(() => {
      this.mapShouldFollowUser = false;
    }));
  }

  /**
   * Called from the page when the user selects the bottom-right floating action button.
   * Centers the map's camera on the user's current location.
   */
  public async centerMapOnUserLocation() {
    await this.map.animateCamera({
      target: new LatLng(this.userPosition.coords.latitude, this.userPosition.coords.longitude),
      duration: 500
    });

    this.mapShouldFollowUser = true;
  }

  public querySearchPlace(queryString: string) {

  }
}
