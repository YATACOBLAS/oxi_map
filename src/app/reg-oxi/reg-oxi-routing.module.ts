import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegOxiPage } from './reg-oxi.page';

const routes: Routes = [
  {
    path: '',
    component: RegOxiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegOxiPageRoutingModule {}
