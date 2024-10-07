import { Component } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import {Capacitor} from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { StorageService } from 'src/app/storage.service';
import { Storage } from '@ionic/storage';
import { StatusBar, Style } from '@capacitor/status-bar';
import {  Router, ActivatedRoute } from '@angular/router';
import { FcmService } from './services/fcm.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'EVENTS', icon: 'calendar', url: '/list-master'  },
    { title: 'MYEVENTS', icon: 'bookmark', url: '/myevents'  },
    { title: 'TRAININGS', icon: 'school', url: '/trainings'  },
    { title: 'REFERENCELETTER', icon: 'mail', url: '/referenceletter' },
    { title: 'SETTINGS_TITLE', icon: 'settings', url: '/settings'},
    { title: 'CONTACT', icon: 'information-circle', url: '/contact'},
    { title: 'LOGOUT', icon: 'exit', url: '/logout' },
  ];
  constructor(
    public storage: Storage,
    public StorageService: StorageService,
    private route: ActivatedRoute,
    private router: Router,
    private fcmService: FcmService) {
      if (Capacitor.platform !== 'web') {
        StatusBar.setBackgroundColor({color: "#A40046"});
        this.fcmService.initPush();
      }
  }
}
