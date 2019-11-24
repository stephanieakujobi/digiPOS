import { Injectable } from '@angular/core';
import { PrefsService } from 'src/app/classes/global/PrefsService';
import { PlacesPrefs } from 'src/app/classes/places/PlacesPrefs';

/**
 * The PlacesPrefsService handles read/write operations on the user's saved Businesses preferences.
 */
@Injectable({
  providedIn: 'root'
})
export class PlacesPrefsService extends PrefsService<PlacesPrefs> {
  protected setStorageKey(): string {
    return "businesses_preferences";
  }

  protected instantiateNewPrefs(): PlacesPrefs {
    return new PlacesPrefs();
  }
}