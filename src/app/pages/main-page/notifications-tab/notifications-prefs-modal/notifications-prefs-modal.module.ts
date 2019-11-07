import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NotifsPrefsModalPage } from './notifications-prefs-modal.page';

const routes: Routes = [
  {
    path: '',
    component: NotifsPrefsModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NotifsPrefsModalPage]
})
export class NotificationsPrefsModalModule { }
