/*
    Author:             Adriano Cucci
    Last Modified By:   Adriano Cucci
    Date Modified:      2019/09/22
*/

import { Component } from '@angular/core';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation,
  Environment,
  GoogleMapOptions
} from '@ionic-native/google-maps/ngx';
import { Platform } from '@ionic/angular';
import { MarkerOptions } from '@ionic-native/google-maps';

@Component({
  selector: 'app-home-tab',
  templateUrl: 'home-tab.page.html',
  styleUrls: ['home-tab.page.scss']
})

/**
 * The page displayed to the user when they select the "Home" tab.
 */
export class HomeTabPage {
  private map: GoogleMap;

  constructor(private platform: Platform) {
    this.platform.ready().then(() => {
      this.loadMap();
    });
  }

  async loadMap() {
    this.map = GoogleMaps.create('map');

    this.map.getMyLocation().then((location) => {
      this.map.moveCamera({
        target: location.latLng,
        zoom: 18
      });

      this.map.addMarker({
        position: location.latLng,
      });
    });
  }
}