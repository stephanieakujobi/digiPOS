import { Injectable } from '@angular/core';
import { AlertController, ToastController, ModalController } from '@ionic/angular';
import { ComponentRef, ComponentProps } from '@ionic/core';

/**
 * The PopupsService allows various pop-up elements to display to the user, such as alerts, toasts, and modals.
 */
@Injectable({
  providedIn: 'root'
})
export class PopupsService {
  private activeToast: HTMLIonToastElement;

  /**
   * Creates a new PopupsService
   * @param alertController The AlertController used to display alerts to the user.
   * @param toastController The ToastController used to display toasts to the user.
   * @param modalController The ModalController used to display modals to the user.
   */
  constructor(private alertController: AlertController, private toastController: ToastController, private modalController: ModalController) { }

  /**
   * Shows a basic alert window with a header, message, and close button.
   * @param header The header text to display.
   * @param message The message text to display.
   * @param closeButtonText The text to display in the close button.
   */
  public async showAlert(header: string, message: string, closeButtonText: string) {
    const alert = await this.createAlert(header, message);
    alert.buttons = [
      {
        text: closeButtonText,
        role: "cancel"
      }
    ];

    await alert.present();
  }

  /**
   * Shows an alert window with "yes" and "no" buttons.
   * @param header The header text to display.
   * @param message The message text to display. 
   * @param onYesClicked The callback function to run when the user presses the "yes" button.
   * @param onNoClicked The optional callback function to run when the user presses the "no" button.
   */
  public async showConfirmationAlert(header: string, message: string, onYesClicked: () => void, onNoClicked?: () => void) {
    const alert = await this.createAlert(header, message);
    alert.buttons = [
      {
        text: "Yes",
        handler: onYesClicked
      },
      {
        text: "No",
        role: "cancel",
        handler: onNoClicked
      }
    ];

    await alert.present();
  }

  /**
   * Shows a toast to the user. The toast will disappear automatically after two seconds.
   * @param message The message to display in the toast.
   */
  public async showToast(message: string, topOfViewport: boolean = false) {
    if(this.activeToast != null) {
      this.activeToast.dismiss();
    }

    this.activeToast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: topOfViewport ? "top" : "bottom",
      cssClass: topOfViewport ? "header-margin" : "tabs-margin"
    });

    await this.activeToast.present();
  }

  /**
   * Creates and displays a modal page to the user.
   * @param component The component page reference to display.
   * @param properties Any properties that may be passed to the modal page.
   * @param onDismissed The optional callback function to run when the user dismisses the modal page.
   */
  public async showModal(component: ComponentRef, properties?: ComponentProps<ComponentRef>, onDismissed?: (data: any) => void) {
    const modal = await this.modalController.create({
      component: component,
      componentProps: properties,
      backdropDismiss: false
    });

    await modal.present();

    await modal.onWillDismiss().then(({ data }) => {
      if(onDismissed != null) {
        onDismissed(data);
      }
    });
  }

  /**
   * Scaffholds the alert-creation process for all alert-creation functions.
   * @param header The header text to display in the alert.
   * @param message The message text to display in the alert.
   * @returns A new HTMLIonAlertElement.
   */
  private async createAlert(header: string, message: string): Promise<HTMLIonAlertElement> {
    const alert = await this.alertController.create({
      header: header,
      message: message
    });

    return alert;
  }
}