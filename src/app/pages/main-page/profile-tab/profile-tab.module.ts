import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileTabPage } from './profile-tab.page';
import { ImagePicker } from '@ionic-native/image-picker/ngx';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: ProfileTabPage }])
  ],
  providers: [
    ImagePicker
  ],
  declarations: [ProfileTabPage]
})
export class ProfileTabModule { }