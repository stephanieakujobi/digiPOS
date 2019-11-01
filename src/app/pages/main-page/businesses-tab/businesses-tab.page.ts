import { Component } from '@angular/core';
import { BusinessViewModalPage } from './business-view-modal/business-view-modal.page';
import { BusinessPrefsModalPage } from './business-prefs/business-prefs-modal.page';
import { AppBusinessesPrefsService } from 'src/app/services/businesses/preferences/app-businesses-prefs.service';
import { CRUDResult } from 'src/app/classes/CRUDResult';
import { FirebaseBusinessService } from 'src/app/services/firebase/businesses/firebase-business.service';
import { IBusiness } from 'src/app/interfaces/businesses/IBusiness';
import { PopupsService } from 'src/app/services/global/popups.service';
import { ComponentRef, ComponentProps } from '@ionic/core';

@Component({
  selector: 'app-businesses-tab',
  templateUrl: 'businesses-tab.page.html',
  styleUrls: ['businesses-tab.page.scss']
})

/**
 * The page displayed to the user when they select the "Businesses" tab.
 */
export class BusinessesTabPage {
  /**
   * Creates a new BusinessTabPage.
   * @param fbbService The FirebaseBusinessService used to execute CRUD operations on the user's saved Businesses.
   * @param prefsService The AppBusinessesPrefsService used to update the user's saved Businesses preferences.
   * @param popupsService The PopupsService used to display alerts, toasts, and modals.
   */
  constructor(private fbbService: FirebaseBusinessService, private prefsService: AppBusinessesPrefsService, private popupsService: PopupsService) { }

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
    if(this.fbbService.businesses != null) {
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
      }
    }
  }

  /**
   * Sorts the list of saved Businesses by name in ascending or descending order.
   * @param ascending If true, the list will be sorted in ascending order, else in descending order.
   */
  private sortBusinessesAscDesc(ascending: boolean) {
    this.fbbService.businesses.sort((b1, b2) => {
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
   * Sorts the list of saved Businesses by displaying all starred Businesses at the top of the list first.
   */
  private sortBusinessesByStarred() {
    this.fbbService.businesses.sort(b => b.saveState == "starred" ? -1 : 0);
  }

  /**
   * Sorts the list of saved Businesses by displaying all Businesses saved from the map first.
   */
  private sortBusinessesByMapSave() {
    this.fbbService.businesses.sort(b => !b.wasManuallySaved ? -1 : 0);
  }

  /**
   * Sorts the list of saved Businesses by displaying all Businesses saved manually by the user first.
   */
  private sortBusinessesByManualSave() {
    this.fbbService.businesses.sort(b => b.wasManuallySaved ? -1 : 0);
  }

  /**
   * Called from the page when the user inputs into the ion-searchbar on the page.
   * Filters the list of saved Businesses, hiding the ones whose names or addresses do not match the string that the user has inputted.
   * @param event The input event passed, containing the ion-searchbar's value.
   */
  searchBusinesses(event: CustomEvent) {
    const searchQuery = (event.detail.value as string).toLowerCase();
    const elements = Array.from(document.querySelectorAll(".list-item.business")) as HTMLElement[];
    const arrLength = elements.length;

    for(let i = 0; i < arrLength; i++) {
      const elementName = (elements[i].querySelector(".business-name") as HTMLElement).innerText.toLowerCase();
      const elementAddress = (elements[i].querySelector(".business-address") as HTMLElement).innerText.toLowerCase();

      if(elementName.includes(searchQuery) || elementAddress.includes(searchQuery)) {
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
    if(AppBusinessesPrefsService.prefs.askBeforeDelete) {
      this.popupsService.showConfirmationAlert("Delete Business", "Are you sure you want to delete this business?",
        () => this.doDeleteBusiness(business, ionItemSliding, businessElement),
        () => ionItemSliding.close()
      );
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
      const result: CRUDResult = await this.fbbService.deleteBusiness(business);
      this.popupsService.showToast(result.message);

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
      const result: CRUDResult = await this.fbbService.toggleBusinessStarred(business);

      if(result.wasSuccessful) {
        this.sortBusinesses();
      }

      this.popupsService.showToast(result.message);
    }, 250);
  }

  /**
   * Called from the page when the user presses the settings icon on the navigation bar.
   * Opens a modal page containing the user preferences for saved Businesses, allowing the user to edit them.
   * Once the user closes the modal, their preferences are saved.
   */
  async openPrefsModal() {
    this.popupsService.showModal(BusinessPrefsModalPage, null, data => {
      this.prefsService.savePrefs(data);
    });
  }

  /**
   * Creates a new BusinessViewModalPage to edit information for a Business.
   * @param existingBusiness The optional existing Business to pass to the modal, whose information will be pre-filled in its form.
   *                         If an existing Business is passed, then this Business will be updated insted, rather than added as a new saved Business.
   */
  async openBusinessViewModal(existingBusiness?: IBusiness) {
    const props: ComponentProps<ComponentRef> = {
      existingBusiness: existingBusiness,
      allBusinesses: this.fbbService.businesses
    }

    this.popupsService.showModal(BusinessViewModalPage, props, data => {
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
    const result: CRUDResult = await this.fbbService.addBusiness(business);
    this.popupsService.showToast(result.message);

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
    const result: CRUDResult = await this.fbbService.updateBusiness(original, updated);
    this.popupsService.showToast(result.message);

    if(result.wasSuccessful) {
      this.sortBusinesses();
    }
  }
}