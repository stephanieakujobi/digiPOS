import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PlacesPrefsModalPage } from './places-prefs-modal.page';

const routes: Routes = [
  {
    path: '',
    component: PlacesPrefsModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PlacesPrefsModalPage]
})
export class PlacesPrefsModalPageModule {}
