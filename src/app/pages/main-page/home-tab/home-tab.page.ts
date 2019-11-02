import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';
import { IMapPlace } from 'src/app/interfaces/google-maps/IMapPlace';

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
  private progressBar: HTMLIonProgressBarElement;
  private lastSearchedPlace: IMapPlace;

  /**
   * Creates a new HomeTabPage
   * @param gmapsService The GoogleMapsService used to display an interactable GoogleMap to the user.
   */
  constructor(private gmapsService: GoogleMapsService) { }

  async ngOnInit() {
    this.gmapsService.initMap("map", () => {
      this.toggleProgressbar();
      document.getElementById("controls").classList.remove("hidden");
    });
  }

  ionViewDidEnter() {
    this.progressBar = document.getElementById("progress-bar") as HTMLIonProgressBarElement;
    this.gmapsService.markSavedPlaces();

    if(this.lastSearchedPlace != null) {
      this.gmapsService.updateSavedPlace(this.lastSearchedPlace);
      this.gmapsService.addPlaceSearchMarker(this.lastSearchedPlace);
    }
  }

  ionViewWillLeave() {
    this.gmapsService.clearMarkers();
  }

  findAddress() {
    let address = (document.getElementById("address-searchbar") as HTMLIonSearchbarElement).value;
    if(address != "") {
      this.toggleProgressbar();

      this.gmapsService.findAddress(address, (place: IMapPlace) => {
        this.lastSearchedPlace = place;
        this.toggleProgressbar();
      });
    }
  }

  private toggleProgressbar() {
    this.progressBar.classList.toggle("hidden");
  }
}