import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReferenceletterPageRoutingModule } from './referenceletter-routing.module';

import { ReferenceletterPage } from './referenceletter.page';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../pipes/pipes.module';
import { TruncateModule  } from '@yellowspot/ng-truncate';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReferenceletterPageRoutingModule,
    TranslateModule,
    TruncateModule,
    PipesModule
  ],
  declarations: [ReferenceletterPage]
})
export class ReferenceletterPageModule {}
