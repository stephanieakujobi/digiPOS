/*
    Author:             Adriano Cucci
    Last Modified By:   Adriano Cucci
    Date Modified:      2019/09/28
*/

import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationsTabPage } from './notifications-tab.page';
import { NotificationsStorageService } from 'src/app/services/notifications-storage.service';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: NotificationsTabPage }])
  ],
  providers: [
    NotificationsStorageService
  ],
  declarations: [NotificationsTabPage]
})
export class NotificationsTabModule { }