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
  private isViewingSavedBusiness: boolean; //Interpolated in business-view-modal.page.html
  private formIsValid: boolean; //Interpolated in business-view-modal.page.html

  /**
   * Creates a new BusinessViewModalPage
   * @param modalController The reference to the ModalController that created this modal.
   * @param navParams Any possible parameters passed to this modal upon creation. Used to check if this modal is viewing a new or existing business.
   * @param alertController The AlertController used to prompt the user for confirmation when they close this modal without saving changes.
   */
  constructor(private modalController: ModalController, private navParams: NavParams, private alertController: AlertController) {
    let savedBusiness = this.navParams.get("savedBusiness") as IBusiness;

    if(savedBusiness != null) {
      this.business = BusinessFormatter.cloneBusiness(savedBusiness);
      this.isViewingSavedBusiness = true;
      this.modalTitle = "Edit Business";
    }
    else {
      this.business = BusinessFormatter.blankBusiness();
      this.business.wasManuallySaved = true;
      this.isViewingSavedBusiness = false;
      this.modalTitle = "Add Business";
    }

    this.originalBusiness = BusinessFormatter.cloneBusiness(this.business);
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
      && this.business.address.street != ""
      && this.business.address.city != ""
      && this.business.address.region != ""
      && this.business.address.country != "";
  }

  /**
   * Called from the page when the user clicks on the checkmark button to submit the form.
   * Dismisses this modal and passes its Business back.
   */
  onFormSubmit() {
    BusinessFormatter.trimBusiness(this.business);
    this.modalController.dismiss(this.business);
  }
}