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
  selector: 'app-myevents',
  templateUrl: './myevents.page.html',
  styleUrls: ['./myevents.page.scss'],
})
export class MyeventsPage implements OnInit {
  currentItems: Item[] = [];
  loaded: boolean = false;
  home: boolean = true;
  itemsshown: any;
  emptyevents: boolean = false;
  regular: boolean = false;
  special: boolean = false;
  senior: boolean = false;
  type: any = null;
  category: any = null;
  categories: any = [];
  hascategories: boolean = false;

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
      this.itemsshown = [];
      this.loadItems();
    }

  ngOnInit() {
    const seq = this.api.post('checktoken', []).pipe(share());
    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.error !== true) {
        return true;
      } else {
        this.navCtrl.navigateForward('login');
        return true;
      } 
    }, (err: any) => {
      this.navCtrl.navigateForward('login');
    });
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Item) {
    this.router.navigate(['/item-detail'], {queryParams: {itemid:  item['id'], source: 'myevents'}});
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      spinner: 'lines'
    });
    await loading.present();
  }

  toggleItem(id: any) {
    var position = this.itemsshown.indexOf(id);
    if (position !== -1) {
      this.itemsshown.splice(position, 1);
    } else {
      this.itemsshown.push(id);
    }
  }

  isItemShown(id: any) {
    if (this.itemsshown.indexOf(id) !== -1) {
      return true;
    }
    return false;
  }

  loadItems() {
    this.showLoading();
    let params:any = [];
    if (this.type) {
      params['type'] = this.type;
    }
    if (this.category) {
      params["category"] = this.category;
    }
    let seq = this.items.query(params).pipe(share());
    seq.subscribe((res: any) => {
      this.currentItems = res;
      if (res.length == 0) {
        this.emptyevents = true;
      }
    }, (err: any) => {

    }, () => { this.loadingCtrl.dismiss(); });
  }

}
