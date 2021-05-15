import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OximapPageRoutingModule } from './oximap-routing.module';

import { OximapPage } from './oximap.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OximapPageRoutingModule
  ],
  declarations: [OximapPage]
})
export class OximapPageModule {}
