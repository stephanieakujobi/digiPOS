import { Component } from '@angular/core';
import { PlaceViewModalPage } from './place-view-modal/place-view-modal.page';
import { PlacesPrefsModalPage } from './places-prefs/places-prefs-modal.page';
import { CRUDResult } from 'src/app/classes/CRUDResult';
import { FirebasePlacesService } from 'src/app/services/firebase/places/firebase-places.service';
import { Place } from 'src/app/models/places/Place';
import { PopupsService } from 'src/app/services/global/popups/popups.service';
import { ComponentRef, ComponentProps } from '@ionic/core';
import { HomeTabPage } from '../home-tab/home-tab.page';
import { GlobalServices } from 'src/app/classes/global/GlobalServices';

/**
 * The page displayed to the user when they select the "Places" tab.
 */
@Component({
  selector: 'app-places-tab',
  templateUrl: 'places-tab.page.html',
  styleUrls: ['places-tab.page.scss']
})
export class PlacesTabPage {
  /**
   * Creates a new PlaceTabPage.
   * @param fbpService The FirebasePlacesService used to execute CRUD operations on the user's saved Places.
   * @param popupsService The PopupsService used to display alerts, toasts, and modals.
   */
  constructor(private fbpService: FirebasePlacesService, private popupsService: PopupsService) { }

  /**
   * @see https://ionicframework.com/docs/angular/lifecycle
   */
  ionViewDidEnter() {
    this.sortPlaces();
  }

  /**
   * A function called from the page when the user sorts their saved Places.
   * Reads the value of the ion-select element on the page and calls the appropriate sort function.
   */
  sortPlaces() {
    if(this.fbpService.savedPlaces != null) {
      const sortSelect = document.getElementById("sort-by-select") as HTMLIonSelectElement;

      switch(sortSelect.value) {
        default:
          this.sortPlacesAscDesc(true);
          break;
        case "descending":
          this.sortPlacesAscDesc(false);
          break;
        case "starred":
          this.sortPlacesByStarred();
          break;
        case "reported":
          this.sortPlacesByReported();
          break;
        case "savedMap":
          this.sortPlacesByMapSave();
          break;
        case "savedManual":
          this.sortPlacesByManualSave();
          break;
      }
    }
  }

  /**
   * Sorts the list of saved Places by name in ascending or descending order.
   * @param ascending If true, the list will be sorted in ascending order, else in descending order.
   */
  private sortPlacesAscDesc(ascending: boolean) {
    this.fbpService.savedPlaces.sort((p1, p2) => {
      let result: number;
      const p1Name = p1.info.name.toLowerCase();
      const p2Name = p2.info.name.toLowerCase();

      if(p1Name < p2Name) {
        result = ascending ? -1 : 1;
      }
      else if(p1Name > p2Name) {
        result = ascending ? 1 : -1;
      }
      else {
        result = 0;
      }

      return result;
    });
  }

  /**
   * Sorts the list of saved Places by displaying all starred Places at the top of the list first.
   */
  private sortPlacesByStarred() {
    this.fbpService.savedPlaces.sort(p => p.saveState == "starred" ? -1 : 0);
  }

  /**
   * Sorts the list of saved Places by displaying all reported Places at the top of the list first.
   */
  private sortPlacesByReported() {
    this.fbpService.savedPlaces.sort(p => p.isReported ? -1 : 0);
  }

  /**
   * Sorts the list of saved Places by displaying all Places saved from the map first.
   */
  private sortPlacesByMapSave() {
    this.fbpService.savedPlaces.sort(p => !p.wasManuallySaved ? -1 : 0);
  }

  /**
   * Sorts the list of saved Places by displaying all Places saved manually by the user first.
   */
  private sortPlacesByManualSave() {
    this.fbpService.savedPlaces.sort(p => p.wasManuallySaved ? -1 : 0);
  }

  /**
   * Called from the page when the user inputs into the ion-searchbar on the page.
   * Filters the list of saved Places, hiding the ones whose names or addresses do not match the string that the user has inputted.
   * @param event The input event passed, containing the ion-searchbar's value.
   */
  searchPlaces(event: CustomEvent) {
    const searchQuery = (event.detail.value as string).toLowerCase();
    const elements = Array.from(document.querySelectorAll(".list-item.place")) as HTMLElement[];
    const arrLength = elements.length;

    for(let i = 0; i < arrLength; i++) {
      const elementName = (elements[i].querySelector(".place-name") as HTMLElement).innerText.toLowerCase();
      const elementAddress = (elements[i].querySelector(".place-address") as HTMLElement).innerText.toLowerCase();

      if(elementName.includes(searchQuery) || elementAddress.includes(searchQuery)) {
        elements[i].classList.remove("deleting");
      }
      else {
        elements[i].classList.add("deleting");
      }
    }
  }

