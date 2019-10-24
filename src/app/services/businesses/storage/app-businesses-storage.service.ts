import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Business } from 'src/app/models/businesses/Business';
import { Address } from 'src/app/models/businesses/Address';
import { Contact } from 'src/app/models/businesses/Contact';
import { BusinessSaveState } from 'src/app/models/businesses/BusinessSaveState';

@Injectable({
  providedIn: 'root'
})

/**
 * The AppBusinessesStorageService provides a way to store Businesses under the currently logged-in user's profile.
 */
export class AppBusinessesStorageService {
  private static _businesses: Business[] = [];
  private static readonly storageKey = "saved_businesses";

  /**
   * Creates a new AppBusinessesStorageService instance.
   * @param nativeStorage The NativeStorage used to perform CRUD operations on Businesses.
   */
  constructor(private nativeStorage: NativeStorage) { }

  /**
   * Adds a Business under the user's profile. Will not add duplicate Businesses.
   * @param business The Business to save.
   * @returns A true or false result representing if the save was successful or not respectively.
   */
  public async addBusiness(business: Business): Promise<boolean> {
    let didSucceed: boolean = false;

    if(!this.businesses.includes(business)) {
      this.businesses.push(business);
      business.saveState = BusinessSaveState.Saved;
      didSucceed = await this.synchronize();
    }

    return didSucceed;
  }

  /**
   * Deletes a Business from the user's profile
   * @param business The Business to delete.
   * @returns A true or false result representing if the deletion was successful or not respectively.
   */
  public async deleteBusiness(business: Business): Promise<boolean> {
    let didSucceed: boolean = false;

    await this.nativeStorage.remove(JSON.stringify(business)).then(
      async () => {
        this.businesses.splice(this.businesses.indexOf(business), 1);
        didSucceed = await this.synchronize();
      },
      error => console.error(error)
    )

    return didSucceed;
  }

  /**
   * Updates a Business under the user's profile by replacing an existing Business with an updated representation of it.
   * @param original The original Business to update.
   * @param updated The updated Business to replace with the original Business.
   * @returns A true or false result representing if the update was successful or not respectively.
   */
  public async updateBusiness(original: Business, updated: Business): Promise<boolean> {
    let didSucceed = false;
    let existingBusiness = this.businesses.find(b => b === original);

    if(existingBusiness != null) {
      Object.assign(original, updated);
      didSucceed = await this.synchronize();
    }

    return didSucceed;
  }

  /**
   * Loads all of the user's saved Businesses from their profile.
   * @returns A true or false result representing if the load was successful or not respectively.
   */
  public async loadBusinesses(): Promise<boolean> {
    let didSucceed: boolean = false;

    await this.nativeStorage.getItem(AppBusinessesStorageService.storageKey).then(
      loadedBusinesses => {
        AppBusinessesStorageService._businesses = [];

        loadedBusinesses.forEach(b => {
          const business = new Business(
            b._name,
            new Address(b._address._street, b._address._city, b._address._region, b._address._country, b._address._postalCode),
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
   * Updates the user's saved businesses stored server-side on their profile.
   * @returns A true or false result representing if the process was successful or not respectively.
   */
  public async synchronize(): Promise<boolean> {
    let didSucceed: boolean = false;

    await this.nativeStorage.setItem(AppBusinessesStorageService.storageKey, this.businesses).then(
      () => didSucceed = true,
      error => console.error('Error updating businesses', error)
    );

    return didSucceed;
  }

  /**
   * The user's current saved Businesses.
   */
  public get businesses(): Business[] {
    return AppBusinessesStorageService._businesses;
  }
}
