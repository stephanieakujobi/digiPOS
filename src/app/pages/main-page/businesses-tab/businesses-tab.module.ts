import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BusinessesTabPage } from './businesses-tab.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: BusinessesTabPage }])
  ],
  providers: [
    Geolocation,
    NativeGeocoder,
    FirebaseService
  ],
  declarations: [BusinessesTabPage]
})
export class BusinessTabModule {}
