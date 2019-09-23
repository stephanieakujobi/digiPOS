/*
    Author:             Adriano Cucci
    Last Modified By:   Adriano Cucci
    Date Modified:      2019/09/23
*/

import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
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
} from '@ionic-native/google-maps/ngx';

@Component({
  selector: 'app-home-tab',
  templateUrl: 'home-tab.page.html',
  styleUrls: ['home-tab.page.scss']
})

/**
 * The page displayed to the user when they select the "Home" tab.
 * Shows the user their current location on the map and provides them options to search for nearby businesses to report.
 */
export class HomeTabPage implements OnInit {
  private map: GoogleMap;
  private userMapMarker: Marker;

  /**
   * Creates a new HomeTabPage
   * @param platform The native platform. Must be in its "ready" state before displaying the map.
   * @param geolocation The native geolocation plugin to get the user's current location from their device.
   */
  constructor(private platform: Platform, private geolocation: Geolocation) { }

  /**
   * Scaffolds the map-creation process; wating fo the platform to be in its "ready" state before creating a new Google Maps instance.
   */
  async ngOnInit() {
    await this.platform.ready();
    await this.loadMap();
    this.updateUserMapLocation();
  }

  /**
   * Creates a new map on the page and centers the camera & user marker to the user's current location when initialized.
   */
  private async loadMap() {
    this.map = GoogleMaps.create("map");

    let location = await this.map.getMyLocation();

    await this.map.moveCamera({
      target: location.latLng,
      zoom: 18
    });

    await this.map.addMarker(this.createUserMapMarker(location.latLng)).then((marker: Marker) => {
      this.userMapMarker = marker;
    });
  }

  /**
   * Configures the user's map marker options for the map when the page is initialized.
   * @param latLng The coordinates to place the map marker.
   * @returns A MarkerOptions instance for the user's map marker.
   */
  private createUserMapMarker(latLng: ILatLng): MarkerOptions {
    let options: MarkerOptions = {
      position: latLng,
      icon: {
        url: "assets/images/map-icons/user-marker.png",
        size: {
          width: 28,
          height: 28
        }
      }
    }

    return options;
  }

  /**
   * Called once the map has been created and the user's marker has been added.
   * Watches the user's geolocation and updates their marker on the map to correspond with their new location.
   */
  private updateUserMapLocation() {
    this.geolocation.watchPosition().subscribe((data) => {
      let latLng = new LatLng(data.coords.latitude, data.coords.longitude);
      this.userMapMarker.setPosition(latLng);
    });
  }

  /**
   * Called from the page when the user selects the bottom-right floating action button.
   * Centers the map's camera on the user's current location.
   */
  centerMapOnUserPosition() {
    this.map.animateCamera({
      target: this.userMapMarker.getPosition(),
      duration: 500
    });
  }

  /**
   * @todo implement Google Maps Places on Laravel server.
   */
  scanNearbyBusinesses() { }
}