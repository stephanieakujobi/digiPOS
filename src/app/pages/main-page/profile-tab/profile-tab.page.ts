import { Component } from '@angular/core';
import { FirebaseAuthService } from 'src/app/services/firebase/authentication/firebase-auth.service';
import { Contact } from 'src/app/models/places/Contact';

@Component({
  selector: 'profile-home-tab',
  templateUrl: 'profile-tab.page.html',
  styleUrls: ['profile-tab.page.scss']
})

/**
 * The page displayed to the user when they select the "My Profile" tab.
 */
export class ProfileTabPage {
  private userInfo: Contact;

  constructor(private fbAuthService: FirebaseAuthService) {
    this.userInfo = this.fbAuthService.authedSalesRep.info;
  }
}