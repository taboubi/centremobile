import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReferenceletterPage } from './referenceletter.page';

const routes: Routes = [
  {
    path: '',
    component: ReferenceletterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReferenceletterPageRoutingModule {}
