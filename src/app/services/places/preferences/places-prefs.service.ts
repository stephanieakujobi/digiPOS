import { Injectable } from '@angular/core';
import { PrefsService } from 'src/app/classes/global/PrefsService';
import { PlacesPrefs } from 'src/app/classes/places/PlacesPrefs';

/**
 * The PlacesPrefsService handles read/write operations on the user's saved Places preferences.
 */
@Injectable({
  providedIn: 'root'
})
export class PlacesPrefsService extends PrefsService<PlacesPrefs> {
  protected setStorageKey(): string {
    return "places_preferences";
  }

  protected instantiateNewPrefs(): PlacesPrefs {
    return new PlacesPrefs();
  }
}