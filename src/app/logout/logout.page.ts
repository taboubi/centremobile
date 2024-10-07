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
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(
    public storage: Storage,
    public StorageService: StorageService,
    private router: Router,
    private user: User
  ) { }


  ngOnInit() {
    this.user.logout();
    this.storage.set('token', null);
    this.router.navigate(['/login']);
  }

}
