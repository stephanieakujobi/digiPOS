import { Component } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { IBusiness } from 'src/app/interfaces/businesses/IBusiness';
import { BusinessFormatter } from 'src/app/classes/businesses/BusinessFormatter';

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

  private bFormatter: BusinessFormatter;
  private otherSavedBusinesses: IBusiness[];

  /**
   * Creates a new BusinessViewModalPage
   * @param modalController The reference to the ModalController that created this modal.
   * @param navParams Any possible parameters passed to this modal upon creation. Used to check if this modal is viewing a new or existing business.
   * @param alertController The AlertController used to prompt the user for confirmation when they close this modal without saving changes.
   */
  constructor(private modalController: ModalController, private navParams: NavParams, private alertController: AlertController) {
    this.bFormatter = new BusinessFormatter();
    this.otherSavedBusinesses = this.navParams.get("allBusinesses") as IBusiness[];
    let existingBusiness = this.navParams.get("existingBusiness") as IBusiness;

    if(existingBusiness != null) {
      this.business = this.bFormatter.cloneBusiness(existingBusiness);
      this.modalTitle = "Edit Business";
      this.otherSavedBusinesses = this.otherSavedBusinesses.filter(b => b.address.addressString !== existingBusiness.address.addressString);
    }
    else {
      this.business = this.bFormatter.blankBusiness();
      this.business.wasManuallySaved = true;
      this.modalTitle = "Add Business";
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
      const confirmationAlert = await this.alertController.create({
        header: "Discard Changes",
        message: "Are you sure you want to discard your changes?",
        buttons: [
          {
            text: "Yes",
            handler: () => this.modalController.dismiss()
          },
          {
            text: "No",
            role: "cancel",
          },
        ]
      });

      await confirmationAlert.present();
    }
    else {
      this.modalController.dismiss();
    }
  }

  /**
   * Checks if the form on this modal is valid by verifying that the Business has been given a name and an Address.
   * All other fields, plus the postal code of the Address, are optional.
   */
  validateForm() {
    this.formIsValid =
      this.business.name != ""
      && this.business.address.addressString != ""
  }

  /**
   * Called from the page when the user clicks on the checkmark button to submit the form.
   * Dismisses this modal and passes its Business back.
   */
  onFormSubmit() {
    if(this.addressIsDuplicate()) {
      this.displayDuplicateAddressAlert();
    }
    else {
      this.bFormatter.trimBusiness(this.business);
      this.modalController.dismiss(this.business);
    }
  }

  private addressIsDuplicate(): boolean {
    let result = false;

    const addressString: string = this.bFormatter.formatAddressString(this.business.address).toLowerCase();

    for (const business of this.otherSavedBusinesses) {
      if(addressString === this.bFormatter.formatAddressString(business.address).toLowerCase()) {
        result = true;
        break;
      }
    }

    return result;
  }

  private async displayDuplicateAddressAlert() {
    const alert = await this.alertController.create({
      header: "Cannot save Business",
      message: "The address of this business already exists in your saved businesses.",
      buttons: [
        {
          text: "OK",
          role: "cancel",
        }
      ]
    });

    await alert.present();
  }
}