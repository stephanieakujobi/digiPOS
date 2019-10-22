import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Business } from 'src/app/classes/businesses/Business';
import { Address } from 'src/app/classes/businesses/Address';
import { Contact } from 'src/app/classes/businesses/Contact';
import { BusinessSaveState } from 'src/app/classes/businesses/BusinessSaveState';

@Injectable({
  providedIn: 'root'
})
export class SavedBusinessesStorageService {
  private static _businesses: Business[] = [];
  private static readonly storageKey = "saved_businesses";

  /**
   * Creates a new SavedBusinessesStorageService instance.
   * @param nativeStorage The NativeStorage used to save and load Businesses.
   */
  constructor(private nativeStorage: NativeStorage) { }

  /**
   * Saves a Business under the current user's list of saved Businesses.
   * @param business The Business to save.
   * @returns A true or false result representing if the save was successful or not respectively.
   */
  public async addBusiness(business: Business): Promise<boolean> {
    let didSucceed: boolean = false;

    if(!this.businesses.includes(business)) {
      this.businesses.push(business);
      business.saveState = BusinessSaveState.Saved;
      didSucceed = await this.updateAllSavedBusinesses();
    }

    return didSucceed;
  }

  public async deleteBusiness(business: Business): Promise<boolean> {
    let didSucceed: boolean = false;

    await this.nativeStorage.remove(JSON.stringify(business)).then(
      async () => {
        this.businesses.splice(this.businesses.indexOf(business), 1);
        didSucceed = await this.updateAllSavedBusinesses();
      },
      error => console.error(error)
    )

    return didSucceed;
  }

  public async updateBusiness(original: Business, updated: Business): Promise<boolean> {
    let didSucceed = false;
    let existingBusiness = this.businesses.find(b => b === original);

    if(existingBusiness != null) {
      Object.assign(original, updated);
      didSucceed = await this.updateAllSavedBusinesses();
    }

    return didSucceed;
  }

  public async updateAllSavedBusinesses(): Promise<boolean> {
    let didSucceed: boolean = false;

    await this.nativeStorage.setItem(SavedBusinessesStorageService.storageKey, this.businesses).then(
      () => didSucceed = true,
      error => console.error('Error updating businesses', error)
    );

    return didSucceed;
  }

  /**
   * Loads the user's saved Businesses.
   * @returns A true or false result representing if the load was successful or not respectively.
   */
  public async loadBusinesses(): Promise<boolean> {
    let didSucceed: boolean = false;

    await this.nativeStorage.getItem(SavedBusinessesStorageService.storageKey).then(
      loadedBusinesses => {
        SavedBusinessesStorageService._businesses = [];

        loadedBusinesses.forEach(b => {
          const business = new Business(
            b._name,
            new Address(b._address._street, b._address._city, b._address._region),
            new Contact(b._owner._name, b._owner.email, b._owner._phoneNumber),
            new Contact(b._contactPerson._name, b._contactPerson.email, b._contactPerson._phoneNumber),
            b._currentProvider,
            b._notes
          );

          business.saveState = b._saveState;
          business.wasManuallySaved = b._wasManuallySaved;
          business.isReported = b._isReported;

          this.businesses.push(business);
        });

        didSucceed = true;
      },
      error => console.error(error)
    );

    return didSucceed;
  }

  /**
   * The user's current saved Businesses.
   */
  public get businesses(): Business[] {
    return SavedBusinessesStorageService._businesses;
  }
}
