import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BusinessesTabPage } from './businesses-tab.page';
import { FirebaseBusinessService } from 'src/app/services/firebase/businesses/firebase-business.service';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: BusinessesTabPage }])
  ],
  providers: [
    FirebaseBusinessService
  ],
  declarations: [BusinessesTabPage]
})
export class BusinessTabModule {}
