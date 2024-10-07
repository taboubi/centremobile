import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyeventsPageRoutingModule } from './myevents-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { MyeventsPage } from './myevents.page';
import { PipesModule } from '../../pipes/pipes.module';
import { TruncateModule  } from '@yellowspot/ng-truncate';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyeventsPageRoutingModule,
    TranslateModule,
    TruncateModule,
    PipesModule
  ],
  declarations: [MyeventsPage]
})
export class MyeventsPageModule {}
