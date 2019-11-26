import { Injectable, OnDestroy } from '@angular/core';
import { CRUDResult } from 'src/app/classes/global/CRUDResult';
import { Place } from 'src/app/models/places/Place';
import { PlaceSaveState } from 'src/app/classes/places/PlaceSaveState';
import { FirebaseAuthService } from '../authentication/firebase-auth.service';
import { PlaceFormatter } from 'src/app/classes/places/PlaceFormatter';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ReportedPlace } from 'src/app/models/places/ReportedPlace';
import { Subscription } from 'rxjs';
import { GlobalServices } from 'src/app/classes/global/GlobalServices';

/**
 * The FirebasePlacesService provides real-time data streaming to a Firebase CloudFirestore.
 * It is used to perform CRUD operations on the saved Placees of sales representitives, and stores these Placees server-side.
 * This service works in conjunction with the FirebaseAuthService. A user must first be authenticated into the app before an instance of a FirebasePlacesService
 * can exist, else an error is thrown. 
 * When a user is authenticated, their saved Placees will be retrieved from the CloudFirestore.
 */
@Injectable({
  providedIn: 'root'
})
export class FirebasePlacesService implements OnDestroy {
  private static readonly REPORTED_PLACES_COL: string = "reported_places";
  private static _reportedPlaces: ReportedPlace[] = [];
  private static onPlaceUpdatedCallbacks: ((place: Place) => void)[] = [];

  private subscriptions: Subscription;
  private pFormatter: PlaceFormatter;
  private reportedPlacesLoaded: boolean;

