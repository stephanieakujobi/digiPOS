import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Subscription, Observable } from 'rxjs';
import { IContact } from 'src/app/interfaces/businesses/IContact';
import { ISalesRep } from 'src/app/interfaces/ISalesRep';
import { CRUDResult } from 'src/app/classes/CRUDResult';
import { IAuthedSalesRep } from 'src/app/interfaces/firebase/IAuthedSalesRep';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  private static readonly SALES_REPS_AUTH: string = "sales_reps_auth";
  private static readonly SALES_REPS: string = "sales_reps";

  private static _userIsAuthenticated: boolean = false;
  private static _authedSalesRep?: IAuthedSalesRep = null;
  private static salesRepObservable$?: Observable<ISalesRep> = null;

  private subscriptions: Subscription;

  constructor(private afs: AngularFirestore) { }

  public tryLogin(email: string, password: string, callback: (result: CRUDResult) => void) {
    if(this.userIsAuthenticated) {
      callback(new CRUDResult(false, "User already authenticated."));
    }
    else {
      this.subscriptions = new Subscription();

      const authQuery: Observable<any> = this.afs.collection(FirebaseAuthService.SALES_REPS_AUTH, authQuery => authQuery
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
          FirebaseAuthService._userIsAuthenticated = true;
          callback(new CRUDResult(true, "Authentication Successful."));
        }
      }));
    }
  }

  private successfulLogin(salesRepInfo: IContact) {
    const selectQuery = this.afs.collection<ISalesRep>(FirebaseAuthService.SALES_REPS, selectQuery => selectQuery
      .where("info.email", "==", salesRepInfo.email)
      .limit(1)
    ).snapshotChanges();

    this.subscriptions.add(selectQuery.subscribe(queryResults => {
      if(queryResults.length == 0) {
        this.createSalesRep(salesRepInfo);
        this.successfulLogin(salesRepInfo);
      }
      else {
        this.assignAuthedSalesRep(queryResults[0].payload.doc.id);
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

    this.afs.collection<ISalesRep>(FirebaseAuthService.SALES_REPS).add(newSalesRep);
  }

  private assignAuthedSalesRep(id: string) {
    const authedServerRef: AngularFirestoreDocument<ISalesRep> = this.afs.doc<ISalesRep>(`${FirebaseAuthService.SALES_REPS}/${id}`);
    FirebaseAuthService.salesRepObservable$ = authedServerRef.valueChanges();

    FirebaseAuthService.salesRepObservable$.subscribe(salesRep => {
      FirebaseAuthService._authedSalesRep = {
        localRef: salesRep,
        serverRef: authedServerRef
      };
    });
  }

  public async synchronize(): Promise<CRUDResult> {
    let result: CRUDResult;

    if(!this.userIsAuthenticated) {
      result = CRUDResult.USER_NOT_AUTHENTICATED;
    }
    else {
      await FirebaseAuthService._authedSalesRep.serverRef.update(this.authedSalesRep)
        .catch(error => result = new CRUDResult(false, error))
        .then(() => result = new CRUDResult(true));
    }

    return result;
  }

  public get userIsAuthenticated(): boolean {
    return FirebaseAuthService._userIsAuthenticated;
  }

  public get authedSalesRep(): ISalesRep {
    return FirebaseAuthService._authedSalesRep.localRef;
  }
}
