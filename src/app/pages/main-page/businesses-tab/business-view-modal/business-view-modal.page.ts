import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Business } from 'src/app/classes/businesses/Business';

@Component({
  selector: 'app-business-view-modal',
  templateUrl: './business-view-modal.page.html',
  styleUrls: ['./business-view-modal.page.scss'],
})
export class BusinessViewModalPage {
  private static _business = new Business();

  private formIsValid: boolean; //Interpolated in business-view-modal.page.html

  /**
   * Creates a new BusinessViewModalPage
   * @param modalController The reference to the ModalController that created this modal.
   */
  constructor(private modalController: ModalController, navParams: NavParams) {
    let existingBusiness = navParams.get("existingBusiness") as Business;

    if(existingBusiness != null) {
      BusinessViewModalPage._business = existingBusiness;
    }
  }

  /**
   * Called from the page when the user clicks the "X" button on the navigation bar.
   * Closes this modal page and returns back to the BusinessesTabPage.
   */
  dismissCancel() {
    this.modalController.dismiss();
  }

  dismissSave() {
    this.modalController.dismiss(this.business);
  }

  validateForm() {
    this.formIsValid =
      this.business.name != ""
      && this.business.address.street != ""
      && this.business.address.city != ""
      && this.business.address.region != "";
  }

  public get business(): Business {
    return BusinessViewModalPage._business;
  }
}
