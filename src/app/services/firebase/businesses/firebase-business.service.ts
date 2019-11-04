import { Injectable } from '@angular/core';
import { CRUDResult } from 'src/app/classes/CRUDResult';
import { IBusiness } from 'src/app/interfaces/businesses/IBusiness';
import { BusinessSaveState } from 'src/app/classes/businesses/BusinessSaveState';
import { FirebaseAuthService } from '../authentication/firebase-auth.service';
import { BusinessFormatter } from 'src/app/classes/businesses/BusinessFormatter';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { IReportedBusiness } from 'src/app/interfaces/businesses/IReportedBusiness';
import { Subscription } from 'rxjs';

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
  private static readonly REPORTED_BUSINESSES_COL: string = "reported_businesses";
  private static _reportedBusinesses: IReportedBusiness[] = [];

  private bFormatter: BusinessFormatter;

  /**
   * Creates a new FirebaseBusinessService.
   * @param authService The FirebaseAuthService used to synchronize data changes on the currently logged-in user's saved Businesses.
   */
  constructor(private authService: FirebaseAuthService, private afs: AngularFirestore) {
    if(!FirebaseAuthService.userIsAuthenticated) {
      throw new Error("FirebaseAuthService must have a user authenticated before FirebaseBusinessService can be instantiated.");
    }

    this.bFormatter = new BusinessFormatter();
    this.loadReportedBusinesses();
  }

  private loadReportedBusinesses() {
    const collection: AngularFirestoreCollection<IReportedBusiness> = this.afs.collection(FirebaseBusinessService.REPORTED_BUSINESSES_COL);

    collection.valueChanges().subscribe(businesses => {
      FirebaseBusinessService._reportedBusinesses = businesses;
    });
  }

  /**
   * Adds a new Business document under the user's saved Businesses.
   * The Business will not be added if it has the same Address as an existing saved Business.
   * @param business The Business to add.
   * @returns The result of the operation.
   */
  public async addBusiness(business: IBusiness): Promise<CRUDResult> {
    let result: CRUDResult;

    if(this.savedAddressExists(business.info.address.addressString)) {
      result = CRUDResult.DUPLICATE_BUSINESS_EXISTS;
    }
    else {
      business.saveState = "saved";
      business = this.bFormatter.formatBusinessAddress(business);
      this.businesses.push(business);

      const serverUpdate: CRUDResult = await this.authService.synchronize();

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
      updated = this.bFormatter.formatBusinessAddress(updated);
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

    if(!this.savedAddressExists(business.info.address.addressString)) {
      result = CRUDResult.BUSINESS_DOES_NOT_EXIST;
    }
    else {
      let existingBusiness: IBusiness;

      this.businesses.filter(b => {
        if(b.info.address.addressString === business.info.address.addressString) {
          existingBusiness = b;
          this.businesses.splice(this.businesses.indexOf(b), 1);
          return;
        }
      });

      const serverUpdate = await this.authService.synchronize();

      if(!serverUpdate.wasSuccessful) {
        result = new CRUDResult(false, "Failed to delete business - internal server error.");
        this.businesses.push(existingBusiness);
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

  public async reportBusiness(business: IBusiness, callback: (result: CRUDResult) => void) { 
    const reportedBusiness: IReportedBusiness = {
      info: business.info,
      reportedBy: this.authService.authedSalesRep.info,
      dateReported: new Date().toDateString()
    }

    if(this.reportedAddressExists(business.info.address.addressString)) {
      this.reportExistingBusiness(reportedBusiness, result => callback(result));
    }
    else {
      this.reportNewBusiness(reportedBusiness, result => callback(result));
    }
  }

  private async reportNewBusiness(business: IReportedBusiness, callback: (result: CRUDResult) => void) {
    await this.afs.collection(FirebaseBusinessService.REPORTED_BUSINESSES_COL).add(business)
      .then(() => {
        callback(new CRUDResult(true, "Business reported successfully."));
      })
      .catch(() => {
        callback(new CRUDResult(false, "A network error occurred while reporting business."));
      });
  }

  private reportExistingBusiness(business: IReportedBusiness, callback: (result: CRUDResult) => void) {
    const subscription = new Subscription();

    //Create the select query to find the existing document in the collection...
    const query = this.afs.collection<IReportedBusiness>(FirebaseBusinessService.REPORTED_BUSINESSES_COL, query => query
      .where("info.address.addressString", "==", business.info.address.addressString)
      .limit(1)
    ).snapshotChanges();

    //Execute the select query...
    subscription.add(query.subscribe(results => {
      subscription.unsubscribe();

      if(results.length == 0) {
        callback(new CRUDResult(false, "Failed to update report - could not find database reference."));
      }
      else {
        const docId: string = results[0].payload.doc.id;

        //Update the document using the returned ID from the collection select query.
        this.afs.doc<IReportedBusiness>(`${FirebaseBusinessService.REPORTED_BUSINESSES_COL}/${docId}`).update(business)
          .then(() => callback(new CRUDResult(true, "Business reported successfully.")))
          .catch(() => callback(new CRUDResult(false, "A network error occurred while reporting business.")))
      }
    }));
  }

  public savedAddressExists(address: string): boolean {
    return this.addressExistsInCollection(address, this.businesses);
  }

  public reportedAddressExists(address: string): boolean {
    return this.addressExistsInCollection(address, this.reportedBusinesses);
  }

  private addressExistsInCollection(address: string, collection: IBusiness[] | IReportedBusiness[]): boolean {
    let result = false;

    const formattedAddress: string = this.bFormatter.formatAddressString(address).toLowerCase();

    for(const business of collection) {
      if(formattedAddress === this.bFormatter.formatAddressString(business.info.address.addressString).toLowerCase()) {
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

  public get reportedBusinesses(): IReportedBusiness[] {
    return FirebaseBusinessService._reportedBusinesses;
  }
}