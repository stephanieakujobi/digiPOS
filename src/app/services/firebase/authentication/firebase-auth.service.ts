import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { SalesRep } from 'src/app/models/SalesRep';
import { CRUDResult } from 'src/app/classes/global/CRUDResult';
import { AngularFireAuth } from '@angular/fire/auth';

declare var require: any;

/**
 * The FirebaseAuthService is responsible for authenticating users and holding a reference to the currently authenticated user.
 * It performs read/write operations on an AngularFirestore to obtain the user data and stores the reference as a SalesRep.
 * Changes made to the SalesRep object are reflected in real-time on the AngularFirestore.
 */
@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  private static readonly SALES_REPS: string = "sales_reps";

  private static _userIsAuthenticated: boolean = false;
  private static _authedSalesRep?: AuthedSalesRep = null;

  /**
   * Creates a new FirebaseAuthService
   * @param fbAuth The FirebaseAuthentication used to connect to Firebase and authenticate the user.
   * @param afStore The AngularFirestore used to perform read/write operations on.
   */
  constructor(private afAuth: AngularFireAuth, private afStore: AngularFirestore) { }

  /**
   * Attempts to authenticate with the provided credentials and executes a callback function with the result.
   * @param email The email to authenticate with.
   * @param password The password to authenticate with.
   * @param callback The callback function to run upon completion, containing the result of the authentication attempt.
   */
  public async tryLogin(email: string, password: string, callback: (result: CRUDResult) => void) {
    if(FirebaseAuthService.userIsAuthenticated) {
      callback(new CRUDResult(false, "User already authenticated."));
    }
    else {
      email = email.trim().replace(/[/\\]/g, ""); //Remove all slashes, leading, and trailing spaces from email string.
      const sha1 = require("sha1"); //Import SHA1 hash algorithm from package dependancy for password hashing.

      this.afAuth.auth.signInWithEmailAndPassword(email, sha1(password))
        .then(() => this.getUserData(email, (result: CRUDResult) => callback(result)))
        .catch(err => {
          const message: string = err.code == "auth/too-many-requests" ? "Too many failed login attempts. Please Try again later." : "Invalid authentication info.";
          callback(new CRUDResult(false, message));
        });
    }
  }

  /**
   * Called from the tryLogin function when the login attempt was successful.
   * Retreives the user's saved data using their email as the select query.
   * If no saved data exists for this user, an error will be returned instead.
   * @param email The retrieved SalesRepContact info for the authenticated user.
   * @param callback The callback function containing the result of the operation to run.
   */
  private getUserData(email: string, callback: (result: CRUDResult) => void) {
    const subscription = new Subscription();

    //Create the select query...
    const selectQuery = this.afStore.collection<SalesRep>(FirebaseAuthService.SALES_REPS, selectQuery => selectQuery
      .where("info.email", "==", email)
      .limit(1)
    ).snapshotChanges();

    //Execute the select query...
    subscription.add(selectQuery.subscribe(
      async queryResults => {
        subscription.unsubscribe();

        //A length of 0 means the select query returned no results; no saved data exists for this user.
        if(queryResults.length == 0) {
          callback(new CRUDResult(false, "User data does not exist."))
        }
        else {
          this.assignAuthedSalesRep(queryResults[0].payload.doc.id,
            () => callback(new CRUDResult(true, "Authentication successful.")),
            err => callback(CRUDResult.NETWORK_ERROR)
          );
        }
      },
      err => callback(CRUDResult.NETWORK_ERROR)
    ));
  }

  /**
   * Called from the getUserData function when existing saved data for the authenticated user was found.
   * Loads the user's data and stores them in an Observable for live-updating, and an AuthedSalesRep for referencing.
   * @param id The user's document ID containing their saved data to read from.
   * @param onComplete The callback to run once the user's data has been assigned.
   * @param onComplete The callback to run if an error occurs while assigning the AuthedSalesRep.
   */
  private assignAuthedSalesRep(id: string, onComplete: () => void, onError: (err: string) => void) {
    const subscription = new Subscription();
    const serverSalesRepRef: AngularFirestoreDocument<SalesRep> = this.afStore.doc<SalesRep>(`${FirebaseAuthService.SALES_REPS}/${id}`);

    subscription.add(serverSalesRepRef.valueChanges().subscribe(
      (salesRep: SalesRep) => {
        subscription.unsubscribe();

        FirebaseAuthService._authedSalesRep = {
          localRef: salesRep,
          serverRef: serverSalesRepRef
        };

        if(!FirebaseAuthService.userIsAuthenticated) {
          FirebaseAuthService._userIsAuthenticated = true;
          onComplete();
        }
      },
      err => onError(err)
    ));
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
      await FirebaseAuthService._authedSalesRep.serverRef.update(FirebaseAuthService.authedSalesRep)
        .then(() => result = new CRUDResult(true))
        .catch(() => result = new CRUDResult(false, "Failed to update place - internal server error."));
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
  public static get authedSalesRep(): SalesRep {
    return FirebaseAuthService._authedSalesRep.localRef;
  }
}

/**
 * A container object holding both a local reference and server reference to an authenticated SalesRep.
 */
interface AuthedSalesRep {
  localRef: SalesRep;
  serverRef: AngularFirestoreDocument<SalesRep>;
}