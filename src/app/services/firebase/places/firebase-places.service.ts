import { Injectable } from '@angular/core';
import { CRUDResult } from 'src/app/classes/CRUDResult';
import { Place } from 'src/app/models/places/Place';
import { PlaceSaveState } from 'src/app/classes/places/PlaceSaveState';
import { FirebaseAuthService } from '../authentication/firebase-auth.service';
import { PlaceFormatter } from 'src/app/classes/places/PlaceFormatter';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ReportedPlace } from 'src/app/models/places/ReportedPlace';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/**
 * The FirebasePlaceService provides real-time data streaming to a Firebase CloudFirestore.
 * It is used to perform CRUD operations on the saved Placees of sales representitives, and stores these Placees server-side.
 * This service works in conjunction with the FirebaseAuthService. A user must first be authenticated into the app before an instance of a FirebasePlaceService
 * can exist, else an error is thrown. 
 * When a user is authenticated, their saved Placees will be retrieved from the CloudFirestore.
 */
export class FirebasePlacesService {
  private static readonly REPORTED_PLACES_COL: string = "reported_places";
  private static _reportedPlaces: ReportedPlace[] = [];

  private pFormatter: PlaceFormatter;

  /**
   * Creates a new FirebasePlaceService.
   * @param authService The FirebaseAuthService used to synchronize data changes on the currently logged-in user's saved Placees.
   */
  constructor(private authService: FirebaseAuthService, private afs: AngularFirestore) {
    if(!FirebaseAuthService.userIsAuthenticated) {
      throw new Error("FirebaseAuthService must have a user authenticated before FirebasePlaceService can be instantiated.");
    }

    this.pFormatter = new PlaceFormatter();
    this.loadReportedPlaces();
  }

  private loadReportedPlaces() {
    const collection: AngularFirestoreCollection<ReportedPlace> = this.afs.collection(FirebasePlacesService.REPORTED_PLACES_COL);

    collection.valueChanges().subscribe(places => {
      FirebasePlacesService._reportedPlaces = places;
    });
  }

  /**
   * Adds a new Place document under the user's saved Placees.
   * The Place will not be added if it has the same Address as an existing saved Place.
   * @param place The Place to add.
   * @returns The result of the operation.
   */
  public async addPlace(place: Place): Promise<CRUDResult> {
    let result: CRUDResult;

    if(this.savedAddressExists(place.info.address.addressString)) {
      result = CRUDResult.DUPLICATE_PLACE_EXISTS;
    }
    else {
      place.saveState = "saved";
      place = this.pFormatter.formatPlaceAddress(place);
      this.savedPlaces.push(place);

      const serverUpdate: CRUDResult = await this.authService.synchronize();

      if(!serverUpdate.wasSuccessful) {
        this.savedPlaces.splice(this.savedPlaces.indexOf(place), 1);
        result = new CRUDResult(false, "Failed to update place - internal server error.");
      }
      else {
        result = new CRUDResult(true, "Place saved successfully.");
      }
    }

    return result;
  }

  /**
   * Updates an existing Place under the user's saved Placees, replacing the provided original data with the new data.
   * No update operation will be performed if the original Place does not exist in the user's saved Placees.
   * @param original The original Place to update.
   * @param updated The new Place to replace with the original.
   * @returns The result of the operation.
   */
  public async updatePlace(original: Place, updated: Place): Promise<CRUDResult> {
    let result: CRUDResult;

    if(!this.savedPlaces.includes(original)) {
      result = CRUDResult.PLACE_DOES_NOT_EXIST;
    }
    else {
      updated = this.pFormatter.formatPlaceAddress(updated);
      this.savedPlaces[this.savedPlaces.indexOf(original)] = updated;

      const serverUpdate = await this.authService.synchronize();

      if(!serverUpdate.wasSuccessful) {
        this.savedPlaces[this.savedPlaces.indexOf(updated)] = original;
        result = new CRUDResult(false, "Failed to update place - internal server error.");
      }
      else {
        result = new CRUDResult(true, "Place updated successfully.");
      }
    }

    return result;
  }

