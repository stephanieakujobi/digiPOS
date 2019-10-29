import { Component } from '@angular/core';
import { FirebaseAuthService } from 'src/app/services/firebase/authentication/firebase-auth.service';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

/**
 * The first page the user sees when they launch the app, prompting them to login.
 */
export class LoginPage {
  private loginProgress: HTMLIonProgressBarElement;

  /**
   * Creates a new LoginPage.
   * @param authService The FirebaseAuthService used to authenticate the user.
   * @param toastController The ToastController used to show authentication result messages to the user.
   * @param navController The NavController to redirect to the main page upon successful login.
   */
  constructor(private authService: FirebaseAuthService, private toastController: ToastController, private navController: NavController) { }

  /**
   * @see https://ionicframework.com/docs/angular/lifecycle
   */
  ionViewDidEnter() {
    this.loginProgress = document.querySelector("ion-progress-bar");
  }

  /**
   * A function called from the page when the user submits the login form.
   * Passes the email and password input values to the FirebaseAuthService to authenticate.
   * If authentication is successful, the user will be redirected to the main page, else an authentication error message will be displayed.
   */
  onLoginFormSubmit() {
    this.loginProgress.style.opacity = "1";

    const email: string = (document.getElementById("txt-email") as HTMLIonInputElement).value;
    const password: string = (document.getElementById("txt-password") as HTMLIonInputElement).value;

    this.authService.tryLogin(email, password, result => {
      this.loginProgress.style.opacity = "0";

      if(!result.wasSuccessful) {
        this.presentToast(result.message);
      }
      else {
        this.navController.navigateForward("/main");
      }
    });
  }

  /**
   * Presents a toast to the user. The toast will disappear automatically after two seconds.
   * @param message The message to display in the toast.
   */
  private async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: "top",
      cssClass: "header-margin"
    });

    toast.present();
  }
}