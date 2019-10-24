import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeTabPage } from './home-tab.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: HomeTabPage }]),
  ],
  providers: [
    Geolocation,
    GoogleMapsService
  ],
  declarations: [HomeTabPage]
})
export class HomeTabModule { }