  /**
   * Deletes the user's saved Place.
   * No deletion operation will be performed if the Place does not exist in the user's saved Placees.
   * @param place The Place to delete.
   * @returns The result of the operation.
   */
  public async deletePlace(place: Place): Promise<CRUDResult> {
    let result: CRUDResult;

    if(!this.savedAddressExists(place.info.address.addressString)) {
      result = CRUDResult.PLACE_DOES_NOT_EXIST;
    }
    else {
      let existingPlace: Place;

      this.savedPlaces.filter(b => {
        if(b.info.address.addressString === place.info.address.addressString) {
          existingPlace = b;
          this.savedPlaces.splice(this.savedPlaces.indexOf(b), 1);
          return;
        }
      });

      const serverUpdate = await this.authService.synchronize();

      if(!serverUpdate.wasSuccessful) {
        result = new CRUDResult(false, "Failed to delete place - internal server error.");
        this.savedPlaces.push(existingPlace);
      }
      else {
        result = new CRUDResult(true, "Place deleted successfully.");
      }
    }

    return result;
  }

  /**
   * Updates an existing Place's PlaceSaveState value, toggling it between "stared" and "saved".
   * No update operation will be performed if the Place does not exist in the user's saved Placees.
   * @param place The Place whose PlaceSaveState will be toggled.
   * @returns The result of the operation.
   */
  public async togglePlaceStarred(place: Place): Promise<CRUDResult> {
    let result: CRUDResult

    if(!this.savedPlaces.includes(place)) {
      result = CRUDResult.PLACE_DOES_NOT_EXIST;
    }
    else {
      const originalState: PlaceSaveState = place.saveState;

      if(originalState == "saved") {
        place.saveState = "starred";
      }
      else if(originalState == "starred") {
        place.saveState = "saved";
      }

      const serverUpdate = await this.authService.synchronize();

      if(!serverUpdate.wasSuccessful) {
        place.saveState = originalState;
        result = new CRUDResult(false, "Failed to update place - internal server error.");
      }
      else {
        result = new CRUDResult(true, `${place.saveState == "starred" ? "Starred" : "Un-Starred"} place.`);
      }
    }

    return result;
  }

  public async reportPlace(place: Place, callback: (result: CRUDResult) => void) {
    const reportedPlace: ReportedPlace = {
      info: place.info,
      reportedBy: this.authService.authedSalesRep.info,
      dateReported: new Date().toDateString()
    }

    if(this.reportedAddressExists(place.info.address.addressString)) {
      this.reportExistingPlace(reportedPlace, result => callback(result));
    }
    else {
      this.reportNewPlace(reportedPlace, result => callback(result));
    }
  }

  private async reportNewPlace(place: ReportedPlace, callback: (result: CRUDResult) => void) {
    await this.afs.collection(FirebasePlacesService.REPORTED_PLACES_COL).add(place)
      .then(() => {
        callback(new CRUDResult(true, "Place reported successfully."));
      })
      .catch(() => {
        callback(new CRUDResult(false, "A network error occurred while reporting place."));
      });
  }

  private reportExistingPlace(place: ReportedPlace, callback: (result: CRUDResult) => void) {
    const subscription = new Subscription();

    //Create the select query to find the existing document in the collection...
    const query = this.afs.collection<ReportedPlace>(FirebasePlacesService.REPORTED_PLACES_COL, query => query
      .where("info.address.addressString", "==", place.info.address.addressString)
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
        this.afs.doc<ReportedPlace>(`${FirebasePlacesService.REPORTED_PLACES_COL}/${docId}`).update(place)
          .then(() => callback(new CRUDResult(true, "Place reported successfully.")))
          .catch(() => callback(new CRUDResult(false, "A network error occurred while reporting place.")))
      }
    }));
  }

  public savedAddressExists(address: string): boolean {
    return this.addressExistsInCollection(address, this.savedPlaces);
  }

  public reportedAddressExists(address: string): boolean {
    return this.addressExistsInCollection(address, this.reportedPlaces);
  }

  private addressExistsInCollection(address: string, collection: Place[] | ReportedPlace[]): boolean {
    let result = false;

    const formattedAddress: string = this.pFormatter.formatAddressString(address).toLowerCase();

    for(const place of collection) {
      if(formattedAddress === this.pFormatter.formatAddressString(place.info.address.addressString).toLowerCase()) {
        result = true;
        break;
      }
    }

    return result;
  }

  /**
   * The user's saved Placees.
   */
  public get savedPlaces(): Place[] {
    return this.authService.authedSalesRep.savedPlaces;
  }

  public get reportedPlaces(): ReportedPlace[] {
    return FirebasePlacesService._reportedPlaces;
  }
}