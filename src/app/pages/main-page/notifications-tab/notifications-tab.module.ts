/*
    Author:             Adriano Cucci
    Last Modified By:   Adriano Cucci
    Date Modified:      2019/10/02
*/

import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationsTabPage } from './notifications-tab.page';
import { AppNotifsStorageService } from 'src/app/services/notifications/storage/app-notifis-storage.service';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: NotificationsTabPage }])
  ],
  providers: [
    AppNotifsStorageService
  ],
  declarations: [NotificationsTabPage]
})
export class NotificationsTabModule { }