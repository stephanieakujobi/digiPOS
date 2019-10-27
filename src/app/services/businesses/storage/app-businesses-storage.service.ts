import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Business } from 'src/app/models/businesses/Business';
import { Address } from 'src/app/models/businesses/Address';
import { Contact } from 'src/app/models/businesses/Contact';
import { BusinessSaveState } from 'src/app/models/businesses/BusinessSaveState';
import { CRUDResult } from 'src/app/models/CRUDResult';

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
   * Adds a Business under the user's profile. Will not add a Businesses if its Address is the same as an existing Business's Address.
   * @param business The Business to save.
   * @returns A true or false result representing if the save was successful or not respectively.
   */
  public async addBusiness(business: Business): Promise<CRUDResult> {
    let result: CRUDResult;
    let isDuplicate: boolean;

    const arrLength = this.businesses.length;
    for(let i = 0; i < arrLength; i++) {
      const savedBusiness = this.businesses[i];

      if(savedBusiness.address.postalCode != "" && business.address.postalCode != "") {
        isDuplicate = savedBusiness.address.postalCode === business.address.postalCode;
        break;
      }
      else {
        isDuplicate = savedBusiness.address.regionalAddress === business.address.regionalAddress;
        break;
      }
    }

    if(isDuplicate) {
      result = new CRUDResult(false, "Failed to save - business address already exists.");
    }
    else {
      this.businesses.push(business);
      business.saveState = BusinessSaveState.Saved;
      const didSucceed = await this.synchronize();

      if(!didSucceed) {
        this.businesses.splice(this.businesses.indexOf(business), 1);
        result = new CRUDResult(false, "Failed to save - internal server error.");
      }
      else {
        result = new CRUDResult(true, "Business saved successfully.");
      }
    }

    return result;
  }

  /**
   * Deletes a Business from the user's profile
   * @param business The Business to delete.
   * @returns A true or false result representing if the deletion was successful or not respectively.
   */
  public async deleteBusiness(business: Business): Promise<CRUDResult> {
    let result: CRUDResult;

    await this.nativeStorage.remove(JSON.stringify(business)).then(
      async () => {
        this.businesses.splice(this.businesses.indexOf(business), 1);
        const syncResult: CRUDResult = await this.synchronize();

        if(!syncResult.wasSuccessful) {
          this.businesses.push(business);
          result = new CRUDResult(false, "Failed to delete - internal server error.");
        }
        else {
          result = new CRUDResult(true, "Business deleted successfully.");
        }
      },
      error => result = new CRUDResult(false, "Failed to delete - " + error)
    );

    return result;
  }

  /**
   * Updates a Business under the user's profile by replacing an existing Business with an updated representation of it.
   * @param original The original Business to update.
   * @param updated The updated Business to replace with the original Business.
   * @returns A true or false result representing if the update was successful or not respectively.
   */
  public async updateBusiness(original: Business, updated: Business): Promise<CRUDResult> {
    let result: CRUDResult;
    let existingBusiness = this.businesses.find(b => b === original);

    if(existingBusiness == null) {
      result = new CRUDResult(false, "Failed to update - original business does not exist.");
    }
    else {
      Object.assign(original, updated);
      const syncResult: CRUDResult = await this.synchronize();

      if(!syncResult.wasSuccessful) {
        Object.assign(updated, original);
        result = new CRUDResult(false, "Failed to update - internal server error.")
      }
      else {
        result = new CRUDResult(true, "Business updated successfully.");
      }
    }

    return result;
  }

  /**
   * Loads all of the user's saved Businesses from their profile.
   * @returns A true or false result representing if the load was successful or not respectively.
   */
  public async loadBusinesses(): Promise<CRUDResult> {
    let result: CRUDResult;

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

        result = new CRUDResult(true, "Saved businesses loaded successfully.");
      },
      error =>  result = new CRUDResult(false, "Failed to load saved businesses - " + error)
    );

    return result;
  }

  /**
   * Updates the user's saved businesses stored server-side on their profile.
   * @returns A true or false result representing if the process was successful or not respectively.
   */
  public async synchronize(): Promise<CRUDResult> {
    let result: CRUDResult;

    await this.nativeStorage.setItem(AppBusinessesStorageService.storageKey, this.businesses).then(
      () => result = new CRUDResult(true, "Database synchronized successfully."),
      error => result = new CRUDResult(false, "Failed to syncronize: " + error)
    );

    return result;
  }

  /**
   * The user's current saved Businesses.
   */
  public get businesses(): Business[] {
    return AppBusinessesStorageService._businesses;
  }
}