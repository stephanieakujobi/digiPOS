import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentChangeAction } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { CRUDResult } from 'src/app/models/CRUDResult';
import { ISalesRep } from 'src/app/interfaces/ISalesRep';
import { IBusiness } from 'src/app/interfaces/businesses/IBusiness';
import { IContact } from 'src/app/interfaces/businesses/IContact';
import { BusinessSaveState } from 'src/app/models/businesses/BusinessSaveState';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private readonly salesRepsAuthCollection: string = "sales_reps_auth";
  private readonly salesRepsCollection: string = "sales_reps";

  private salesRepDocument: AngularFirestoreDocument<ISalesRep>;
  private salesRepObservable$: Observable<ISalesRep>;
  private _salesRep: ISalesRep;

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
          this._salesRep = salesRep;
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
      result = new CRUDResult(false, "No authenticated sales rep.");
    }
    else {
      business.saveState = BusinessSaveState.Saved;
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

  public get salesRep(): ISalesRep {
    return this._salesRep;
  }

  public get salesRepIsAuthenticated(): boolean {
    return this._salesRep != null;
  }
}
