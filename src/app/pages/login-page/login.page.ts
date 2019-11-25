import { Component } from '@angular/core';
import { FirebaseAuthService } from 'src/app/services/firebase/authentication/firebase-auth.service';
import { NavController, ToastController } from '@ionic/angular';
import { PopupsService } from 'src/app/services/global/popups/popups.service';
import { GlobalServices } from 'src/app/classes/global/GlobalServices';

/**
 * The first page the user sees when they launch the app, prompting them to login.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  private loginInProgress: boolean; //Interpolated in login.page.html

  /**
   * Creates a new LoginPage.
   * @param authService The FirebaseAuthService used to authenticate the user.
   * @param popupsService The PopupsService used to show toast messages to the user upon failed login.
   * @param navController The NavController to redirect to the main page upon successful login.
   */
  constructor(private authService: FirebaseAuthService, private popupsService: PopupsService, private navController: NavController) { }

  /**
   * A function called from the page when the user submits the login form.
   * Passes the email and password input values to the FirebaseAuthService to authenticate.
   * If authentication is successful, the user will be redirected to the main page, else an authentication error message will be displayed.
   */
  onLoginFormSubmit() {
    const email: string = (document.getElementById("txt-email") as HTMLIonInputElement).value;
    const password: string = (document.getElementById("txt-password") as HTMLIonInputElement).value;

    if(email != "" && password != "") {
      this.loginInProgress = true;

      this.authService.tryLogin(email, password, async result => {
        this.loginInProgress = false;

        if(!result.wasSuccessful) {
          this.popupsService.showToast(result.message, true);
        }
        else {
          await GlobalServices.loadUserData();
          this.navController.navigateForward("/main");
        }
      });
    }
  }
}