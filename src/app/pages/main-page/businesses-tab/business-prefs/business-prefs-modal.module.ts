import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BusinessPrefsModalPage } from './business-prefs-modal.page';

const routes: Routes = [
  {
    path: '',
    component: BusinessPrefsModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BusinessPrefsModalPage]
})
export class BusinessPrefsModalPageModule {}
