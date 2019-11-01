import { Injectable, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Subscription } from 'rxjs';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation,
  Environment,
  GoogleMapOptions,
  ILatLng,
  LatLng,
  MarkerOptions,
  HtmlInfoWindow,
  Geocoder,
  GeocoderResult
} from '@ionic-native/google-maps';
import { InfoWindow } from 'src/app/classes/google-maps/InfoWindow';
import { IBusinessMapLoc } from 'src/app/interfaces/google-maps/IBusinessMapLoc';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { FirebaseBusinessService } from '../firebase/businesses/firebase-business.service';
import { BusinessFormatter } from 'src/app/classes/businesses/BusinessFormatter';
import { IBusiness } from 'src/app/interfaces/businesses/IBusiness';
import { CRUDResult } from 'src/app/classes/CRUDResult';
import { AppBusinessesPrefsService } from '../businesses/preferences/app-businesses-prefs.service';
import { PopupsService } from '../global/popups.service';

@Injectable({
  providedIn: 'root'
})

/**
 * The GoogleMapsService provides the functions the app needs for the user interacting with a GooleMap.
 */
export class GoogleMapsService implements OnDestroy {
  private map: GoogleMap;
  private userPosition: LatLng;
  private mapShouldFollowUser: boolean;

  private markers: Marker[];
  private searchMarker: Marker;
  private subscriptions: Subscription;

  /**
   * Creates a new GoogleMapsService.
   * @param platform The Platform used to detect when the native device is ready for native system calls to be made.
   * @param geolocation The Geolocation used to track the user's device.
   */
  constructor(
    private platform: Platform,
    private geolocation: Geolocation,
    private fbbService: FirebaseBusinessService,
    private geocoder: NativeGeocoder,
    private http: HTTP,
    private popupsService: PopupsService
  ) {
    this.mapShouldFollowUser = false;
    this.markers = [];
    this.subscriptions = new Subscription();
  }

  /**
   * Creates a new GoogleMap centered on the user's current location.
   * @param mapElementId The id attribute of an HTML element to insert the map.
   */
  public async initMap(mapElementId: string, onComplete: () => void) {
    await this.platform.ready();
    await this.createMap(mapElementId);
    this.subscribeEvents();
    onComplete();
  }

  /**
   * Unsubscribes from all events when this page is unloaded.
   * This prevents the same events being subscribed to multiple times over, which would cause memory leaks.
   * @see https://angular.io/api/core/OnDestroy for more info on ngOnDestroy.
   */
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  /**
   * Creates a new map on the page and centers the camera & user marker to the user's current location when initialized.
   */
  private async createMap(mapElementId: string) {
    let mapOptions: GoogleMapOptions = {
      controls: {
        myLocationButton: false,
        myLocation: true,
        zoom: true
      }
    }

    this.map = GoogleMaps.create(mapElementId, mapOptions);

    let userGeoPos = await this.geolocation.getCurrentPosition();
    this.userPosition = new LatLng(userGeoPos.coords.latitude, userGeoPos.coords.longitude);

    await this.map.moveCamera({
      target: this.userPosition,
      zoom: 18
    });
  }

  /**
   * Initializes the subscribed events that can occur with the service.
   * Events are subsribed so that they can be later disposed to prevent memory leaks.
   */
  private subscribeEvents() {
    //Event called in intervals, tracking the user's current location.
    this.subscriptions.add(this.geolocation.watchPosition({ enableHighAccuracy: true }).subscribe((pos: Geoposition) => {
      this.userPosition = new LatLng(pos.coords.latitude, pos.coords.longitude);

      if(this.mapShouldFollowUser) {
        this.map.animateCamera({
          target: this.userPosition,
          duration: 100
        });
      }
    }));

    this.subscriptions.add(this.map.on(GoogleMapsEvent.MAP_DRAG).subscribe(() => {
      this.mapShouldFollowUser = false;
    }));
  }

  public async centerMap(position?: ILatLng) {
    const centerPosition = position == null ? this.userPosition : position;

    await this.map.animateCamera({
      target: centerPosition,
      duration: 500
    });

    this.mapShouldFollowUser = position == null;
  }

