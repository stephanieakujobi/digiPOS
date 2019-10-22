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
   */
  constructor(private modalController: ModalController, navParams: NavParams, private alertController: AlertController) {
    let savedBusiness = navParams.get("savedBusiness") as Business;

    if(savedBusiness != null) {
      this.business = Business.copyOf(savedBusiness);
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

  ionViewWillEnter() {
    (document.getElementById("modal-title") as HTMLIonTitleElement).textContent = this.modalTitle;
    this.validateForm();
  }

  /**
   * Called from the page when the user clicks the "X" button on the navigation bar.
   * Closes this modal page and returns back to the BusinessesTabPage.
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

  validateForm() {
    this.formIsValid =
      this.business.name != ""
      && this.business.address.street != ""
      && this.business.address.city != ""
      && this.business.address.region != "";
  }
  
  onFormSubmit() {
    this.modalController.dismiss(this.business);
  }
}