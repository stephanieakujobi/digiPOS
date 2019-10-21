import { Component } from '@angular/core';
import { ModalController, IonItemSliding } from '@ionic/angular';
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
  constructor(private businessStorage: SavedBusinessesStorageService, private modalController: ModalController) { }

  deleteBusiness(business: Business, ionItemSliding: HTMLIonItemSlidingElement, businessElement: HTMLElement) {
    ionItemSliding.close();
    businessElement.classList.add("deleting");

    setTimeout(async () => {
      await this.businessStorage.deleteBusiness(business);
    }, 300);
  }

  editBusinessInfo(business: Business, ionItemSliding: HTMLIonItemSlidingElement) {
    ionItemSliding.close();
    this.openBusinessEditModal(business);
  }

  async toggleStarBusiness(business: Business, ionItemSliding: HTMLIonItemSlidingElement) {
    ionItemSliding.close();
    business.isStarred = !business.isStarred;
    await this.businessStorage.updateSavedBusinesses();
  }

  async openBusinessEditModal(existingBusiness: Business = null) {
    const modal = await this.modalController.create({
      component: BusinessViewModalPage,
      backdropDismiss: false,
      componentProps: {
        existingBusiness: Business.copyOf(existingBusiness)
      }
    });

    await modal.present();
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