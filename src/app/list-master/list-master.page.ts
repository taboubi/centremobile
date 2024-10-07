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
  selector: 'app-list-master',
  templateUrl: './list-master.page.html',
  styleUrls: ['./list-master.page.scss'],
})
export class ListMasterPage implements OnInit {
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
      this.home = true;
      this.route.queryParams.subscribe(params  => {
        let typed = params['type'];
        console.log(typed);
        if (typed) {
          this.home = false;
          this.type = typed;
          console.log(this.home);
          if (this.type == 1) {
            this.loadCategories();
          }
          this.loadItems();
        } else {
          this.home = true;
          console.log(this.home);
          this.loadInterests();
          
        }
      })
      
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
  backtointerests() {
    this.home = true;
    this.router.navigate(['/list-master']);
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Item) {
    this.router.navigate(['/item-detail'], {queryParams: {itemid:  item['id']}});
  }

  /**
   * Navigate to the detail page for this item.
   */
  openType(type: any) {
    this.router.navigate(['/list-master'], {queryParams: {type:  type}});
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      spinner: 'lines'
    });
    await loading.present();
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

  loadInterests() {
    console.log(this.home);
    this.showLoading();
    let seq = this.items.queryinterests().pipe(share());

    seq.subscribe((res: any) => {
      this.regular = res.regular;
      this.special = res.special;
      this.senior = res.senior;
    }, (err: any) => {
      this.loadingCtrl.dismiss();
    }, () => {this.loadingCtrl.dismiss();});
  }

  loadCategories() {
    const seq = this.items.querycategories().pipe(share());

    seq.subscribe((res: any) => {
      this.categories = res;
      console.log(this.categories);
      if (res.length > 0) {
        this.hascategories = true;
        console.log('here has categorie : ' + this.hascategories);
      }
    }, (err: any) => {
    }, () => {});
  }

  isItemShown(id: any) {
    if (this.itemsshown.indexOf(id) !== -1) {
      return true;
    }
    return false;
  }
  toggleItem(id: any) {
    var position = this.itemsshown.indexOf(id);
    if (position !== -1) {
      this.itemsshown.splice(position, 1);
    } else {
      this.itemsshown.push(id);
    }
  }

  changeCategory() {
    this.loadItems();
  }

}
