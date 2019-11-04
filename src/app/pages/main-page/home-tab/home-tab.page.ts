import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';
import { IMapPlace } from 'src/app/interfaces/google-maps/IMapPlace';
import { IBusiness } from 'src/app/interfaces/businesses/IBusiness';
import { BusinessFormatter } from 'src/app/classes/businesses/BusinessFormatter';
import { NavController } from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';

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

  private static gmapsService: GoogleMapsService;
  private static navController: NavController;

  /**
   * Creates a new HomeTabPage
   * @param gmapsService The GoogleMapsService used to display an interactable GoogleMap to the user.
   */
  constructor(private gmapsService: GoogleMapsService, private navController: NavController, private keyboard: Keyboard) {
    HomeTabPage.gmapsService = this.gmapsService;
    HomeTabPage.navController = this.navController;
  }

  async ngOnInit() {
    this.gmapsService.initMap("map", () => {
      this.toggleProgressbar();
      document.getElementById("controls").classList.remove("hidden");
      this.gmapsService.pinSavedPlaces();
    });
  }

  ionViewDidEnter() {
    this.progressBar = document.getElementById("progress-bar") as HTMLIonProgressBarElement;
  }

  findAddress() {
    let address = (document.getElementById("address-searchbar") as HTMLIonSearchbarElement).value;

    if(address != "") {
      this.toggleProgressbar();
      this.keyboard.hide();

      this.gmapsService.findAddress(address, () => {
        this.toggleProgressbar();
      });
    }
  }

  public static showSavedBusiness(business: IBusiness) {
    this.navController.navigateRoot("/main/tabs/home-tab").then(() => {
      const place: IMapPlace = new BusinessFormatter().businessToMapPlace(business);
      this.gmapsService.centerOnSavedPlace(place);
    });
  }

  findNearby() {
    this.toggleProgressbar();

    this.gmapsService.findNearby(5000, () => {
      this.toggleProgressbar();
    });
  }

  private toggleProgressbar() {
    this.progressBar.classList.toggle("hidden");
  }
}