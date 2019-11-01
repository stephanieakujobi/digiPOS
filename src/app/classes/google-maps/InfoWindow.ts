import { HtmlInfoWindow } from '@ionic-native/google-maps';
import { IBusinessMapLoc } from '../../interfaces/google-maps/IBusinessMapLoc';
import { Observable } from 'rxjs';

/**
 * A static utility class for providing Google Maps HtmlInfoWindow templates for specific use-cases.
 */
export class InfoWindow {
    /**
     * Private constructor prevents InfoWindow objects from being instantiated.
     */
    private constructor() { }

    /**
     * Creates an HtmlInfoWindow for a Business selected by the user on the map.
     * @param businessLoc The Business that was selected.
     * @param onSaveBtnClicked The callback function for when the user presses the "save/unsave business" button in the HtmlInfoWindow.
     * @param onRouteBtnClicked The callback function for when the user presses the "start a route" button in the HtmlInfoWindow.
     * @returns A pre-content-filled HtmlInfoWindow object.
     */
    public static ForBusinessLocation(businessLoc: IBusinessMapLoc, onSaveBtnClicked: (wasSaved: boolean) => void, onRouteBtnClicked: () => void): HtmlInfoWindow {
        let infoWindow = new HtmlInfoWindow();
        let content: HTMLElement = document.createElement("div");

        content.style.padding = "0 10px";

        content.innerHTML = [
            `<h5>${businessLoc.name}</h5>`,
            `<p>${businessLoc.address}</p>`,
            `<div style="position: absolute; bottom: 20px; width: 91.5%;">`,
            this.infoWindowButton((businessLoc.isSaved ? "Un-save" : "Save") + " business", "add-circle"),
            this.infoWindowButton("Start a route", "navigate"),
            "</div>"
        ].join("");

        content.getElementsByTagName("ion-button")[0].addEventListener("click", function() {
            let buttonText = (businessLoc.isSaved ? "Un-save" : "Save") + " business";
            let buttonIcon = businessLoc.isSaved ? "close-circle" : "add-circle";

            this.innerHTML = `<ion-icon slot="start" name="${buttonIcon}"></ion-icon>${buttonText}`;
            onSaveBtnClicked(!businessLoc.isSaved);
        });

        content.getElementsByTagName("ion-button")[1].addEventListener("click", function() { onRouteBtnClicked(); });

        infoWindow.setContent(content, {
            width: "250px",
            height: "215px",
        });

        return infoWindow;
    }

    /**
     * An internal function used for creating and adding IonButtons to HtmlInfoWindows.
     * @param buttonText The text to display in the IonButton.
     * @param iconName The IonIcon to display in the IconButton.
     * @returns an HTML string representation of an IonButton with an IonIcon.
     */
    private static infoWindowButton(buttonText: string, iconName: string): string {
        return `<ion-button expand="block" style="margin-right: 11px;">
        <ion-icon slot="start" name="${iconName}"></ion-icon>
        ${buttonText}
        </ion-button>`;
    }
}