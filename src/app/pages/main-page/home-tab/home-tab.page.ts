import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';
import { MapPlace } from 'src/app/models/google-maps/MapPlace';
import { Place } from 'src/app/models/places/Place'
import { PlaceFormatter } from 'src/app/classes/places/PlaceFormatter';
import { NavController } from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { PopupsService } from 'src/app/services/global/popups/popups.service';
import { MapsPrefsModalPage } from './maps-prefs-modal/maps-prefs-modal/maps-prefs-modal.page';
import { GlobalServices } from 'src/app/classes/global/GlobalServices';
import { MapsPrefs } from 'src/app/classes/google-maps/MapsPrefs';
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
  private static reloadMarkersOnViewEnter: boolean = false;
  private static clearSearchMarkerOnViewLeave: boolean = false;

  /**
   * Creates a new HomeTabPage
   * @param gmapsService The GoogleMapsService used to display an interactable GoogleMap to the user.
   * @param navController The NavController used to redirect the user to this page from the saved Places page when viewing a saved Place on the map.
   * @param popupsService The PopupsService used to show the MapsPrefsModalPage to the user.
   * @param keyboard The Keyboard used to hide the user's device's native keyboard when searching Places.
   */
  constructor(
    private gmapsService: GoogleMapsService,
    private navController: NavController,
    private popupsService: PopupsService,
    private keyboard: Keyboard
  ) {
    this.enableFindNearby = true;

    HomeTabPage.gmapsService = this.gmapsService;
    HomeTabPage.navController = this.navController;
    
    MapsPrefsService.subscribeOnUpdated(() => this.reloadSpecialMarkers());
  }

  async ngOnInit() {
    this.gmapsService.initMap("map", () => {
      this.toggleProgressbar();
      this.reloadSpecialMarkers();
      this.mapFinishedLoading = true;
      HomeTabPage.reloadMarkersOnViewEnter = true;
    });
  }

  /**
   * @see https://ionicframework.com/docs/angular/lifecycle
   */
  async ionViewDidEnter() {
    this.progressBar = document.getElementById("progress-bar") as HTMLIonProgressBarElement;
    if(HomeTabPage.reloadMarkersOnViewEnter) {
      this.reloadSpecialMarkers();
    }
  }

  /**
   * @see https://ionicframework.com/docs/angular/lifecycle
   */
  ionViewWillLeave() {
    if(HomeTabPage.clearSearchMarkerOnViewLeave) {
      this.gmapsService.clearSearchMarker();
      HomeTabPage.clearSearchMarkerOnViewLeave = false;
    }
  }

  /**
   * Shows/Hides the HTMLIonProgressBarElement at the top of the page.
   */
  private toggleProgressbar() {
    this.progressBar.classList.toggle("hidden");
  }

  /**
   * Reloads the special PlaceMarkers from the GoogleMapsService using the user's global MapPrefs to specify which special pins should be shown on the map.
   */
  private reloadSpecialMarkers() {
    const prefs: MapsPrefs = GlobalServices.mapsPrefsService.prefs;
    this.gmapsService.pinSpecialMarkers(prefs.showSavedPlaces, prefs.showSavedReportedPlaces, prefs.showOtherReportedPlaces);
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
    this.reloadMarkersOnViewEnter = false;
    this.clearSearchMarkerOnViewLeave = true;

    const mapPlace: MapPlace = new PlaceFormatter().mapPlaceFromPlace(place);

    this.navController.navigateRoot("/main/tabs/home-tab").then(() => {
      this.gmapsService.viewPlace(mapPlace);
      setTimeout(() => this.reloadMarkersOnViewEnter = true, 1);
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

      this.gmapsService.findNearby(GlobalServices.mapsPrefsService.prefs.searchRadiusKm * 1000, () => {
        this.toggleProgressbar();
        this.enableFindNearby = true;
      });
    }
  }

  /**
   * Clears the place-search marker and nearby-search markers from the map.
   */
  clearGenericMarkers() {
    this.gmapsService.clearSearchMarker();
    this.gmapsService.clearNearbyMarkers();
  }

  /**
   * Plays the radial-wave visual effect when the user presses the nearby-search floating-action-button.
   */
  private playNearbySearchEffect() {
    const effect = document.getElementById("nearby-search-effect") as HTMLDivElement;
    effect.classList.remove("animate")
    effect.classList.add("animate");

    setTimeout(() => effect.classList.remove("animate"), 1500);
  }

  /**
   * Called from the page when the user presses the settings icon on the top-right of the page.
   * Opens the MapsPrefsModalPage for the user to configure their global MapsPrefs.
   */
  openPrefsModal() {
    this.popupsService.showModal(MapsPrefsModalPage);
  }
}