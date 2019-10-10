import { HtmlInfoWindow } from '@ionic-native/google-maps';
import { BusinessLocation } from './BusinessLocation';

export class InfoWindow {
    private constructor() { }

    public static ForBusinessLocation(businessLocation: BusinessLocation, saveButtonClicked: () => void, routeButtonClicked: () => void): HtmlInfoWindow {
        let infoWindow = new HtmlInfoWindow();
        let content: HTMLElement = document.createElement("div");

        content.style.padding = "0 10px";

        content.innerHTML = [
            `<h5>${businessLocation.name}</h5>`,
            `<p>${businessLocation.address}</p>`,
            `<div style="position: absolute; bottom: 20px; width: 91.5%;">`,
            this.infoWindowButton((businessLocation.isSaved ? "Un-save" : "Save") + " business", "add-circle"),
            this.infoWindowButton("Start a route", "navigate"),
            "</div>"
        ].join("");

        content.getElementsByTagName("ion-button")[0].addEventListener("click", function() {
            businessLocation.isSaved = !businessLocation.isSaved;

            let buttonText = (businessLocation.isSaved ? "Un-save" : "Save") + " business";
            let buttonIcon = businessLocation.isSaved ? "close-circle" : "add-circle";

            this.innerHTML = `<ion-icon slot="start" name="${buttonIcon}"></ion-icon>${buttonText}`;
            saveButtonClicked();
        });

        content.getElementsByTagName("ion-button")[1].addEventListener("click", function() { routeButtonClicked(); });

        infoWindow.setContent(content, {
            width: "250px",
            height: "215px",
        });

        return infoWindow;
    }

    private static infoWindowButton(buttonText: string, iconName: string) {
        return `<ion-button expand="block" style="margin-right: 11px;">
        <ion-icon slot="start" name="${iconName}"></ion-icon>
        ${buttonText}
        </ion-button>`;
    }
}