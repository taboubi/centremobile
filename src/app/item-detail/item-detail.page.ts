import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, LoadingController, MenuController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from 'src/app/translate-config.service';
import { Item } from '../../models/item';
import { Items } from '../../providers';
import { User } from '../../providers';
import { Api } from '../../providers';
import { share } from 'rxjs';
import {  Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.page.html',
  styleUrls: ['./item-detail.page.scss'],
})
export class ItemDetailPage implements OnInit {

  item: any;
  periods: any;
  periodsids: any;
  cansubscribe: any;
  disabledtg: any;
  disabledbtn: any;
  classloading: boolean = false;
  showmonths: boolean = false;
  nb_hours: number = 0;
  parentPage: any = null;
  source: string = '';

  constructor(public navCtrl: NavController,
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
    private translate: TranslateService) { 
      this.translateConfigService.getDefaultLanguage();
      const lang = this.translateConfigService.getCurrentLang();
      this.item = null;
      this.periods = [];
      this.periodsids = [];
      this.cansubscribe = false;
      this.disabledtg = false;
      this.disabledbtn = false;
      this.classloading = false;
      this.nb_hours = 0;
    }

  ngOnInit() {
    console.log("nb on ini");
    const seq = this.api.post('checktoken', []).pipe(share());
    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.error !== true) {
        this.route.queryParams.subscribe(params  => {
          let itemid = params['itemid'];
          this.source = params['source'];
          if (itemid) {
            console.log("here log items");
            this.loadItem(itemid);
          }
        })
        return true;
      } else {
        this.navCtrl.navigateForward('login');
        return true;
      } 
    }, (err: any) => {
      this.navCtrl.navigateForward('login');
    });
  }

  loadPeriods() {
    let datessubscription = this.item.dates_subscriptions;

    datessubscription.forEach((value: any) => {
      this.periodsids.push(value.id_period);
    });

    this.item.dates.forEach((value: any) => {
      if (this.item.dates_subscriptions.length == 0) {
        value.subscribed = false;
      } else {
        if (this.periodsids.indexOf(value.id_period) !== -1) {
          value.subscribed = true;
          value.disabled = false;
         } else {
          value.subscribed = false;
         }
      }
      value.disabledtoggle = '';
      if (this.item.can_modify === false) {
         value.disabledtoggle = 'disabled';
      }
      
      
      this.periods.push(value);
    });
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      message: this.translate.instant('WARNINGPERIOD'),
      buttons: [{
        text: this.translate.instant('CLOSE'),
        role: 'cancel'
      }],
    });

    await alert.present();
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      spinner: 'lines'
    });
    await loading.present();
  }

  loadItem(itemid: any) {
    this.showLoading();
    let seq = this.items.querydetail({id: itemid}).pipe(share());
    seq.subscribe((res: any) => {
      this.item = res;
      this.cansubscribe = this.item.can_subscribe || this.item.can_modify;
      this.disabledtg = !this.item.can_modify;
      this.disabledbtn = this.disabledtg;
      if (this.item.nb_hours) {
        this.nb_hours = this.item.nb_hours;
      }
      this.loadPeriods();
    }, err => {
    }, () => { this.loadingCtrl.dismiss(); });
  }

  togglePeriod(periodid: any) {
    let position = this.periodsids.indexOf(periodid);
    if (position == -1) {
      this.periodsids.push(periodid);
     } else {
      this.periodsids.splice(position, 1);
     }
  }
  backtoevents() {
    console.log(this.source);
    if (this.source === 'myevents') {
      this.router.navigate(['/myevents']);
    } else {
      this.router.navigate(['/list-master'], {queryParams: {type:  this.item.typeid}});
    }
  }

  sendSubscription() {
    var data = {'eventid' : this.item.id, 'periods' : this.periodsids};
    if (this.periodsids.length == 0) {
      this.presentAlert();
      return;
    }
    
    this.showLoading();
    let seq = this.api.post('api/subscribeevent', data).pipe(share());
    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (this.parentPage) {
        this.parentPage.loadItems();
      }
      this.navCtrl.pop();
    }, (err: any) => {
      console.error('ERROR', err);
    }, () => { this.loadingCtrl.dismiss(); });
  }

  isDisabled(): boolean {
    return this.item.can_modify === false;
  }
  showMonths(): void {
    this.showmonths = true;
  }

  sendHours() {
    if (this.nb_hours) {
      var data = {'eventid' : this.item.id, 'nb_hours' : this.nb_hours};
    
      this.showLoading();
      let seq = this.api.post('api/nbhours', data).pipe(share());
      seq.subscribe((res: any) => {
        // If the API returned a successful response, mark the user as logged in
        if (this.parentPage) {
          this.parentPage.loadItems();
        }
        this.navCtrl.pop();
      }, (err: any) => {
        console.error('ERROR', err);
      }, () => { this.loadingCtrl.dismiss(); });
      }
  }
  savehourspermonth() {
    var total = 0;
    this.item.months.forEach((value: any) => {
      var nb = null;
      if (typeof value.nb === 'string' || value.nb instanceof String) {
        nb = value.nb.replace(",", ".");
      } else {
        nb = value.nb;
      }
      nb = parseFloat(nb);
      total += nb;
    });
    this.item.nb_hours = total;
    var data = {'eventid' : this.item.id, 'months' : this.item.months};
    
    this.showLoading();
    let seq = this.api.post('api/nbhoursmonth', data).pipe(share());
    seq.subscribe((res: any) => {

    }, (err: any) => {
      console.error('ERROR', err);
    }, () => { this.loadingCtrl.dismiss(); });
    this.showmonths = false;
  }

  cancel() {
    this.showmonths = false;
  }

}
