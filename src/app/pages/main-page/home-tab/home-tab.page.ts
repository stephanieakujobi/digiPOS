import { Component, OnInit } from '@angular/core';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';

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
  private addressSearchbar: HTMLIonSearchbarElement;

  /**
   * Creates a new HomeTabPage
   * @param gmapsService The GoogleMapsService used to display an interactable GoogleMap to the user.
   */
  constructor(private gmapsService: GoogleMapsService) { }

  async ngOnInit() {
    this.gmapsService.initMap("map");
  }

  /**
   * @see https://ionicframework.com/docs/angular/lifecycle
   */
  ionViewDidEnter() {
    this.addressSearchbar = document.getElementById("address-searchbar") as HTMLIonSearchbarElement;
  }

  findAddress() {
    this.gmapsService.findAddress(this.addressSearchbar.value);
  }
}