  /**
   * Called from the page when the user attempts to delete a Place.
   * Checks the user's Places preferences to see if the user should be prompted before deleting the Place.
   * @param place The Place to delete.
   * @param ionItemSliding The HTMLIonItemSlidingElement that was swiped to close.
   * @param placeElement The HTMLElement to animate upon deletion.
   */
  async onDeletePlace(place: Place, ionItemSliding: HTMLIonItemSlidingElement, placeElement: HTMLElement) {
    if(GlobalServices.placesPrefsService.prefs.askBeforeDelete) {
      this.popupsService.showConfirmationAlert("Delete Place", "Are you sure you want to delete this place?",
        () => this.doDeletePlace(place, ionItemSliding, placeElement),
        () => ionItemSliding.close()
      );
    }
    else {
      this.doDeletePlace(place, ionItemSliding, placeElement);
    }
  }

  /**
   * Called from onDeletePlace after it has been confirmed that Place can be deleted.
   * Animates the Place deleting before removing it from storage.
   * @param place The Place to delete.
   * @param ionItemSliding The HTMLIonItemSlidingElement that was swiped to close.
   * @param placeElement The HTMLElement to animate upon deletion.
   */
  private doDeletePlace(place: Place, ionItemSliding: HTMLIonItemSlidingElement, placeElement: HTMLElement) {
    ionItemSliding.close();
    placeElement.classList.add("deleting");

    setTimeout(async () => {
      const result: CRUDResult = await this.fbpService.deletePlace(place);
      this.popupsService.showToast(result.message);

      if(!result.wasSuccessful) {
        placeElement.classList.remove("deleting");
      }

      this.sortPlaces();
    }, 300);
  }

  /**
   * Called from the page when the user clicks on a Place.
   * Opens a PlaceViewModalPage to edit the Place. 
   * @param place The Place to edit.
   * @param ionItemSliding The optional HTMLIonItemSlidingElement that was swiped to close.
   */
  editPlaceInfo(place: Place, ionItemSliding: HTMLIonItemSlidingElement = null) {
    if(ionItemSliding != null) {
      ionItemSliding.close();
    }
    this.openPlaceViewModal(place);
  }

  /**
   * Called from the page when the user stars or un-stars a Place.
   * Updates this stared state for the Place.
   * @param place The place to star/un-star
   * @param ionItemSliding The HTMLIonItemSlidingElement that was swiped to close.
   */
  onStarPlace(place: Place, ionItemSliding: HTMLIonItemSlidingElement) {
    ionItemSliding.close();

    setTimeout(async () => {
      const result: CRUDResult = await this.fbpService.togglePlaceStarred(place);

      if(result.wasSuccessful) {
        this.sortPlaces();
      }

      this.popupsService.showToast(result.message);
    }, 250);
  }

  /**
   * Called from the page when the user presses the button to view a place on the HomeTabPage's map.
   * References the HomeTabPage to redirect the user.
   * @param place The Place to show on the HomeTabPage's map.
   */
  onViewPlaceOnMap(place: Place) {
    HomeTabPage.viewSavedPlace(place);
  }

  /**
   * Called from the page when the user presses the settings icon on the navigation bar.
   * Opens a modal page containing the user preferences for saved Places, allowing the user to edit them.
   * Once the user closes the modal, their preferences are saved.
   */
  async openPrefsModal() {
    this.popupsService.showModal(PlacesPrefsModalPage);
  }

  /**
   * Creates a new PlaceViewModalPage to edit information for a Place.
   * @param existingPlace The optional existing Place to pass to the modal, whose information will be pre-filled in its form.
   *                      If an existing Place is passed, then this Place will be updated insted, rather than added as a new saved Place.
   */
  async openPlaceViewModal(existingPlace?: Place) {
    const props: ComponentProps<ComponentRef> = {
      existingPlace: existingPlace,
      fbpService: this.fbpService
    }

    this.popupsService.showModal(PlaceViewModalPage, props, data => {
      if(data.action != "discarded") {
        if(data.action == "edited" && existingPlace == null) {
          this.addSavedPlace(data.place);
        }
        else if(data.action == "edited" || data.action == "reported") {
          this.updateSavedPlace(existingPlace, data.place, data.action == "edited");
        }
      }
    });
  }

  /**
   * Called from openPlaceViewModal when the PlaceViewModalPage has been dismissed and a new Place should be saved under the current user.
   * Saves this Place under the user's profile.
   * @param place The new place to save.
   */
  private async addSavedPlace(place: Place) {
    const result: CRUDResult = await this.fbpService.addPlace(place);
    this.popupsService.showToast(result.message);

    if(result.wasSuccessful) {
      this.sortPlaces();
    }
  }

  /**
   * Called from openPlaceViewModal when the PlaceViewModalPage has been dismissed and an existing saved Place under the current user should be updated.
   * Updates this Place under the user's profile.
   * @param original The original Place to update.
   * @param updated The new Place to replace with the original Place.
   * @param showResultToast Whether or not to display a toast message to the user upon update.
   */
  private async updateSavedPlace(original: Place, updated: Place, showResultToast: boolean) {
    const result: CRUDResult = await this.fbpService.updatePlace(original, updated);

    if(showResultToast) {
      this.popupsService.showToast(result.message);
    }

    if(result.wasSuccessful) {
      this.sortPlaces();
    }
  }
}