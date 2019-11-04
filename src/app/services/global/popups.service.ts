import { Injectable } from '@angular/core';
import { AlertController, ToastController, ModalController } from '@ionic/angular';
import { ModalOptions, ComponentRef, ComponentProps } from '@ionic/core';

@Injectable({
  providedIn: 'root'
})
export class PopupsService {
  constructor(private alertController: AlertController, private toastController: ToastController, private modalController: ModalController) { }

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

  public async showConfirmationAlert(header: string, message: string, onYesClicked: () => void, onNoClicked: () => void) {
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
   * Presents a toast to the user. The toast will disappear automatically after two seconds.
   * @param message The message to display in the toast.
   */
  public async showToast(message: string, topOfViewport: boolean = false) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: topOfViewport ? "top" : "bottom",
      cssClass: topOfViewport ? "header-margin" : "tabs-margin"
    });

    await toast.present();
  }

  public async showModal(component: ComponentRef, properties: ComponentProps<ComponentRef>, onDismissed: (data: any) => void) {
    const modal = await this.modalController.create({
      component: component,
      componentProps: properties,
      backdropDismiss: false
    });

    await modal.present();

    await modal.onWillDismiss().then(({ data }) => {
      onDismissed(data);
    });
  }

  private async createAlert(header: string, message: string): Promise<HTMLIonAlertElement> {
    const alert = await this.alertController.create({
      header: header,
      message: message
    });

    return alert;
  }
}