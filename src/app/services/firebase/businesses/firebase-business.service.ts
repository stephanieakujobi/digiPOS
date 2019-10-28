import { Injectable } from '@angular/core';
import { CRUDResult } from 'src/app/classes/CRUDResult';
import { IBusiness } from 'src/app/interfaces/businesses/IBusiness';
import { BusinessSaveState } from 'src/app/classes/businesses/BusinessSaveState';
import { IAddress } from 'src/app/interfaces/businesses/IAddress';
import { FirebaseAuthService } from '../authentication/firebase-auth.service';

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
  constructor(private authService: FirebaseAuthService) { 
    if(!authService.userIsAuthenticated) {
      throw new Error("FirebaseAuthService must have a user authenticated before FirebaseBusinessService can be instantiated.");
    }
  }

  public async addBusiness(business: IBusiness): Promise<CRUDResult> {
    let result: CRUDResult;

    if(this.businessWithAddressExists(business.address)) {
      result = CRUDResult.DUPLICATE_BUSINESS_EXISTS;
    }
    else {
      business.saveState = "saved";
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

  public async updateBusiness(original: IBusiness, updated: IBusiness): Promise<CRUDResult> {
    let result: CRUDResult = this.businessExists(original);

    if(!this.businessExists(original)) {
      result = CRUDResult.BUSINESS_DOES_NOT_EXIST;
    }
    else {
      this.businesses[this.indexOfBusiness(original)] = updated;
      const serverUpdate = await this.authService.synchronize();

      if(!serverUpdate.wasSuccessful) {
        this.businesses[this.indexOfBusiness(updated)] = original;
        result = new CRUDResult(false, "Failed to update business - internal server error.");
      }
      else {
        result = new CRUDResult(true, "Business updated successfully.");
      }
    }

    return result;
  }

  public async deleteBusiness(business: IBusiness): Promise<CRUDResult> {
    let result: CRUDResult = this.businessExists(business);

    if(!this.businessExists(business)) {
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

  public async toggleBusinessStarred(business: IBusiness): Promise<CRUDResult> {
    let result: CRUDResult = this.businessExists(business);

    if(!this.businessExists(business)) {
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

  private indexOfBusiness(business: IBusiness): number {
    let index: number = null;
    let arrLength = this.businesses.length;

    for(let i = 0; i < arrLength; i++) {
      if(this.businesses[i] == business) {
        index = i;
        break;
      }
    }

    return index;
  }

  private businessExists(business: IBusiness): CRUDResult {
    let result: CRUDResult;

    if(!this.authService.userIsAuthenticated) {
      result = CRUDResult.USER_NOT_AUTHENTICATED;
    }
    else if(!this.businesses.includes(business)) {
      result = CRUDResult.BUSINESS_DOES_NOT_EXIST;
    }
    else {
      result = new CRUDResult(true, "The current sales rep does have this business saved.");
    }

    return result;
  }

  private businessWithAddressExists(address: IAddress): boolean {
    let result: boolean = false;

    for(const business of this.businesses) {
      if(address.postalCode != "" && address.postalCode == business.address.postalCode) {
        result = true;
        break;
      }
      else {
        const countryAddress1 = `${address.street} ${address.city} ${address.region} ${address.country}`;
        const countryAddress2 = `${business.address.street} ${business.address.city} ${business.address.region} ${business.address.country}`;

        if(countryAddress1 == countryAddress2) {
          result = true;
          break;
        }
      }
    }

    return result;
  }

  public get businesses(): IBusiness[] {
    return this.authService.authedSalesRep.savedBusinesses;
  }
}