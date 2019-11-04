import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Subscription, Observable } from 'rxjs';
import { IContact } from 'src/app/interfaces/businesses/IContact';
import { ISalesRep } from 'src/app/interfaces/ISalesRep';
import { CRUDResult } from 'src/app/classes/CRUDResult';

declare var require: any;

@Injectable({
  providedIn: 'root'
})

/**
 * The FirebaseAuthService is responsible for authenticating users and holding a reference to the currently authenticated user.
 * It performs read/write operations on an AngularFirestore to obtain the user data and stores the reference as a SalesRep.
 * Changes made to the SalesRep object are reflected in real-time on the AngularFirestore.
 */
export class FirebaseAuthService {
  private static readonly SALES_REPS_AUTH: string = "sales_reps_auth";
  private static readonly SALES_REPS: string = "sales_reps";

  private static _userIsAuthenticated: boolean = false;
  private static _authedSalesRep?: IAuthedSalesRep = null;

  private subscriptions: Subscription;

  /**
   * Creates a new FirebaseAuthService
   * @param afs The AngularFirestore used to perform read/write operations on.
   */
  constructor(private afs: AngularFirestore) { }

  /**
   * Attempts to authenticate with the provided credentials and executes a callback function with the result.
   * @param email The email to authenticate with.
   * @param password The password to authenticate with.
   * @param callback The callback function to run upon completion, containing the result of the authentication attempt.
   */
  public tryLogin(email: string, password: string, callback: (result: CRUDResult) => void) {
    if(FirebaseAuthService.userIsAuthenticated) {
      callback(new CRUDResult(false, "User already authenticated."));
    }
    else {
      this.subscriptions = new Subscription();
      email = email.trim().replace(/[/\\]/g, ""); //Remove all slashes, leading, and trailing spaces from email string.
      const sha1 = require("sha1"); //Import SHA1 hash algorithm from package dependancy for password hashing.

      //Create the select query...
      const authQuery: Observable<any> = this.afs.collection(FirebaseAuthService.SALES_REPS_AUTH, authQuery => authQuery
        .where("info.email", "==", email)
        .where("password", "==", sha1(password))
        .limit(1)
      ).valueChanges();

      //Execute the select query...
      this.subscriptions.add(authQuery.subscribe(results => {
        //A length of 0 means the select query returned no results; authentication failed.
        if(results.length == 0) {
          this.subscriptions.unsubscribe();
          callback(new CRUDResult(false, "Invalid authentication."));
        }
        else {
          this.successfulLogin(results[0].info as IContact, () => callback(new CRUDResult(true, "Authentication successful.")));
        }
      }));
    }
  }

  /**
   * Called from the tryLogin function when the login attempt was successful.
   * Retreives the user's saved data using their email as the select query.
   * If no saved data exists for this user, a blank document will be created for them.
   * @param salesRepInfo The retrieved Contact info for the authenticated user.
   */
  private successfulLogin(salesRepInfo: IContact, callback: () => void) {
    //Create the select query...
    const selectQuery = this.afs.collection<ISalesRep>(FirebaseAuthService.SALES_REPS, selectQuery => selectQuery
      .where("info.email", "==", salesRepInfo.email)
      .limit(1)
    ).snapshotChanges();

    //Execute the select query...
    this.subscriptions.add(selectQuery.subscribe(async queryResults => {
      //A length of 0 means the select query returned no results; no saved data exists for this user.
      if(queryResults.length == 0) {
        await this.createSalesRep(salesRepInfo);
        this.successfulLogin(salesRepInfo, callback);
      }
      else {
        this.assignAuthedSalesRep(queryResults[0].payload.doc.id, callback);
      }

      this.subscriptions.unsubscribe();
    }));
  }

  /**
   * Called from the successfulLogin function if there is no existing saved data for the authenticated user.
   * Creates a blank document for the user's data.
   * @param info The Contact info to initialize with the data.
   */
  private async createSalesRep(info: IContact) {
    const newSalesRep = {
      info: info,
      profilePicUrl: "",
      savedBusinesses: []
    };

    await this.afs.collection<ISalesRep>(FirebaseAuthService.SALES_REPS).add(newSalesRep);
  }

  /**
   * Called from the successfulLogin function when existing saved data for the authenticated user was found.
   * Loads the user's data and stores them in an Observable for live-updating, and an IAuthedSalesRep for referencing.
   * @param id The user's document ID containing their saved data to read from.
   */
  private assignAuthedSalesRep(id: string, callback: () => void) {
    const serverSalesRepRef: AngularFirestoreDocument<ISalesRep> = this.afs.doc<ISalesRep>(`${FirebaseAuthService.SALES_REPS}/${id}`);

    serverSalesRepRef.valueChanges().subscribe((salesRep: ISalesRep) => {
      FirebaseAuthService._authedSalesRep = {
        localRef: salesRep,
        serverRef: serverSalesRepRef
      };

      if(!FirebaseAuthService.userIsAuthenticated) {
        FirebaseAuthService._userIsAuthenticated = true;
        callback();
      }
    });
  }

  /**
   * Synchronizes the local reference and the server reference of the currently authenticated user's data.
   * @returns The result of the synchronization.
   */
  public async synchronize(): Promise<CRUDResult> {
    let result: CRUDResult;

    if(!FirebaseAuthService.userIsAuthenticated) {
      result = CRUDResult.USER_NOT_AUTHENTICATED;
    }
    else {
      await FirebaseAuthService._authedSalesRep.serverRef.update(this.authedSalesRep)
        .then(() => result = new CRUDResult(true))
        .catch(error => result = new CRUDResult(false, error));
    }

    return result;
  }

  /**
   * Whether or not a user has successfully authenticated into the app.
   */
  public static get userIsAuthenticated(): boolean {
    return FirebaseAuthService._userIsAuthenticated;
  }

  /**
   * The currently authenticated user, if one exists.
   * Can be null.
   */
  public get authedSalesRep(): ISalesRep {
    return FirebaseAuthService._authedSalesRep.localRef;
  }
}

/**
 * A container object holding both a local reference and server reference to an authenticated SalesRep.
 */
interface IAuthedSalesRep {
  localRef: ISalesRep;
  serverRef: AngularFirestoreDocument<ISalesRep>;
}