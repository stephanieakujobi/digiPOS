import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation, GeolocationOptions, Geoposition } from '@ionic-native/geolocation/ngx';
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
  MarkerOptions
} from '@ionic-native/google-maps';
import { Observer, Subscription } from 'rxjs';

@Component({
  selector: 'app-home-tab',
  templateUrl: 'home-tab.page.html',
  styleUrls: ['home-tab.page.scss']
})

/**
 * The page displayed to the user when they select the "Home" tab.
 * Shows the user their current location on the map and provides them options to search for nearby businesses to report.
 */
export class HomeTabPage implements OnInit, OnDestroy {
  private map: GoogleMap;
  private _mapLoaded: boolean;
  private mapCamFollowUser: boolean;

  private subscriptions: Subscription;

  /**
   * Creates a new HomeTabPage
   * @param platform The native platform. Must be in its "ready" state before displaying the map.
   * @param geolocation The native geolocation plugin to get the user's current location from their device.
   */
  constructor(private platform: Platform, private geolocation: Geolocation) { }

  /**
   * Scaffolds the map-creation process; wating fo the platform to be in its "ready" state before creating a new Google Maps instance.
   * @see https://angular.io/api/core/OnInit for more info on ngOnInit.
   */
  async ngOnInit() {
    await this.platform.ready();
    await this.loadMap();
    this.subscribeEvents();
    this._mapLoaded = true;
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
  private async loadMap() {
    let mapOptions: GoogleMapOptions = {
      controls: {
        myLocationButton: false,
        myLocation: true,
        zoom: true
      }
    }

    this.map = GoogleMaps.create("map", mapOptions);

    let userLocation = await this.map.getMyLocation();

    await this.map.moveCamera({
      target: userLocation.latLng,
      zoom: 18
    });
  }

  /**
   * Initializes the subscribed events that can occur on the page.
   */
  private subscribeEvents() {
    if(this.subscriptions == null) {
      this.subscriptions = new Subscription();
    }
    else {
      this.subscriptions.unsubscribe();
    }

    //Event called in intervals, tracking the user's current location.
    this.subscriptions.add(this.geolocation.watchPosition({ enableHighAccuracy: true }).subscribe((pos: Geoposition) => {
      //Makes the map's camera follow the user's current location as long as "mapCamFollowUser" is true.
      if(this.mapCamFollowUser) {
        this.map.animateCamera({
          target: new LatLng(pos.coords.latitude, pos.coords.longitude),
          duration: 100
        });
      }
    }));

    //Event called whenever the user drags the map.
    this.subscriptions.add(this.map.on(GoogleMapsEvent.MAP_DRAG).subscribe(() => {
      this.mapCamFollowUser = false;
    }));
  }

  /**
   * Called from the page when the user selects the bottom-right floating action button.
   * Centers the map's camera on the user's current location.
   */
  async centerMapOnUserLocation() {
    let userLocation = await this.map.getMyLocation();

    await this.map.animateCamera({
      target: userLocation.latLng,
      duration: 500
    });

    this.mapCamFollowUser = true;
  }

  /**
   * Whether or not the map on the page has finished loading.
   */
  public get mapLoaded(): boolean {
    return this._mapLoaded;
  }

  /**
 * @todo implement Google Maps Places on Laravel server.
 */
  scanNearbyBusinesses() { }
}