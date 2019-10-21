import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BusinessesTabPage } from './businesses-tab.page';
import { SavedBusinessesStorageService } from 'src/app/services/businesses/storage/saved-businesses-storage.service';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: BusinessesTabPage }])
  ],
  providers: [
    SavedBusinessesStorageService
  ],
  declarations: [BusinessesTabPage]
})
export class BusinessTabModule {}
