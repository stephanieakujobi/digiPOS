import { Component } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { Business } from 'src/app/classes/businesses/Business';

@Component({
  selector: 'app-business-view-modal',
  templateUrl: './business-view-modal.page.html',
  styleUrls: ['./business-view-modal.page.scss'],
})
export class BusinessViewModalPage {
  private business: Business;
  private modalTitle: string;
  private isViewingSavedBusiness: boolean; //Interpolated in business-view-modal.page.html
  private formIsValid: boolean; //Interpolated in business-view-modal.page.html

  /**
   * Creates a new BusinessViewModalPage
   * @param modalController The reference to the ModalController that created this modal.
   * @param navParams Any possible parameters passed to this modal upon creation. Used to check if this modal is viewing a new or existing business.
   * @param alertController The AlertController used to prompt the user for confirmation when they close this modal without saving changes.
   */
  constructor(private modalController: ModalController, navParams: NavParams, private alertController: AlertController) {
    let savedBusiness = navParams.get("savedBusiness") as Business;

    if(savedBusiness != null) {
      this.business = savedBusiness.clone();
      this.isViewingSavedBusiness = true;
      this.modalTitle = "Edit Business";
    }
    else {
      this.business = new Business();
      this.business.wasManuallySaved = true;
      this.isViewingSavedBusiness = false;
      this.modalTitle = "Add Business";
    }
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
   * Prompts the user if they're sure they want to close this modal without saving their changes,
   * and returns back to the BusinessesTabPage if so.
   */
  async onCloseButtonClicked() {
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

  /**
   * Checks if the form on this modal is valid by verifying that the Business has been given a name and address.
   * All other fields are optional.
   */
  validateForm() {
    this.formIsValid =
      this.business.name != ""
      && this.business.address.street != ""
      && this.business.address.city != ""
      && this.business.address.region != "";
  }

  /**
   * Called from the page when the user clicks on the checkmark button to submit the form.
   * Dismisses this modal and passes its Business back.
   */
  onFormSubmit() {
    this.modalController.dismiss(this.business);
  }
}