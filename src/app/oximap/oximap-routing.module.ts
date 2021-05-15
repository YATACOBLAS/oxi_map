import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OximapPage } from './oximap.page';

const routes: Routes = [
  {
    path: '',
    component: OximapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OximapPageRoutingModule {}
