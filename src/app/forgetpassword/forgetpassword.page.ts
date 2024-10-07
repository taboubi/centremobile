import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, LoadingController, MenuController, AlertController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from 'src/app/translate-config.service';
import { Item } from '../../models/item';
import { Items } from '../../providers';
import { User } from '../../providers';
import { Api } from '../../providers';
import { share } from 'rxjs';
import {  Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.page.html',
  styleUrls: ['./forgetpassword.page.scss'],
})
export class ForgetpasswordPage implements OnInit {

  semail: any = null;
  emailerror: any = null;
  passwordupdatedtitle: any = null;
  invalidcode: any = null;
  passwordtext: any = null;
  step: any = 1;
  code: any = null;
  newpassword: any = null;
  lang: any = null;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public items: Items,
    public api: Api,
    public menu: MenuController,
    public modalCtrl: ModalController,
    public user: User,
    public loadingCtrl: LoadingController,
    private route: ActivatedRoute,
    private router: Router,
    private translateConfigService: TranslateConfigService,
    private translate: TranslateService,
    public toastCtrl: ToastController,
  ) { 
    this.translateConfigService.getDefaultLanguage();
     this.translateConfigService.getCurrentLang();
     this.translate.get(['EMAILNOTFOUND', 'NEWPASSWORD', 'INVALIDCODE', 'PASSWORDTEXT']).subscribe((res) => {
      this.emailerror = res.EMAILNOTFOUND;
      this.passwordupdatedtitle = res.NEWPASSWORD;
      this.invalidcode = res.INVALIDCODE;
      this.passwordtext = res.PASSWORDTEXT;
    });
  }

  ngOnInit() {
  }
  backtologin() {
    this.router.navigate(['login']);
  }
  async showToast(texttoast: string) {
    let toast = await this.toastCtrl.create({
      message: texttoast,
      duration: 8000,
      position: 'middle',
      buttons: [{
        text: 'Ok',
        role: 'cancel',
      }],
      color: "primary"
    });
    await toast.present();
  }
  doCheckEmail() {
    console.log('do check email');
    let data = {email : this.semail, lang: this.lang};
    let seq = this.api.post('forgottenpassword', data).pipe(share());
    seq.subscribe((res: any) => {
      console.log(res);
      if (res.error == true) {
        this.showToast(this.emailerror);
      } else {
        this.step = 2;
      }
    }, (err: any) => {
      //this.navCtrl.push(MainPage);
      // Unable to log in
    }, () => { });
  }

  async presentAlert(messagesuccess: string) {
    const confirmAlert = await this.alertCtrl.create({
      header: '',
      subHeader: '',
      message: messagesuccess,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.router.navigate(['login']);
        }
      }]
    });
    await confirmAlert.present();
  }

  doUpdatePassword() {
    let data = {code : this.code, password : this.newpassword};
    let seq = this.api.post('updatepassword', data).pipe(share());
    seq.subscribe((res: any) => {
      
      if (res.error == true) {
        this.showToast(this.invalidcode);
      } else {
        this.presentAlert(this.passwordtext);
      }
    }, (err: any) => {
      //this.navCtrl.push(MainPage);
      // Unable to log in
    }, () => { });
  }

}
