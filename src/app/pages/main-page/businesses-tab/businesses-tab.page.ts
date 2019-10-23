import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { BusinessViewModalPage } from './business-view-modal/business-view-modal.page';
import { Business } from 'src/app/classes/businesses/Business';
import { AppBusinessesStorageService } from 'src/app/services/businesses/storage/app-businesses-storage.service';
import { Address } from 'src/app/classes/businesses/Address';
import { BusinessPrefsModalPage } from './business-prefs/business-prefs-modal.page';
import { AppBusinessesPrefsService } from 'src/app/services/businesses/preferences/app-businesses-prefs.service';
import { AppBusinessesPrefs } from 'src/app/classes/businesses/AppBusinessesPrefs';

@Component({
  selector: 'app-businesses-tab',
  templateUrl: 'businesses-tab.page.html',
  styleUrls: ['businesses-tab.page.scss']
})

/**
 * The page displayed to the user when they select the "Businesses" tab.
 */
export class BusinessesTabPage implements OnInit {
  private prefs: AppBusinessesPrefs;

  /**
   * Creates a new BusinessTabPage
   * @param storageService The SavedBusinessesStorageService used to perform CRUD operations for Businesses under the current user's profile.
   * @param modalController The ModalController used to create modals for this page.
   * @param toastController The ToastController used to create toast messages for this page.
   */
  constructor(
    private storageService: AppBusinessesStorageService,
    private prefsService: AppBusinessesPrefsService,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  async ngOnInit() {
    this.prefs = await this.prefsService.loadPrefs();

    //TEMPORARY TEST OF ADDING A BUSINESS NON-MANUALLY.
    this.storageService.addBusiness(new Business(
      "A Saved Business",
      new Address(
        "123 Test St.",
        "Brampton",
        "ON",
        "Canada",
        "L8D1K7"
      )
    ));
  }

  /**
   * Called from the page when the user swipes right on a Business to delete it.
   * Deletes the business saved under their profile.
   * @param business The Business to delete.
   * @param ionItemSliding The HTMLIonItemSlidingElement that was swiped to close.
   * @param businessElement The HTMLElement to animate upon deletion.
   */
  async onDeleteBusiness(business: Business, ionItemSliding: HTMLIonItemSlidingElement, businessElement: HTMLElement) {
    if(this.prefs.askBeforeDelete) {
      const confirmationAlert = await this.alertController.create({
        header: "Delete Business",
        message: "Are you sure you want to delete this business?",
        buttons: [
          {
            text: "Yes",
            handler: () => this.doDeleteBusiness(business, ionItemSliding, businessElement)
          },
          {
            text: "No",
            role: "cancel",
            handler: () => ionItemSliding.close()
          },
        ]
      });

      await confirmationAlert.present();
    }
    else {
      this.doDeleteBusiness(business, ionItemSliding, businessElement);
    }
  }

  private doDeleteBusiness(business: Business, ionItemSliding: HTMLIonItemSlidingElement, businessElement: HTMLElement) {
    ionItemSliding.close();
    businessElement.classList.add("deleting");

    setTimeout(async () => {
      await this.storageService.deleteBusiness(business);
    }, 300);
  }

  /**
   * Called from the page when the user clicks on a Business.
   * Opens a BusinessViewModalPage to edit the Business. 
   * @param business The Business to edit.
   * @param ionItemSliding The optional HTMLIonItemSlidingElement that was swiped to close.
   */
  editBusinessInfo(business: Business, ionItemSliding: HTMLIonItemSlidingElement = null) {
    if(ionItemSliding != null) {
      ionItemSliding.close();
    }
    this.openBusinessViewModal(business);
  }

  /**
   * Called from the page when the user stars or un-stars a Business.
   * Updates this stared state for the Business.
   * @param business The business to star/un-star
   * @param ionItemSliding The HTMLIonItemSlidingElement that was swiped to close.
   */
  async toggleStarBusiness(business: Business, ionItemSliding: HTMLIonItemSlidingElement) {
    ionItemSliding.close();
    business.toggleStarred();
    await this.storageService.synchronize();
  }

  async openPrefsModal() {
    const modal = await this.modalController.create({
      component: BusinessPrefsModalPage,
      backdropDismiss: false,
      componentProps: {
        prefs: this.prefs
      }
    });

    await modal.present();

    await modal.onWillDismiss().then(({ data }) => {
      this.prefsService.savePrefs(data);
    });
  }

  /**
   * Creates a new BusinessViewModalPage to edit information for a Business.
   * @param existingBusiness The optional existing Business to pass to the modal, whose information will be pre-filled in its form.
   *                         If an existing Business is passed, then this Business will be updated insted, rather than added as a new saved Business.
   */
  async openBusinessViewModal(existingBusiness: Business = null) {
    const modal = await this.modalController.create({
      component: BusinessViewModalPage,
      backdropDismiss: false,
      componentProps: {
        savedBusiness: existingBusiness
      }
    });

    await modal.present();

    await modal.onWillDismiss().then(({ data }) => {
      if(data != null) {
        if(existingBusiness == null) {
          this.addSavedBusiness(data);
        }
        else {
          this.updateSavedBusiness(existingBusiness, data);
        }
      }
    });
  }

  /**
   * Called from openBusinessViewModal when the BusinessViewModalPage has been dismissed and a new Business should be saved under the current user.
   * Saves this Business under the user's profile.
   * @param business The new business to save.
   */
  private async addSavedBusiness(business: Business) {
    let didSucceed = await this.storageService.addBusiness(business);
    this.presentToast(didSucceed ? "Business added successfully." : "An error occurred while adding business.");
  }

  /**
   * Called from openBusinessViewModal when the BusinessViewModalPage has been dismissed and an existing saved Business under the current user should be updated.
   * Updates this Business under the user's profile.
   * @param original The original Business to update.
   * @param updated The new Business to replace with the original Business.
   */
  private async updateSavedBusiness(original: Business, updated: Business) {
    let didSucceed = await this.storageService.updateBusiness(original, updated);
    this.presentToast(didSucceed ? "Business updated successfully." : "An error occurred while updating business.");
  }

  /**
   * Presents a toast to the user. The toast will disappear automatically after two seconds.
   * @param message The message to display in the toast.
   */
  private async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });

    toast.present();
  }
}