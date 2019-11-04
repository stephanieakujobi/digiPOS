import { Component } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { IBusiness } from 'src/app/interfaces/businesses/IBusiness';
import { BusinessFormatter } from 'src/app/classes/businesses/BusinessFormatter';
import { PopupsService } from 'src/app/services/global/popups.service';
import { FirebaseBusinessService } from 'src/app/services/firebase/businesses/firebase-business.service';
import { CRUDResult } from 'src/app/classes/CRUDResult';

@Component({
  selector: 'app-business-view-modal',
  templateUrl: './business-view-modal.page.html',
  styleUrls: ['./business-view-modal.page.scss'],
})
export class BusinessViewModalPage {
  private business: IBusiness;
  private originalBusiness: IBusiness;
  private modalTitle: string;

  private formIsValid: boolean; //Interpolated in business-view-modal.page.html
  private isAddingNewPlace: boolean; //Interpolated in business-view-modal.page.html

  private bFormatter: BusinessFormatter;
  private fbbService: FirebaseBusinessService;
  private otherSavedBusinesses: IBusiness[];


  /**
   * Creates a new BusinessViewModalPage
   * @param modalController The reference to the ModalController that created this modal.
   * @param navParams Any possible parameters passed to this modal upon creation. Used to check if this modal is viewing a new or existing business.
   */
  constructor(private modalController: ModalController, private navParams: NavParams, private popupsService: PopupsService) {
    this.bFormatter = new BusinessFormatter();
    this.fbbService = this.navParams.get("fbbService") as FirebaseBusinessService;
    let existingBusiness = this.navParams.get("existingBusiness") as IBusiness;

    if(existingBusiness != null) {
      this.business = this.bFormatter.cloneBusiness(existingBusiness);
      this.modalTitle = "Edit Business";
      this.otherSavedBusinesses = this.fbbService.businesses.filter(b => b.info.address.addressString !== existingBusiness.info.address.addressString);
      this.isAddingNewPlace = false;
    }
    else {
      this.business = this.bFormatter.blankBusiness();
      this.business.wasManuallySaved = true;
      this.modalTitle = "Add Business";
      this.otherSavedBusinesses = this.fbbService.businesses;
      this.isAddingNewPlace = true;
    }

    this.originalBusiness = this.bFormatter.cloneBusiness(this.business);
  }

  /**
   * @see https://ionicframework.com/docs/angular/lifecycle
   */
  ionViewWillEnter() {
    (document.getElementById("modal-title") as HTMLIonTitleElement).textContent = this.modalTitle;
    this.validateForm();
  }

  /**
   * Called from the page when the user clicks the "X" button on the navigation bar.
   * Checks if the user has made any edits in the form, and if so, displays an alert to the user prompting if they're sure they want to 
   * close this modal without saving their changes, else just closes the modal.
   */
  async onCloseButtonClicked() {
    const changesWereMade = JSON.stringify(this.business) !== JSON.stringify(this.originalBusiness);

    if(changesWereMade) {
      this.popupsService.showConfirmationAlert("Discard Changes", "Are you sure you want to discard your changes?", () => this.modalController.dismiss(), null);
    }
    else {
      this.modalController.dismiss({
        action: "discarded",
        business: null
      });
    }
  }

  /**
   * Checks if the form on this modal is valid by verifying that the Business has been given a name and an Address.
   * All other fields, plus the postal code of the Address, are optional.
   */
  validateForm() {
    this.formIsValid =
      this.business.info.name != ""
      && this.business.info.address.addressString != ""
  }

  /**
   * Called from the page when the user clicks on the checkmark button to submit the form.
   * Dismisses this modal and passes its Business back.
   */
  onFormSubmit() {
    if(this.addressIsDuplicate()) {
      this.popupsService.showAlert("Duplicate Address", "A saved place with this address already exists.", "OK");
    }
    else {
      this.bFormatter.trimBusiness(this.business);
      this.modalController.dismiss({
        action: "edited",
        business: this.business
      });
    }
  }

  onReportBusiness() {
    const ownerValues = Object.values(this.business.info.owner);
    const contactPersonValues = Object.values(this.business.info.contactPerson);
    const currentProviderValue = this.business.info.currentProvider;

    if(ownerValues.includes("") || contactPersonValues.includes("") || currentProviderValue == "") {
      this.popupsService.showConfirmationAlert("Missing Information", "Some information about this bussiness is missing. Are you sure you want to report it?",
        () => this.doReportBusiness(),
        null);
    }
    else {
      this.doReportBusiness();
    }
  }

  private doReportBusiness() {
    this.fbbService.reportBusiness(this.business, result => {
      this.popupsService.showToast(result.message);

      if(result.wasSuccessful) {
        this.modalController.dismiss({
          action: "reported",
          business: this.business
        });
      }
    });
  }

  private addressIsDuplicate(): boolean {
    let result = false;

    const addressString: string = this.bFormatter.formatAddressString(this.business.info.address.addressString).toLowerCase();

    for(const business of this.otherSavedBusinesses) {
      if(addressString === business.info.address.addressString) {
        result = true;
        break;
      }
    }

    return result;
  }
}