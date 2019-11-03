import { HtmlInfoWindow } from '@ionic-native/google-maps';
import { IMapPlace } from '../../interfaces/google-maps/IMapPlace';

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
     * @param place The Business that was selected.
     * @param onSaveBtnClicked The callback function for when the user presses the "save/unsave business" button in the HtmlInfoWindow.
     * @param onRouteBtnClicked The callback function for when the user presses the "start a route" button in the HtmlInfoWindow.
     * @returns A pre-content-filled HtmlInfoWindow object.
     */
    public static ForPlaceLocation(place: IMapPlace, onSaveBtnClicked: (wasSaved: boolean) => void, onRouteBtnClicked: () => void): HtmlInfoWindow {
        const infoWindow = new HtmlInfoWindow();
        const content: HTMLElement = document.createElement("div");

        content.innerHTML = [
            `<h5>${place.name}</h5>`,
            `<p>${place.address}</p>`,
            `<div style="position: absolute; bottom: 20px; width: 91.5%;">`,
            this.infoWindowButton((place.isSaved ? "Un-save" : "Save") + " place", place.isSaved ? "close-circle" : "add-circle"),
            this.infoWindowButton("Start a route", "navigate"),
            "</div>"
        ].join("");

        content.style.padding = "0 10px";

        const buttons: HTMLCollectionOf<HTMLIonButtonElement> = content.getElementsByTagName("ion-button");
        const saveButton: HTMLIonButtonElement = buttons[0];
        const routeButton: HTMLIonButtonElement = buttons[1];

        saveButton.addEventListener("click", function() { onSaveBtnClicked(!place.isSaved) });
        routeButton.addEventListener("click", function() { onRouteBtnClicked(); });

        infoWindow.setContent(content, {
            width: "250px",
            height: "240px",
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