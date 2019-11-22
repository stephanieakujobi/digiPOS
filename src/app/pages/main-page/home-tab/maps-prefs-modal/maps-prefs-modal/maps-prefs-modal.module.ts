import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MapsPrefsModalPage } from './maps-prefs-modal.page';

const routes: Routes = [
  {
    path: '',
    component: MapsPrefsModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MapsPrefsModalPage]
})
export class MapsPrefsModalPageModule {}
