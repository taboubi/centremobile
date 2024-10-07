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
import { Device } from '@capacitor/device';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  account: {
    email: string,
    username: string,
    password: string,
    firstname: string,
    lastname: string,
    phone: number|null,
    birthday: Date|null,
    adress: string,
    city: string,
    zipcode: string,
    is_regular: boolean,
    is_special_event: boolean,
    is_senior_service: boolean
  } = {
    email: '',
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    phone: null,
    birthday: null,
    adress: '',
    city: '',
    zipcode: '',
    is_regular: false,
    is_special_event: false,
    is_senior_service: false
  };

  public isEmailValid: boolean = true;
  public alreadyvalidated: boolean = false;
  public isUsernameValid: boolean = true;
  public isPasswordValid: boolean = true;
  public isCityValid: boolean = true;
  private isZipcodeValid: boolean = true;
  public isFirstnameValid: boolean = true;
  public isLastnameValid: boolean = true;
  public isPhoneValid: boolean = true;
  public isAdressValid: boolean = true;
  public isBirthdayValid: boolean = true;
  public errorEmailexist: string = '';
  public errorUsernameexist: string= '';
  public errorEmail: string = '';
  public errorUsername: string = '';
  public emailFormatError: string = '';
  public mandatory: string = '';
  public regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/;
  public lang: string|null = '';
  public pushid: any;
  public signupErrorString: string = '';
  public info: any = '';
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
    public actionSheetController: ActionSheetController
  ) {
    this.translateConfigService.getDefaultLanguage();
    this.lang = this.translateConfigService.getCurrentLang();
    console.log(this.lang );
    this.translate.get(['SIGNUP_ERROR', 'REQUIRED_FIELD', 'INVALIDEMAIL', 'EMAILEXIST', 'USERNAMEEXIST']).subscribe((res) => {
      this.signupErrorString = res.SIGNUP_ERROR;
      this.mandatory = res.REQUIRED_FIELD;
      this.emailFormatError = res.INVALIDEMAIL;
      this.errorEmailexist = res.EMAILEXIST;
      this.errorUsernameexist = res.USERNAMEEXIST;
    })
   }
   backtologin() {
    this.router.navigate(['login']);
  }
  async ngOnInit() {
    this.info = await Device.getInfo();
  }
  async showLoading() {
    const loading = await this.loadingCtrl.create({
      spinner: 'lines'
    });
    await loading.present();
  }

  doSignup() {
    // Attempt to login in through our User service
    var valid = this.validate();
    if (valid) {
      var data: any = this.account;
      data.lang = this.lang;
      data.platform = this.info.platform;
      this.showLoading();
      this.storage.get('pushid')
      .then((pushid) => {
        if( pushid !==null) {
          data.pushid = pushid;
          }
          let seq = this.api.post('subscribe', data).pipe(share());
          seq.subscribe((res: any) => {
            if (res.error == true) {
              if (res.message == 'emailexist') {
                this.errorEmail = this.errorEmailexist;
                this.isEmailValid = false;
              }
              if (res.message == 'usernameexist') {
                this.errorUsername = this.errorUsernameexist;
                this.isUsernameValid = false;
              }
            } else {
              this.router.navigate(['login'], {queryParams: {signup:  true}});
            }
          }, (err: any) => {
            this.loadingCtrl.dismiss();
          }, () => { this.loadingCtrl.dismiss(); });
        
      })
      
    }
    
  }

  async presentAlert(messagesuccess: string) {
    const confirmAlert = await this.alertCtrl.create({
      header: '',
      subHeader: '',
      message: messagesuccess,
      buttons: [{
        text: this.translate.instant('CLOSE'),
        role: 'cancel'
      }]
    });
    await confirmAlert.present();
  }

  validate():boolean {
    this.isEmailValid = true;
    this.isLastnameValid = true;
    this.isFirstnameValid = true;
    this.isUsernameValid = true;
    this.isPasswordValid = true;
    this.isCityValid = true;
    this.isAdressValid = true;
    this.isZipcodeValid = true;
    this.isPhoneValid = true;
    this.isBirthdayValid = true;
    this.errorEmail = this.mandatory;
    this.errorUsername = this.mandatory;
    this.alreadyvalidated = true;

    if (!this.account.username || this.account.username.length == 0) {
        this.isUsernameValid = false;
    }
    if (!this.account.email || this.account.email.length == 0) {
      this.isEmailValid = false;
    }
    if (!this.account.firstname || this.account.firstname.length == 0) {
      this.isFirstnameValid = false;
    }
    if (!this.account.lastname || this.account.lastname.length == 0) {
      this.isLastnameValid = false;
    }

    if (!this.account.password || this.account.password.length == 0) {
        this.isPasswordValid = false;
    }

    if (!this.account.city || this.account.city.length == 0) {
        this.isCityValid = false;
    }

    if (!this.account.zipcode || this.account.zipcode.length == 0) {
        this.isZipcodeValid = false;
    }
    if (!this.account.adress || this.account.adress.length == 0) {
      this.isAdressValid = false;
    }
    if (!this.account.phone || this.account.phone.toString().length == 0) {
      this.isPhoneValid = false;
    }

    if (!this.account.birthday) {
      this.isBirthdayValid = false;
    }

    if (!this.account.email || this.account.email.length == 0) {
      this.isEmailValid = false;
    } else if (this.regex.test(this.account.email) == false) {
      this.isEmailValid = false;
      this.errorEmail = this.emailFormatError;
    }
    var validservice = true;
    if (!this.account.is_regular && !this.account.is_senior_service && !this.account.is_special_event) {
      validservice = false;
      this.presentAlert(this.translate.instant('WARNINGSERVICE'));
    }

    return this.isEmailValid &&
        this.isPasswordValid &&
        this.isUsernameValid &&
        this.isCityValid &&
        this.isZipcodeValid &&
        this.isAdressValid &&
        this.isFirstnameValid &&
        this.isLastnameValid &&
        this.isBirthdayValid &&
        this.isPhoneValid &&
        validservice;
  }

}