  /**
   * Creates a new FirebasePlacesService.
   * @param authService The FirebaseAuthService used to synchronize data changes on the currently logged-in user's saved Placees.
   */
  constructor(private authService: FirebaseAuthService, private afs: AngularFirestore) {
    this.subscriptions = new Subscription();
    this.pFormatter = new PlaceFormatter();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Loads all reported Places from a dedicated Firestore collection.
   * These Places can be pinned on the map if desired by the user.
   * @param onComplete The callback to run once the reported Places have been loaded.
   */
  public loadReportedPlaces(onComplete: () => void) {
    const collection: AngularFirestoreCollection<ReportedPlace> = this.afs.collection(FirebasePlacesService.REPORTED_PLACES_COL);

    this.subscriptions.add(collection.valueChanges().subscribe(places => {
      FirebasePlacesService._reportedPlaces = places;

      if(!this.reportedPlacesLoaded) {
        this.updateUserReportedPlaces();
        this.reportedPlacesLoaded = true;
        onComplete();
      }
    }));
  }

  /**
   * Called from loadReportedPlaces.
   * Compares the user's saved Places with all other reported Places in the database and updates their isReported values if the Place's address has
   * been reported by any other user.
   */
  private updateUserReportedPlaces() {
    for(const sPlace of this.savedPlaces) {
      sPlace.isReported = this.reportedPlaces.find(p => p.info.address.addressString == sPlace.info.address.addressString) != null;
    }
    this.authService.synchronize();
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
      const newPlace = this.pFormatter.newSavedPlace(place);
      if(place.isReported) {
        const existingReportedPlace: ReportedPlace = this.reportedPlaces.find(p => p.info.address.addressString == place.info.address.addressString);

        if(existingReportedPlace != null) {
          newPlace.info = this.pFormatter.clonePlaceInfo(existingReportedPlace);
        }
      }
      
      this.savedPlaces.push(newPlace);

      const syncResult: CRUDResult = await this.authService.synchronize();

      if(!syncResult.wasSuccessful) {
        this.savedPlaces.splice(this.savedPlaces.indexOf(newPlace), 1);
        result = syncResult;
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
      const updatedPlace = this.pFormatter.updatedPlace(updated);
      this.savedPlaces[this.savedPlaces.indexOf(original)] = updatedPlace;

      const syncResult = await this.authService.synchronize();

      if(!syncResult.wasSuccessful) {
        this.savedPlaces[this.savedPlaces.indexOf(updatedPlace)] = original;
        result = syncResult;
      }
      else {
        result = new CRUDResult(true, "Place updated successfully.");
        FirebasePlacesService.onPlaceUpdatedCallbacks.forEach(c => c(updated));
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

      const syncResult = await this.authService.synchronize();

      if(!syncResult.wasSuccessful) {
        this.savedPlaces.push(existingPlace);
        result = syncResult;
      }
      else {
        result = new CRUDResult(true, "Place deleted successfully.");
        GlobalServices.notifsGeneratorService.generatePlaceDeleted(place);
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
      place.saveState = place.saveState == "saved" ? "starred" : "saved";

      const syncResult = await this.authService.synchronize();

      if(!syncResult.wasSuccessful) {
        place.saveState = originalState;
        result = syncResult;
      }
      else {
        result = new CRUDResult(true, `${place.saveState == "starred" ? "Starred" : "Un-Starred"} place.`);
      }
    }

    return result;
  }

  /**
   * Reports a place into a dedicated Firestore collection with the currently logged-in user's Contact info, describing them as the one who reported the Place.
   * @param place The Place to report
   * @param callback The callback containing the CRUDResult of the operation to run upon completion.
   */
  public async reportPlace(place: Place, callback: (result: CRUDResult) => void) {
    if(!FirebaseAuthService.userIsAuthenticated) {
      callback(CRUDResult.USER_NOT_AUTHENTICATED);
    }
    else {
      const reportedPlace: ReportedPlace = {
        info: place.info,
        reportedBy: FirebaseAuthService.authedSalesRep.info,
        dateReported: new Date().toDateString()
      }

      const handleResult = (result: CRUDResult) => {
        if(result.wasSuccessful) {
          place.isReported = true;
          FirebasePlacesService.onPlaceUpdatedCallbacks.forEach(c => c(place));
        }
        callback(result);
      }

      if(this.reportedAddressExists(place.info.address.addressString)) {
        this.reportExistingPlace(reportedPlace, result => handleResult(result));
      }
      else {
        this.reportNewPlace(reportedPlace, result => handleResult(result));
      }
    }
  }

  /**
   * Called from reportPlace if the Place being reported does not exist under the user's saved Places.
   * Adds a new reported Place to to the Firestore collection.
   * @param place The Place to report.
   * @param callback The callback containing the CRUDResult of the operation to run upon completion.
   */
  private async reportNewPlace(place: ReportedPlace, callback: (result: CRUDResult) => void) {
    await this.afs.collection(FirebasePlacesService.REPORTED_PLACES_COL).add(place)
      .then(() => callback(new CRUDResult(true, "Place reported successfully.")))
      .catch(() => callback(new CRUDResult(false, "A network error occurred while reporting place.")));
  }

  /**
   * Called from reportPlace if the Place being reported already exists under the user's saved Places.
   * Selects this existing Place from the Firestore collection and updates it.
   * @param place The Place to report.
   * @param callback The callback containing the CRUDResult of the operation to run upon completion.
   */
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

  /**
   * Checks if an address string exists in the user's saved Places.
   * @param address the address string to compare.
   * @returns True if the address exists, and false if not.
   */
  public savedAddressExists(address: string): boolean {
    return this.addressExistsInCollection(address, this.savedPlaces);
  }

  /**
   * Checks if an address string exists in the reported Places Firestore collection.
   * @param address the address string to compare.
   * @returns True if the address exists, and false if not.
   */
  public reportedAddressExists(address: string): boolean {
    return this.addressExistsInCollection(address, this.reportedPlaces);
  }

  /**
   * Checks if an address string exists in a collection of Places or ReportedPlaces.
   * @param address The address string to compare.
   * @param collection The collection of Places or Reported places to check for the address string in.
   * @returns True if the address exists, and false if not.
   */
  private addressExistsInCollection(address: string, collection: Place[] | ReportedPlace[]): boolean {
    let result = false;

    if(FirebaseAuthService.userIsAuthenticated) {
      const formattedAddress: string = this.pFormatter.formatAddressString(address).toLowerCase();

      for(const place of collection) {
        if(formattedAddress === this.pFormatter.formatAddressString(place.info.address.addressString).toLowerCase()) {
          result = true;
          break;
        }
      }
    }

    return result;
  }

  /**
   * Run the provided callback function when a Place has been updated.
   * @param callback The callback function to run.
   */
  public static subscribeOnPlaceUpdated(callback: (place: Place) => void) {
    this.onPlaceUpdatedCallbacks.push(callback);
  }

  /**
   * The user's saved Placees.
   */
  public get savedPlaces(): Place[] {
    return FirebaseAuthService.userIsAuthenticated ? FirebaseAuthService.authedSalesRep.savedPlaces : [];
  }

  /**
   * The reference to all Places that have been reported.
   */
  public get reportedPlaces(): ReportedPlace[] {
    return FirebaseAuthService.userIsAuthenticated ? FirebasePlacesService._reportedPlaces : [];
  }
}