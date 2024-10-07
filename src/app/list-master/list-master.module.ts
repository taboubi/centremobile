import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListMasterPageRoutingModule } from './list-master-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ListMasterPage } from './list-master.page';
import { PipesModule } from '../../pipes/pipes.module';
import { TruncateModule  } from '@yellowspot/ng-truncate';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListMasterPageRoutingModule,
    TranslateModule,
    TruncateModule,
    PipesModule

  ],
  declarations: [ListMasterPage]
})
export class ListMasterPageModule {}
