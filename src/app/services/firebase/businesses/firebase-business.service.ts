import { Injectable } from '@angular/core';
import { CRUDResult } from 'src/app/classes/CRUDResult';
import { IBusiness } from 'src/app/interfaces/businesses/IBusiness';
import { BusinessSaveState } from 'src/app/classes/businesses/BusinessSaveState';
import { IAddress } from 'src/app/interfaces/businesses/IAddress';
import { FirebaseAuthService } from '../authentication/firebase-auth.service';
import { BusinessFormatter } from 'src/app/classes/businesses/BusinessFormatter';

@Injectable({
  providedIn: 'root'
})
/**
 * The FirebaseBusinessService provides real-time data streaming to a Firebase CloudFirestore.
 * It is used to perform CRUD operations on the saved Businesses of sales representitives, and stores these Businesses server-side.
 * This service works in conjunction with the FirebaseAuthService. A user must first be authenticated into the app before an instance of a FirebaseBusinessService
 * can exist, else an error is thrown. 
 * When a user is authenticated, their saved Businesses will be retrieved from the CloudFirestore.
 */
export class FirebaseBusinessService {
  private bFormatter: BusinessFormatter;

  /**
   * Creates a new FirebaseBusinessService.
   * @param authService The FirebaseAuthService used to synchronize data changes on the currently logged-in user's saved Businesses.
   */
  constructor(private authService: FirebaseAuthService) {
    if(!FirebaseAuthService.userIsAuthenticated) {
      throw new Error("FirebaseAuthService must have a user authenticated before FirebaseBusinessService can be instantiated.");
    }

    this.bFormatter = new BusinessFormatter();
  }

  /**
   * Adds a new Business document under the user's saved Businesses.
   * The Business will not be added if it has the same Address as an existing saved Business.
   * @param business The Business to add.
   * @returns The result of the operation.
   */
  public async addBusiness(business: IBusiness): Promise<CRUDResult> {
    let result: CRUDResult;

    if(this.savedBusinessExists(business.address)) {
      result = CRUDResult.DUPLICATE_BUSINESS_EXISTS;
    }
    else {
      business.saveState = "saved";
      business.address.addressString = this.bFormatter.formatAddressString(business.address);
      this.businesses.push(business);

      const serverUpdate = await this.authService.synchronize();

      if(!serverUpdate.wasSuccessful) {
        this.businesses.splice(this.businesses.indexOf(business), 1);
        result = new CRUDResult(false, "Failed to update business - internal server error.");
      }
      else {
        result = new CRUDResult(true, "Business saved successfully.");
      }
    }

    return result;
  }

  /**
   * Updates an existing Business under the user's saved Businesses, replacing the provided original data with the new data.
   * No update operation will be performed if the original Business does not exist in the user's saved Businesses.
   * @param original The original Business to update.
   * @param updated The new Business to replace with the original.
   * @returns The result of the operation.
   */
  public async updateBusiness(original: IBusiness, updated: IBusiness): Promise<CRUDResult> {
    let result: CRUDResult;

    if(!this.businesses.includes(original)) {
      result = CRUDResult.BUSINESS_DOES_NOT_EXIST;
    }
    else {
      updated.address.addressString = this.bFormatter.formatAddressString(updated.address);
      this.businesses[this.businesses.indexOf(original)] = updated;

      const serverUpdate = await this.authService.synchronize();

      if(!serverUpdate.wasSuccessful) {
        this.businesses[this.businesses.indexOf(updated)] = original;
        result = new CRUDResult(false, "Failed to update business - internal server error.");
      }
      else {
        result = new CRUDResult(true, "Business updated successfully.");
      }
    }

    return result;
  }

  /**
   * Deletes the user's saved Business.
   * No deletion operation will be performed if the Business does not exist in the user's saved Businesses.
   * @param business The Business to delete.
   * @returns The result of the operation.
   */
  public async deleteBusiness(business: IBusiness): Promise<CRUDResult> {
    let result: CRUDResult;

    if(!this.businesses.includes(business)) {
      result = CRUDResult.BUSINESS_DOES_NOT_EXIST;
    }
    else {
      this.businesses.splice(this.businesses.indexOf(business), 1);
      const serverUpdate = await this.authService.synchronize();

      if(!serverUpdate.wasSuccessful) {
        result = new CRUDResult(false, "Failed to delete business - internal server error.");
        this.businesses.push(business);
      }
      else {
        result = new CRUDResult(true, "Business deleted successfully.");
      }
    }

    return result;
  }

  /**
   * Updates an existing Business's BusinessSaveState value, toggling it between "stared" and "saved".
   * No update operation will be performed if the Business does not exist in the user's saved Businesses.
   * @param business The Business whose BusinessSaveState will be toggled.
   * @returns The result of the operation.
   */
  public async toggleBusinessStarred(business: IBusiness): Promise<CRUDResult> {
    let result: CRUDResult

    if(!this.businesses.includes(business)) {
      result = CRUDResult.BUSINESS_DOES_NOT_EXIST;
    }
    else {
      const originalState: BusinessSaveState = business.saveState;

      if(originalState == "saved") {
        business.saveState = "starred";
      }
      else if(originalState == "starred") {
        business.saveState = "saved";
      }

      const serverUpdate = await this.authService.synchronize();

      if(!serverUpdate.wasSuccessful) {
        business.saveState = originalState;
        result = new CRUDResult(false, "Failed to update business - internal server error.");
      }
      else {
        result = new CRUDResult(true, `${business.saveState == "starred" ? "Starred" : "Un-Starred"} business.`);
      }
    }

    return result;
  }

  /**
   * Compares an Address with the Addresses of the user's saved Businesses to find a match.
   * If two matching Addresses exist, then the user has already saved a Business with this address.
   * @param address 
   */
  private savedBusinessExists(address: IAddress): boolean {
    let result = false;

    const formattedAddress: string = this.bFormatter.formatAddressString(address).toLowerCase();

    for (const business of this.businesses) {
      if(formattedAddress === this.bFormatter.formatAddressString(business.address).toLowerCase()) {
        result = true;
        break;
      }
    }

    return result;
  }

  /**
   * The user's saved Businesses.
   */
  public get businesses(): IBusiness[] {
    return this.authService.authedSalesRep.savedBusinesses;
  }
}