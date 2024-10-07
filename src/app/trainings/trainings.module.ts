import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainingsPageRoutingModule } from './trainings-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { TrainingsPage } from './trainings.page';
import { PipesModule } from '../../pipes/pipes.module';
import { TruncateModule  } from '@yellowspot/ng-truncate';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainingsPageRoutingModule,
    TranslateModule,
    TruncateModule,
    PipesModule
  ],
  declarations: [TrainingsPage]
})
export class TrainingsPageModule {}
