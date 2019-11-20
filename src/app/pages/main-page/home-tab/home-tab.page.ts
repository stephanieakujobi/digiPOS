import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';
import { MapPlace } from 'src/app/models/google-maps/MapPlace';
import { Place } from 'src/app/models/places/Place'
import { PlaceFormatter } from 'src/app/classes/places/PlaceFormatter';
import { NavController } from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { PopupsService } from 'src/app/services/global/popups.service';
import { MapsPrefsModalPage } from './maps-prefs-modal/maps-prefs-modal/maps-prefs-modal.page';
import { MapsPrefsService } from 'src/app/services/google-maps/preferences/maps-prefs.service';

/**
 * The page displayed to the user when they select the "Home" tab.
 * Shows the user their current location on the map and provides them options to search for nearby places to report.
 */
@Component({
  selector: 'app-home-tab',
  templateUrl: 'home-tab.page.html',
  styleUrls: ['home-tab.page.scss']
})
export class HomeTabPage implements OnInit {
  private progressBar: HTMLIonProgressBarElement;
  private enableFindNearby: boolean;
  private mapFinishedLoading: boolean; //interpolated in home-tab.page.html

  private static gmapsService: GoogleMapsService;
  private static navController: NavController;

  /**
   * Creates a new HomeTabPage
   * @param gmapsService The GoogleMapsService used to display an interactable GoogleMap to the user.
   * @param navController The NavController used to redirect the user to this page from the saved Places page when viewing a saved Place on the map.
   * @param popupsService The PopupsService used to show the MapsPrefsModalPage to the user.
   * @param prefsService The MapsPrefsService used to update the user's Google Maps prefernces. 
   * @param keyboard The Keyboard used to hide the user's device's native keyboard when searching Places.
   */
  constructor(
    private gmapsService: GoogleMapsService,
    private navController: NavController,
    private popupsService: PopupsService,
    private prefsService: MapsPrefsService,
    private keyboard: Keyboard
  ) {
    this.enableFindNearby = true;

    HomeTabPage.gmapsService = this.gmapsService;
    HomeTabPage.navController = this.navController;
  }

  async ngOnInit() {
    this.gmapsService.initMap("map", () => {
      this.toggleProgressbar();
      this.gmapsService.pinSavedPlaces();
      this.gmapsService.pinReportedPlaces();
      this.mapFinishedLoading = true;
    });
  }

  /**
   * @see https://ionicframework.com/docs/angular/lifecycle
   */
  ionViewDidEnter() {
    this.progressBar = document.getElementById("progress-bar") as HTMLIonProgressBarElement;
  }

  /**
   * Called from the page when the user enters an input on the searchbar.
   * Uses the GoogleMapsService to search for a place with the text value that the user has entered.
   */
  findPlace() {
    let address = (document.getElementById("places-searchbar") as HTMLIonSearchbarElement).value;

    if(address != "") {
      this.toggleProgressbar();
      this.keyboard.hide();

      this.gmapsService.findPlace(address, () => {
        this.toggleProgressbar();
      });
    }
  }

  /**
   * A static function allowing the user to select one of their saved Places from the PlacesTabPage to view on the HomeTabPage's map.
   * When called, the user will be redirected to the HomeTabPage and their selected place will be pinned & centered on the map.
   * @param place The Place to view on the map.
   */
  public static viewSavedPlace(place: Place) {
    this.navController.navigateRoot("/main/tabs/home-tab").then(() => {
      const mapPlace: MapPlace = new PlaceFormatter().mapPlaceFromPlace(place);
      this.gmapsService.viewSavedPlace(mapPlace);
    });
  }

  /**
   * Called from the page when the user presses the pin icon.
   * Uses the GoogleMapsService to pin all nearby businesses within a 5000 meter radius.
   */
  findNearby() {
    if(this.enableFindNearby) {
      this.toggleProgressbar();
      this.playNearbySearchEffect();
      this.enableFindNearby = false;

      this.gmapsService.findNearby(100000, () => {
        this.toggleProgressbar();
        this.enableFindNearby = true;
      });
    }
  }

  /**
   * Shows/Hides the HTMLIonProgressBarElement at the top of the page.
   */
  private toggleProgressbar() {
    this.progressBar.classList.toggle("hidden");
  }

  private playNearbySearchEffect() {
    const effect = document.getElementById("nearby-search-effect") as HTMLDivElement;
    effect.classList.remove("animate")
    effect.classList.add("animate");

    setTimeout(() => effect.classList.remove("animate"), 1500);
  }

  openPrefsModal() {
    this.popupsService.showModal(MapsPrefsModalPage, null, data => {

    });
  }
}