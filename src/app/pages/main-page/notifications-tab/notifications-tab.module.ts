import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationsTabPage } from './notifications-tab.page';
import { NotifsStorageService } from 'src/app/services/notifications/storage/notifis-storage.service';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: NotificationsTabPage }])
  ],
  providers: [
    NotifsStorageService
  ],
  declarations: [NotificationsTabPage]
})
export class NotificationsTabModule { }