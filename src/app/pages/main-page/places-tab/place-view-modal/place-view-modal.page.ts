import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Place } from 'src/app/models/places/Place';
import { PlaceFormatter } from 'src/app/classes/places/PlaceFormatter';
import { PopupsService } from 'src/app/services/global/popups.service';
import { FirebasePlacesService } from 'src/app/services/firebase/places/firebase-places.service';

@Component({
  selector: 'app-place-view-modal',
  templateUrl: './place-view-modal.page.html',
  styleUrls: ['./place-view-modal.page.scss'],
})
/**
 * The modal page displayed to the user when they click on a saved Place to view/edit.
 */
export class PlaceViewModalPage {
  private place: Place;
  private originalPlace: Place;
  private modalTitle: string;

  private formIsValid: boolean; //Interpolated in place-view-modal.page.html
  private isAddingNewPlace: boolean; //Interpolated in place-view-modal.page.html

  private pFormatter: PlaceFormatter;
  private fbpService: FirebasePlacesService;
  private otherSavedPlaces: Place[];

  /**
   * Creates a new PlaceViewModalPage
   * @param modalController The reference to the ModalController that created this modal.
   * @param navParams Any possible parameters passed to this modal upon creation. Used to check if this modal is viewing a new or existing place.
   * @param popupsService The PopupsService used to display alerts and toasts to the user.
   */
  constructor(private modalController: ModalController, private navParams: NavParams, private popupsService: PopupsService) {
    this.pFormatter = new PlaceFormatter();
    this.fbpService = this.navParams.get("fbpService") as FirebasePlacesService;
    this.initPlaceData();
  }

  /**
   * @see https://ionicframework.com/docs/angular/lifecycle
   */
  ionViewWillEnter() {
    (document.getElementById("modal-title") as HTMLIonTitleElement).textContent = this.modalTitle;
    this.validateForm();
  }

  /**
   * Checks if an existing Place instance has been passed from the NavParams to display.
   * If an existing Place has been passed, then the data from the Place will be pre-filled into the modal page's input fields,
   * else a blank Place template will be displayed instead.
   */
  private initPlaceData() {
    let existingPlace = this.navParams.get("existingPlace") as Place;

    if(existingPlace != null) {
      this.place = this.pFormatter.clonePlace(existingPlace);
      this.modalTitle = "Edit Place";
      this.otherSavedPlaces = this.fbpService.savedPlaces.filter(b => b.info.address.addressString !== existingPlace.info.address.addressString);
      this.isAddingNewPlace = false;
    }
    else {
      this.place = this.pFormatter.blankPlace();
      this.place.wasManuallySaved = true;
      this.modalTitle = "Add Place";
      this.otherSavedPlaces = this.fbpService.savedPlaces;
      this.isAddingNewPlace = true;
    }

    this.originalPlace = this.pFormatter.clonePlace(this.place);
  }

  /**
   * Called from the page when the user clicks the "X" button on the navigation bar.
   * Checks if the user has made any edits in the form, and if so, displays an alert to the user prompting if they're sure they want to 
   * close this modal without saving their changes, else just closes the modal.
   */
  async onCloseButtonClicked() {
    const changesWereMade = JSON.stringify(this.place) !== JSON.stringify(this.originalPlace);

    if(changesWereMade) {
      this.popupsService.showConfirmationAlert("Discard Changes", "Are you sure you want to discard your changes?", () => this.discard(), null);
    }
    else {
      this.discard();
    }
  }

  /**
   * Dismisses this modal page with no returned Place data.
   */
  private discard() {
    this.modalController.dismiss({
      action: "discarded",
      place: null
    });
  }

  /**
   * Checks if the form on this modal is valid by verifying that the Place has been given a name and an Address.
   * All other fields, plus the postal code of the Address, are optional.
   */
  validateForm() {
    this.formIsValid = this.place.info.name != "" && this.place.info.address.addressString != "";
  }

  /**
   * Called from the page when the user clicks on the checkmark button to submit the form.
   * Dismisses this modal and passes its Place back.
   */
  onFormSubmit() {
    this.pFormatter.trimPlace(this.place);

    if(this.addressIsDuplicate(this.place.info.address.addressString)) {
      this.popupsService.showAlert("Duplicate Address", "A saved place with this address already exists.", "OK");
    }
    else {
      this.modalController.dismiss({
        action: "edited",
        place: this.place
      });
    }
  }

  /**
   * Called from the page when the user presses the button to report a Place.
   * Checks if any key input values have not been filled in before reporting the Place, and if so, prompts the user for confirmation
   * that they wish to report a Place with some missing information.
   */
  onReportPlace() {
    const ownerValues = Object.values(this.place.info.owner);
    const contactPersonValues = Object.values(this.place.info.contactPerson);
    const currentProviderValue = this.place.info.currentProvider;

    if(ownerValues.includes("") || contactPersonValues.includes("") || currentProviderValue == "") {
      this.popupsService.showConfirmationAlert("Missing Information", "Some information about this place is missing. Are you sure you want to report it?",
        () => this.doReportPlace(),
        null);
    }
    else {
      this.doReportPlace();
    }
  }

  /**
   * Called from onReportPlace when it has been confirmed that the Place can be reported.
   * Uses the FirebaseBusinessService to report the Place.
   */
  private doReportPlace() {
    this.fbpService.reportPlace(this.place, result => {
      this.popupsService.showToast(result.message);

      if(result.wasSuccessful) {
        this.place.isReported = true;

        this.modalController.dismiss({
          action: "reported",
          place: this.place
        });
      }
    });
  }

  /**
   * Called from onFormSubmit.
   * Checks if the address that the user has entered into the form already exists in the user's saved Places.
   * If so, they will be alerted that they cannot save this duplicate address.
   * @param address The address string to compare.
   */
  private addressIsDuplicate(address: string): boolean {
    let result = false;

    const formattedAddress: string = this.pFormatter.formatAddressString(address).toLowerCase();

    for(const place of this.otherSavedPlaces) {
      if(formattedAddress === place.info.address.addressString) {
        result = true;
        break;
      }
    }

    return result;
  }
}