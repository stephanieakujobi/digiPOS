import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { BusinessViewModalPage } from './business-view-modal/business-view-modal.page';
import { BusinessPrefsModalPage } from './business-prefs/business-prefs-modal.page';
import { AppBusinessesPrefsService } from 'src/app/services/businesses/preferences/app-businesses-prefs.service';
import { AppBusinessesPrefs } from 'src/app/classes/businesses/AppBusinessesPrefs';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { CRUDResult } from 'src/app/classes/CRUDResult';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { IBusiness } from 'src/app/interfaces/businesses/IBusiness';

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
    private prefsService: AppBusinessesPrefsService,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
    private geolocation: Geolocation,
    private geocoder: NativeGeocoder,
    private fbService: FirebaseService,
  ) { }

  /**
   * @see https://angular.io/api/core/OnInit
   */
  async ngOnInit() {
    this.prefs = await this.prefsService.loadPrefs();

    //TEMPORARY
    this.fbService.tryLogin("john.smith@cpos.ca", "123abc", result => {
      console.log(result.message);
    });
  }

  /**
   * @see https://ionicframework.com/docs/angular/lifecycle
   */
  ionViewDidEnter() {
    this.sortBusinesses();
  }

  /**
   * A function called from the page when the user sorts their saved Businesses.
   * Reads the value of the ion-select element on the page and calls the appropriate sort function.
   */
  sortBusinesses() {
    if(this.fbService.salesRepIsAuthenticated) {
      const sortSelect = document.getElementById("sort-by-select") as HTMLIonSelectElement;

      switch(sortSelect.value) {
        default:
          this.sortBusinessesAscDesc(true);
          break;
        case "descending":
          this.sortBusinessesAscDesc(false);
          break;
        case "starred":
          this.sortBusinessesByStarred();
          break;
        case "savedMap":
          this.sortBusinessesByMapSave();
          break;
        case "savedManual":
          this.sortBusinessesByManualSave();
          break;
        case "closest":
          this.sortBusinessesByClosest();
          break;
      }
    }
  }

  /**
   * Sorts the list of saved Businesses by name in ascending or descending order.
   * @param ascending If true, the list will be sorted in ascending order, else in descending order.
   */
  private sortBusinessesAscDesc(ascending: boolean) {
    this.fbService.salesRep.savedBusinesses.sort((b1, b2) => {
      let result: number;
      const b1Name = b1.name.toLowerCase();
      const b2Name = b2.name.toLowerCase();

      if(b1Name < b2Name) {
        result = ascending ? -1 : 1;
      }
      else if(b1Name > b2Name) {
        result = ascending ? 1 : -1;
      }
      else {
        result = 0;
      }

      return result;
    });
  }


  /**
   * @todo Geolocate the user's current location and compare it with the addresses in each saved Business,
   *       then sort the list by the closest address to the user's current location.
   *       A service will likely need to be created for this.
   * @see  https://ionicframework.com/docs/native/native-geocoder
   */
  private async sortBusinessesByClosest() {
    // let userPosition: Coordinates = (await this.geolocation.getCurrentPosition()).coords;
    // console.log(userPosition);

    // let options: NativeGeocoderOptions = {
    //   useLocale: true,
    //   maxResults: 1
    // };

    // this.geocoder.forwardGeocode('Berlin', options)
    //   .then((result: NativeGeocoderResult[]) => console.log('The coordinates are latitude=' + result[0].latitude + ' and longitude=' + result[0].longitude))
    //   .catch((error: any) => console.log(error));
  }

  /**
   * Sorts the list of saved Businesses by displaying all starred Businesses at the top of the list first.
   */
  private sortBusinessesByStarred() {
    this.fbService.salesRep.savedBusinesses.sort(b => b.saveState == "starred" ? -1 : 0);
  }

  /**
   * Sorts the list of saved Businesses by displaying all Businesses saved from the map first.
   */
  private sortBusinessesByMapSave() {
    this.fbService.salesRep.savedBusinesses.sort(b => !b.wasManuallySaved ? -1 : 0);
  }

  /**
   * Sorts the list of saved Businesses by displaying all Businesses saved manually by the user first.
   */
  private sortBusinessesByManualSave() {
    this.fbService.salesRep.savedBusinesses.sort(b => b.wasManuallySaved ? -1 : 0);
  }

  /**
   * Called from the page when the user inputs into the ion-searchbar on the page.
   * Filters the list of saved Businesses, hiding the ones whose names do not match the string that the user has inputted.
   * @param event The input event passed, containing the ion-searchbar's value.
   */
  searchBusinessesByName(event: CustomEvent) {
    const searchQuery = (event.detail.value as string).toLowerCase();
    const elements = Array.from(document.querySelectorAll(".list-item.business")) as HTMLElement[];
    const arrLength = elements.length;

    for(let i = 0; i < arrLength; i++) {
      const elementBusinessName = (elements[i].querySelector(".business-name") as HTMLElement).innerText.toLowerCase();
      
      if(elementBusinessName.includes(searchQuery)) {
        elements[i].classList.remove("deleting");
      }
      else {
        elements[i].classList.add("deleting");
      }
    }
  }

  /**
   * Called from the page when the user attempts to delete a Business.
   * Checks the user's businesses preferences to see if the user should be prompted before deleting the Business.
   * @param business The Business to delete.
   * @param ionItemSliding The HTMLIonItemSlidingElement that was swiped to close.
   * @param businessElement The HTMLElement to animate upon deletion.
   */
  async onDeleteBusiness(business: IBusiness, ionItemSliding: HTMLIonItemSlidingElement, businessElement: HTMLElement) {
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

  /**
   * Called from onDeleteBusiness after it has been confirmed that Business can be deleted.
   * Animates the Business deleting before removing it from storage.
   * @param business The Business to delete.
   * @param ionItemSliding The HTMLIonItemSlidingElement that was swiped to close.
   * @param businessElement The HTMLElement to animate upon deletion.
   */
  private doDeleteBusiness(business: IBusiness, ionItemSliding: HTMLIonItemSlidingElement, businessElement: HTMLElement) {
    ionItemSliding.close();
    businessElement.classList.add("deleting");

    setTimeout(async () => {
      const result: CRUDResult = await this.fbService.deleteBusiness(business);
      this.presentToast(result.message);

      if(!result.wasSuccessful) {
        businessElement.classList.remove("deleting");
      }
      else {
        this.sortBusinesses();
      }
    }, 300);
  }

  /**
   * Called from the page when the user clicks on a Business.
   * Opens a BusinessViewModalPage to edit the Business. 
   * @param business The Business to edit.
   * @param ionItemSliding The optional HTMLIonItemSlidingElement that was swiped to close.
   */
  editBusinessInfo(business: IBusiness, ionItemSliding: HTMLIonItemSlidingElement = null) {
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
  onStarBusiness(business: IBusiness, ionItemSliding: HTMLIonItemSlidingElement) {
    ionItemSliding.close();

    setTimeout(async () => {
      const result: CRUDResult = await this.fbService.toggleBusinessStarred(business);

      if(result.wasSuccessful) {
        this.sortBusinesses();
      }

      this.presentToast(result.message);
    }, 250);
  }

  /**
   * Called from the page when the user presses the settings icon on the navigation bar.
   * Opens a modal page containing the user preferences for saved Businesses, allowing the user to edit them.
   * Once the user closes the modal, their preferences are saved.
   */
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
  async openBusinessViewModal(existingBusiness?: IBusiness) {
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
  private async addSavedBusiness(business: IBusiness) {
    const result: CRUDResult = await this.fbService.addBusiness(business);
    this.presentToast(result.message);

    if(result.wasSuccessful) {
      this.sortBusinesses();
    }
  }

  /**
   * Called from openBusinessViewModal when the BusinessViewModalPage has been dismissed and an existing saved Business under the current user should be updated.
   * Updates this Business under the user's profile.
   * @param original The original Business to update.
   * @param updated The new Business to replace with the original Business.
   */
  private async updateSavedBusiness(original: IBusiness, updated: IBusiness) {
    const result: CRUDResult = await this.fbService.updateBusiness(original, updated);
    this.presentToast(result.message);

    if(result.wasSuccessful) {
      this.sortBusinesses();
    }
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