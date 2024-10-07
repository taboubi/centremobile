import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemDetailPageRoutingModule } from './item-detail-routing.module';
import { TranslateModule } from '@ngx-translate/core'
import { ItemDetailPage } from './item-detail.page';
import { PipesModule } from '../../pipes/pipes.module';
import { TruncateModule  } from '@yellowspot/ng-truncate';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemDetailPageRoutingModule,
    TranslateModule,
    TruncateModule,
    PipesModule
  ],
  declarations: [ItemDetailPage]
})
export class ItemDetailPageModule {}
