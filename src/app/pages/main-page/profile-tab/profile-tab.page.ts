import { Component } from '@angular/core';
import { FirebaseAuthService } from 'src/app/services/firebase/authentication/firebase-auth.service';
import { SalesRepContact } from 'src/app/models/global/SalesRepContact';
import { ImagePicker } from '@ionic-native/image-picker/ngx';

/**
 * The page displayed to the user when they select the "My Profile" tab.
 */
@Component({
  selector: 'profile-home-tab',
  templateUrl: 'profile-tab.page.html',
  styleUrls: ['profile-tab.page.scss']
})
export class ProfileTabPage {
  private userInfo: SalesRepContact; //Interpolated in profile-tab.page.html

  /**
   * Creates a new ProfileTabPage
   */
  constructor(private imagePicker: ImagePicker) {
    this.userInfo = FirebaseAuthService.authedSalesRep.info;
  }

  async pickImage() {
    if(await this.hasImageReadPermission()) {
      this.imagePicker.getPictures({ maximumImagesCount: 1 }).then(
        results => { },
        err => { }
      );
    }
  }

  private async hasImageReadPermission(): Promise<boolean> {
    let hasPermission: boolean = await this.imagePicker.hasReadPermission();

    if(!hasPermission) {
      this.imagePicker.requestReadPermission().then(
        (result: boolean) => hasPermission = result
      );
    }

    return hasPermission;
  }
}