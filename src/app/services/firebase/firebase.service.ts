import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { CRUDResult } from 'src/app/models/CRUDResult';
import { ISalesRep } from 'src/app/interfaces/ISalesRep';
import { IBusiness } from 'src/app/interfaces/businesses/IBusiness';
import { IContact } from 'src/app/interfaces/businesses/IContact';
import { BusinessSaveState } from 'src/app/models/businesses/BusinessSaveState';
import { IAddress } from 'src/app/interfaces/businesses/IAddress';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private readonly salesRepsAuthCollection: string = "sales_reps_auth";
  private readonly salesRepsCollection: string = "sales_reps";

  private static _salesRep: ISalesRep;

  private salesRepDocument: AngularFirestoreDocument<ISalesRep>;
  private salesRepObservable$: Observable<ISalesRep>;

  private subscriptions: Subscription;

  constructor(private afs: AngularFirestore) { }

  public tryLogin(email: string, password: string, callback: (result: CRUDResult) => void) {
    this.subscriptions = new Subscription();

    const authQuery: Observable<any> = this.afs.collection(this.salesRepsAuthCollection, authQuery => authQuery
      .where("info.email", "==", email)
      .where("password", "==", password)
      .limit(1)
    ).valueChanges();

    this.subscriptions.add(authQuery.subscribe(results => {
      if(results.length == 0) {
        this.subscriptions.unsubscribe();
        callback(new CRUDResult(false, "Authentication failed."));
      }
      else {
        this.successfulLogin(results[0].info as IContact);
        callback(new CRUDResult(true, "Authentication successful."));
      }
    }));
  }

  private successfulLogin(salesRepInfo: IContact) {
    const selectQuery = this.afs.collection<ISalesRep>(this.salesRepsCollection, selectQuery => selectQuery
      .where("info.email", "==", salesRepInfo.email)
      .limit(1)
    ).snapshotChanges();

    this.subscriptions.add(selectQuery.subscribe(results => {
      if(results.length == 0) {
        this.createSalesRep(salesRepInfo);
        this.successfulLogin(salesRepInfo);
      }
      else {
        this.salesRepDocument = this.afs.doc<ISalesRep>(`${this.salesRepsCollection}/${results[0].payload.doc.id}`);
        this.salesRepObservable$ = this.salesRepDocument.valueChanges();

        this.salesRepObservable$.subscribe(salesRep => {
          FirebaseService._salesRep = salesRep;
        });
      }

      this.subscriptions.unsubscribe();
    }));
  }

  private async createSalesRep(info: IContact) {
    const newSalesRep = {
      info: info,
      profilePicUrl: null,
      savedBusinesses: []
    };

    this.afs.collection<ISalesRep>(this.salesRepsCollection).add(newSalesRep);
  }

  public async addBusiness(business: IBusiness): Promise<CRUDResult> {
    let result: CRUDResult;

    if(!this.salesRepIsAuthenticated) {
      result = CRUDResult.USER_NOT_AUTHENTICATED;
    }
    else if(this.businessWithAddressExists(business.address)) {
      result = CRUDResult.DUPLICATE_BUSINESS_EXISTS;
    }
    else {
      business.saveState = "saved";
      this.salesRep.savedBusinesses.push(business);

      await this.salesRepDocument.update(this.salesRep)
        .catch(() => {
          this.salesRep.savedBusinesses.splice(this.salesRep.savedBusinesses.indexOf(business), 1);
          result = new CRUDResult(false, "Failed to save business - internal server error.");
        })
        .then(() => {
          result = new CRUDResult(true, "Business saved successfully.");
        });
    }

    return result;
  }

  public async updateBusiness(original: IBusiness, updated: IBusiness): Promise<CRUDResult> {
    let result: CRUDResult = this.businessExists(original);

    if(result.wasSuccessful) {
      this.salesRep.savedBusinesses[this.indexOfBusiness(original)] = updated;

      await this.salesRepDocument.update(this.salesRep)
        .catch(() => {
          this.salesRep.savedBusinesses[this.indexOfBusiness(updated)] = original;
          result = new CRUDResult(false, "Failed to update business - internal server error.");
        })
        .then(() => {
          result = new CRUDResult(true, "Business updated successfully.");
        });
    }

    return result;
  }

  public async deleteBusiness(business: IBusiness): Promise<CRUDResult> {
    let result: CRUDResult = this.businessExists(business);

    if(result.wasSuccessful) {
      this.salesRep.savedBusinesses.splice(this.salesRep.savedBusinesses.indexOf(business), 1);

      await this.salesRepDocument.update(this.salesRep)
        .catch(() => {
          result = new CRUDResult(false, "Failed to delete business - internal server error.");
          this.salesRep.savedBusinesses.push(business);
        })
        .then(() => {
          result = new CRUDResult(true, "Business deleted successfully.");
        });
    }

    return result;
  }

  public async toggleBusinessStarred(business: IBusiness): Promise<CRUDResult> {
    let result: CRUDResult = this.businessExists(business);

    if(result.wasSuccessful) {
      const originalState: BusinessSaveState = business.saveState;

      if(originalState == "saved") {
        business.saveState = "starred";
      }
      else if(originalState == "starred") {
        business.saveState = "saved";
      }

      await this.salesRepDocument.update(this.salesRep)
        .catch(() => {
          business.saveState = originalState;
          result = new CRUDResult(false, "Failed to update business - internal server error.");
        })
        .then(() => {
          result = new CRUDResult(true, `${business.saveState == "starred" ? "Starred" : "Un-Starred"} business.`);
        });
    }

    return result;
  }

  private indexOfBusiness(business: IBusiness): number {
    let index: number = null;
    let arrLength = this.salesRep.savedBusinesses.length;

    for(let i = 0; i < arrLength; i++) {
      if(this.salesRep.savedBusinesses[i] == business) {
        index = i;
        break;
      }
    }

    return index;
  }

  private businessExists(business: IBusiness): CRUDResult {
    let result: CRUDResult;

    if(!this.salesRepIsAuthenticated) {
      result = CRUDResult.USER_NOT_AUTHENTICATED;
    }
    else if(!this.salesRep.savedBusinesses.includes(business)) {
      result = CRUDResult.BUSINESS_DOES_NOT_EXIST;
    }
    else {
      result = new CRUDResult(true, "The current sales rep does have this business saved.");
    }

    return result;
  }

  private businessWithAddressExists(address: IAddress): boolean {
    let result: boolean = false;

    for(const business of this.salesRep.savedBusinesses) {
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

  public get salesRepIsAuthenticated(): boolean {
    return FirebaseService._salesRep != null;
  }

  public get salesRep(): ISalesRep {
    return FirebaseService._salesRep;
  }
}
