import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, NavController, LoadingController, MenuController, AlertController, ActionSheetController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from 'src/app/translate-config.service';
import { Item } from '../../models/item';
import { Items } from '../../providers';
import { User } from '../../providers';
import { Api } from '../../providers';
import { share } from 'rxjs';
import { StorageService } from '../storage.service';
import { Storage } from '@ionic/storage';
import {  Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  constructor(private translateConfigService: TranslateConfigService,
    private translate: TranslateService) {
      this.translateConfigService.getDefaultLanguage();
      this.translateConfigService.getCurrentLang();
     }

  ngOnInit() {
  }

}
