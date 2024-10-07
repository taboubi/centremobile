import { Component, Input, OnInit, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from 'src/app/translate-config.service';
import { NavController, ToastController, MenuController, LoadingController, NavParams, AlertController, ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { User } from '../../providers';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../storage.service';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page-new.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type


  public isUsernameValid: boolean = true;
  public isPasswordValid: boolean = true;
  public login!: string;
  private activatedRoute = inject(ActivatedRoute);

  account: { username: string, password: string } = {
    username: '',
    password: ''
  };

  // Our translated text strings
  public loginErrorString: string = '';
  public loginNotActive: string = '';
  public lang: string | null = '';
  public messagesuccess: string = '';

  ngOnInit() {
    this.login = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    private translateConfigService: TranslateConfigService,
    private translate: TranslateService,
    public menu: MenuController,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public StorageService: StorageService,
    public alertCtrl: AlertController,
    public actionSheetController: ActionSheetController,
    private router: Router,
    private route: ActivatedRoute,) {
      this.translateConfigService.getDefaultLanguage();
      this.lang = this.translateConfigService.getCurrentLang();
      this.translate.get(['LOGIN_ERROR', 'NOTACTIVE', 'ACCOUNTCREATED']).subscribe((value) => {
        this.loginErrorString = value.LOGIN_ERROR;
        this.loginNotActive = value.NOTACTIVE;
        this.messagesuccess = value.ACCOUNTCREATED;
        this.route.queryParams.subscribe(params  => {
          if (params['signup'] == 'true') {
            this.presentAlert(this.messagesuccess);
          }
        })
      });
     

  }

  async presentAlert(messagesuccess: string) {
    const confirmAlert = await this.alertCtrl.create({
      header: '',
      subHeader: '',
      message: messagesuccess,
      buttons: [{
        text: 'OK',
        role: 'cancel'
      }]
    });
    await confirmAlert.present();
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      spinner: 'lines'
    });
    await loading.present();
  }
  async showToast(loginNotActive: string) {
    let toast = await this.toastCtrl.create({
      message: loginNotActive,
      duration: 8000,
      position: 'bottom'
    });
    await toast.present();
  }
  

  // Attempt to login in through our User service
  async doLogin() {
    if (!this.validate()) {
      return;
    }
    this.showLoading();
    this.user.login(this.account).subscribe((resp: any) => {
      if (resp.enabled === true) {
        //this.navCtrl.setRoot(MainPage);
        this.menu.enable(true);
        this.router.navigate(['']);
      } else {
        this.showToast(this.loginNotActive);
      }
      
    }, () => {
      //this.navCtrl.push(MainPage);
      // Unable to log in
      this.loadingCtrl.dismiss();
      this.showToast(this.loginErrorString);
    }, () => { this.loadingCtrl.dismiss(); });
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }


  validate():boolean {
    this.isUsernameValid = true;
    this.isPasswordValid = true;

    if (!this.account.username ||this.account.username.length == 0) {
        this.isUsernameValid = false;
    }

    if (!this.account.password || this.account.password.length == 0) {
        this.isPasswordValid = false;
    }

    return this.isPasswordValid && this.isUsernameValid;
 }
 register() {
  this.router.navigate(['signup']);
 }

 forgotpassword() {
  this.router.navigate(['forgetpassword']);
 }

 /*changeLanguage(lang: string) {
  //this.settings.setValue('language', lang);
  //this.translateService.use(lang);
  //this.lang = lang;
}*/

async changeLanguage() {
  const actionSheet = await this.actionSheetController.create({
    header: 'Languages',
    buttons: [{
      text: 'English',
      handler: () => {
        this.lang = 'en';
        this.translateConfigService.setLanguage('en');
        this.StorageService.set('language', this.lang);
      }
    }, {
      text: 'Français',
      handler: () => {
        this.lang = 'fr';
        this.translateConfigService.setLanguage('fr');
        this.StorageService.set('language', this.lang);
      }
    }, {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    }]
  });
  await actionSheet.present();

  const { role, data } = await actionSheet.onDidDismiss();
  console.log('onDidDismiss resolved with role and data', role, data);
}

}