  public markSavedBusinesses() {
    this.clearMarkers();

    const formatter = new BusinessFormatter();

    this.fbbService.businesses.forEach(business => {
      this.placeBusinessMarker(formatter.businessToMapLoc(business));
    });
  }

  public placeBusinessMarker(mapLoc: IBusinessMapLoc, centerPosition: boolean = false) {
    this.map.addMarker({ position: mapLoc.position }).then((marker: Marker) => {
      marker.setAnimation("DROP");
      this.markers.push(marker);

      let infoWindow = this.createBusinessInfoWindow(marker, mapLoc);

      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        infoWindow.open(marker);
      });

      if(centerPosition) {
        if(this.searchMarker != null) {
          this.searchMarker.remove();
        }

        this.searchMarker = marker;
        this.centerMap(mapLoc.position);
      }
    });
  }

  public placeBusinessSearchMarker(mapLoc: IBusinessMapLoc) {
    this.placeBusinessMarker(mapLoc, true)
  }

  public createBusinessInfoWindow(marker: Marker, mapLoc: IBusinessMapLoc): HtmlInfoWindow {
    const infoWindow = InfoWindow.ForBusinessLocation(mapLoc,
      async wasSaved => {
        const business: IBusiness = new BusinessFormatter().mapLocToBusiness(mapLoc);
        let result: CRUDResult;

        if(wasSaved) {
          result = await this.fbbService.addBusiness(business);
          this.mapLocUpdatedResult(result, marker, mapLoc);
        }
        else if(AppBusinessesPrefsService.prefs.askBeforeDelete) {
          this.popupsService.showConfirmationAlert("Delete Business", "Are you sure you want to delete this business?",
            async () => {
              result = await this.fbbService.deleteBusiness(business);
              this.mapLocUpdatedResult(result, marker, mapLoc);
            },
            null
          );
        }
        else {
          result = await this.fbbService.deleteBusiness(business);
          this.mapLocUpdatedResult(result, marker, mapLoc);
        }
      },
      () => {
        console.log("ROUTE");
      }
    );

    return infoWindow;
  }

  private mapLocUpdatedResult(result: CRUDResult, marker: Marker, mapLoc: IBusinessMapLoc) {
    if(result.wasSuccessful) {
      mapLoc.isSaved = !mapLoc.isSaved;
      marker.remove();
      this.placeBusinessMarker(mapLoc);
    }

    this.popupsService.showToast(result.message);
  }

  public findAddress(queryString: string, callback: (mapLoc: IBusinessMapLoc) => void) {
    queryString = queryString.replace(/,/g, "%2C");
    queryString = queryString.replace(/ /g, "%20");

    this.http.get(`http://localhost:3000/places?address=${queryString}`, {}, {})
      .catch(error => {
        console.log(error);
      })
      .then((response: any) => {
        const data = JSON.parse(response.data);

        if(data.candidates.length != 0) {
          const mapLoc: IBusinessMapLoc = {
            name: data.candidates[0].name,
            address: data.candidates[0].formatted_address,
            position: {
              lat: data.candidates[0].geometry.location.lat,
              lng: data.candidates[0].geometry.location.lng
            },
            isSaved: this.fbbService.savedAddressExists(data.candidates[0].formatted_address as string)
          };

          this.clearMarkers();
          this.placeBusinessMarker(mapLoc, true);
          callback(mapLoc);
        }
      });

    // Geocoder.geocode({ address: "Sheridan College, Brampton, Ontario" }).then((results: GeocoderResult[]) => {
    //   console.log(results);
    // });

    // this.geocoder.forwardGeocode(queryString, { useLocale: true, maxResults: 1 })
    //   .then((result: NativeGeocoderResult[]) => {
    //     const position = new LatLng(parseInt(result[0].latitude), parseInt(result[0].longitude));
    //     this.placeMarker(position);
    //   })
    //   .catch(error => {
    //     document.getElementById("debug-text").innerText = error.toString();
    //   })
  }

  public updateBusinessLocSaved(mapLoc: IBusinessMapLoc) {
    mapLoc.isSaved = this.fbbService.savedAddressExists(mapLoc.address);
  }

  public clearMarkers() {
    this.markers.forEach(marker => {
      marker.remove();
    });
  }
}
