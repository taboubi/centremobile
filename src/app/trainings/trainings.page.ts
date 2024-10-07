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
  selector: 'app-trainings',
  templateUrl: './trainings.page.html',
  styleUrls: ['./trainings.page.scss'],
})
export class TrainingsPage implements OnInit {
  currentItems: Item[] = [];
  loaded: boolean = false;
  emptytrainings: boolean = false;

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
      
  }

  ngOnInit() {
      const seq = this.api.post('checktoken', []).pipe(share());
      seq.subscribe((res: any) => {
        // If the API returned a successful response, mark the user as logged in
        if (res.error !== true) {
          this.loadItems();
          return true;
        } else {
          this.navCtrl.navigateForward('login');
          return true;
        } 
      }, (err: any) => {
        this.navCtrl.navigateForward('login');
      });
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      spinner: 'lines'
    });
    await loading.present();
  }


  loadItems() {
    this.showLoading();
    let seq = this.items.querytraining().pipe(share());
    seq.subscribe((res: any) => {
      this.currentItems = res;
      if (res.length == 0) {
        this.emptytrainings = true;
      }
    }, (err: any) => {

    }, () => { this.loadingCtrl.dismiss(); });
  }

  subscribe(itemid: any) {
    var data = {'trainingid' : itemid};
    let seq = this.api.post('api/subscribetraining', data).pipe(share());
    seq.subscribe((res: any) => {
      this.loadItems();
    }, (err: any) => {
      console.error('ERROR', err);
    });
  }

}
