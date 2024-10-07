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
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
   // Our local settings object
   options: any;

   settingsReady = false;
 
   public form: any;
   lang: string|null = '';
   language: string|null = '';
   langstring: any = {'fr': 'Français', 'en' : 'English'};
 
   profileSettings = {
     page: 'profile',
     pageTitleKey: 'EDIT_PROFILE'
   };
 
   passwordChange = {
     page: 'password',
     pageTitleKey: 'UPDATEPASSWORD'
   };
   password: string = '';
 
   page: string = 'main';
   pageTitleKey: string = 'SETTINGS_TITLE';
   pageTitle: string = '';
 
   account: {
     email: string,
     firstname: string,
     lastname: string,
     phone: number,
     adress: string,
     city: string,
     birthday: string|null,
     zipcode: string,
   } = {
     email: '',
     firstname: '',
     lastname: '',
     phone: 0,
     adress: '',
     birthday: null,
     city: '',
     zipcode: '',
   };
   birthday: string = new Date().toISOString();
 
   subSettings: any = SettingsPage;
   pushid: any;
 
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public items: Items,
    public formBuilder: FormBuilder,
    public api: Api,
    public menu: MenuController,
    public modalCtrl: ModalController,
    public user: User,
    public loadingCtrl: LoadingController,
    private route: ActivatedRoute,
    private router: Router,
    private translateConfigService: TranslateConfigService,
    private translate: TranslateService,
    public storage: Storage,
    public StorageService: StorageService,
    public actionSheetController: ActionSheetController) {
      this.translateConfigService.getDefaultLanguage();
      this.lang = this.translateConfigService.getCurrentLang();
      if (this.lang === 'fr') {
        this.language = 'Français';
      } else {
        this.language = 'English';
      }
      
      this.page = 'main';
      this.storage.get('pushid')
      .then((pushid) => {
        if (pushid) {
          this.pushid = pushid;
        } else {
          this.pushid = 'undefined';
        }
      });
      this._buildForm();
      let seq = this.api.get('api/infouser').pipe(share());
        seq.subscribe((res: any) => {
          this.account = res;
        }, err => {
        });

   }

  ngOnInit() {
    this.form = this.formBuilder.group({});
  }

  _buildForm() {
    let group: any = {
      language: ['fr']
    };

    switch (this.page) {
      case 'main':
        break;
      case 'profile':
        group = {
          option4: ['']
        };
        break;
    }
    this.form = this.formBuilder.group(group);

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v: any) => {

      //this.settings.merge(this.form.value);
      console.log(this.form.value);
      console.log(this.pushid);
      //return this.updateLang(this.form.value);
    });
  }

 /**
   * Capture the selected language from the  component
   *
   * @public
   * @method changeLanguage
   * @return {none}
   */
 public changeLanguage() : void
 {
  console.log('changed language');
    let langtmp:string = '';
    if (this.lang !== null) {
      langtmp = this.lang;
    }
    console.log(langtmp);
    this.translateConfigService.setLanguage(langtmp);
    this.storage.set('language', this.lang);
 }

 async showLoading() {
  const loading = await this.loadingCtrl.create({
    spinner: 'lines'
  });
  await loading.present();
}

 updateProfile() {

    this.showLoading();
    let seq = this.api.post('api/updateprofile', this.account).pipe(share());

    seq.subscribe((res: any) => {
    this.loadingCtrl.dismiss();
    this.page = 'main';
    }, (err: any) => {
    this.loadingCtrl.dismiss();
    });
 }

displaypage(page: string) {
  this.page = page;
}

backtosettings() {
  this.page = 'main';
}

updatePassword() {

  this.showLoading();
  let seq = this.api.post('api/updatepwd', {password: this.password}).pipe(share());

  seq.subscribe((res: any) => {
    this.loadingCtrl.dismiss();
    this.page = 'main';
  }, (err: any) => {
    this.loadingCtrl.dismiss();
  });
}
}