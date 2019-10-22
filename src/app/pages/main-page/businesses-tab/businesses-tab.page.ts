import { Component } from '@angular/core';
import { ModalController, IonItemSliding, ToastController } from '@ionic/angular';
import { BusinessViewModalPage } from './business-view-modal/business-view-modal.page';
import { Business } from 'src/app/classes/businesses/Business';
import { SavedBusinessesStorageService } from 'src/app/services/businesses/storage/saved-businesses-storage.service';

@Component({
  selector: 'app-businesses-tab',
  templateUrl: 'businesses-tab.page.html',
  styleUrls: ['businesses-tab.page.scss']
})

/**
 * The page displayed to the user when they select the "Businesses" tab.
 */
export class BusinessesTabPage {
  constructor(private businessStorage: SavedBusinessesStorageService, private modalController: ModalController, private toastController: ToastController) { }

  deleteBusiness(business: Business, ionItemSliding: HTMLIonItemSlidingElement, businessElement: HTMLElement) {
    ionItemSliding.close();
    businessElement.classList.add("deleting");

    setTimeout(async () => {
      await this.businessStorage.deleteBusiness(business);
    }, 300);
  }

  editBusinessInfo(business: Business, ionItemSliding: HTMLIonItemSlidingElement) {
    ionItemSliding.close();
    this.openBusinessViewModal(business);
  }

  async toggleStarBusiness(business: Business, ionItemSliding: HTMLIonItemSlidingElement) {
    ionItemSliding.close();
    business.toggleStarred();
    await this.businessStorage.updateAllSavedBusinesses();
  }

  async openBusinessViewModal(existingBusiness: Business = null) {
    const modal = await this.modalController.create({
      component: BusinessViewModalPage,
      backdropDismiss: false,
      componentProps: {
        savedBusiness: existingBusiness
      }
    });

    await modal.present();

    await modal.onWillDismiss().then(async ({ data }) => {
      if(data != null) {
        if(existingBusiness == null) {
          this.addBusiness(data);
        }
        else {
          this.updateBusiness(existingBusiness, data);
        }
      }
    });
  }

  private async addBusiness(business: Business) {
    let didSucceed = await this.businessStorage.addBusiness(business);

    const toast = await this.createToast(didSucceed ? "Business added successfully." : "An error occurred while adding business.");
    toast.present();
  }

  private async updateBusiness(original: Business, updated: Business) {
    let didSucceed = await this.businessStorage.updateBusiness(original, updated);
    
    const toast = await this.createToast(didSucceed ? "Business updated successfully." : "An error occurred while updating business.");
    toast.present();
  }

  private async createToast(message: string): Promise<HTMLIonToastElement> {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });

    return toast;
  }

  // /**
  //  * Called from the page when the user presses the settings icon on the navigation bar.
  //  * Opens a modal page containing the user preferences for Notifications, allowing the user to edit them.
  //  * Once the user closes the modal, their notification preferences are saved.
  //  */
  // async openPrefsModal() {
  //   const modal = await this.modalController.create({
  //     component: NotificationsPrefsModal,
  //   });

  //   await modal.present();

  //   modal.onWillDismiss().then(({ data }) => {
  //     this.notifsPrefsService.savePrefs(data);
  //   });
  // }
}