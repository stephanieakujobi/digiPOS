import { Injectable } from '@angular/core';
import { MapsPrefs } from 'src/app/classes/google-maps/MapsPrefs';
import { PrefsService } from 'src/app/classes/global/PrefsService';

@Injectable({
  providedIn: 'root'
})
export class MapsPrefsService extends PrefsService<MapsPrefs> {
  protected setStorageKey(): string {
    return "maps_preferences";
  }

  protected instantiateNewPrefs(): MapsPrefs {
    return new MapsPrefs();
  }
}