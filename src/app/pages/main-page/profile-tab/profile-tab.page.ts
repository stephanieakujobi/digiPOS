import { Component } from '@angular/core';
import { FirebaseAuthService } from 'src/app/services/firebase/authentication/firebase-auth.service';
import { Contact } from 'src/app/models/places/Contact';

/**
 * The page displayed to the user when they select the "My Profile" tab.
 */
@Component({
  selector: 'profile-home-tab',
  templateUrl: 'profile-tab.page.html',
  styleUrls: ['profile-tab.page.scss']
})
export class ProfileTabPage {
  private userInfo: Contact; //Interpolated in profile-tab.page.html

  /**
   * Creates a new ProfileTabPage
   */
  constructor() {
    this.userInfo = FirebaseAuthService.authedSalesRep.info;
  }
}