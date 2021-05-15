import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegOxiPageRoutingModule } from './reg-oxi-routing.module';

import { RegOxiPage } from './reg-oxi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegOxiPageRoutingModule
  ],
  declarations: [RegOxiPage]
})
export class RegOxiPageModule {}
