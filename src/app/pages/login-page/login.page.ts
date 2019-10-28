import { Component } from '@angular/core';
import { FirebaseAuthService } from 'src/app/services/firebase/authentication/firebase-auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  private loginProgress: HTMLIonProgressBarElement;

  constructor(private authService: FirebaseAuthService, private navController: NavController) { }

  ionViewDidEnter() {
    this.loginProgress = document.querySelector("ion-progress-bar");
  }

  onLoginFormSubmit() {
    this.loginProgress.style.opacity = "1";

    const email: string = (document.getElementById("txt-email") as HTMLIonInputElement).value;
    const password: string = (document.getElementById("txt-password") as HTMLIonInputElement).value;

    this.authService.tryLogin(email, password, result => {
      this.loginProgress.style.opacity = "0";

      if(!result.wasSuccessful) {
      }
      else {
        this.navController.navigateRoot("/main");
      }
    });
  }
}