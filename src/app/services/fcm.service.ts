import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/storage.service';
import { Storage } from '@ionic/storage';
import { PushNotifications } from '@capacitor/push-notifications';
import {Capacitor} from '@capacitor/core';
import { Device } from '@capacitor/device';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  info: any;
  constructor (
    private router: Router,
    public storage: Storage,
    public StorageService: StorageService) {}

  public initPush() {
    if (Capacitor.platform !== 'web') {
      this.registerPush();
    }
  }

  private registerPush() {
    PushNotifications.requestPermissions().then(permission => {
        if (permission.receive === 'granted') {
            PushNotifications.register();
        }
        else {
            // If permission is not granted
        }
    });
    PushNotifications.addListener('registration', (token) => {
      console.log("push id here" );
      console.log(token.value);
      this.storage.set('pushid', token.value);
    });
    PushNotifications.addListener('registrationError', (err)=> {
        console.log(err);
    }); 
    PushNotifications.addListener('pushNotificationReceived', (notifications) => {
        console.log(notifications);

    });
    PushNotifications.addListener('pushNotificationActionPerformed', notifications => {
        console.log("action performed");
        console.log(notifications);
        console.log(notifications.notification.data.page);
        console.log('here enter condition');
        if (notifications.notification.data && notifications.notification.data.page) {
          console.log('here enter condition');
          if (notifications.notification.data.page === "ItemDetailPage") {
            console.log('here enter ItemDetailPage');
            console.log("here id item " + notifications.notification.data.id);
            this.router.navigateByUrl('/item-detail?itemid=' + notifications.notification.data.id + '&source=notif');
          }
          if (notifications.notification.data.page === "TrainingsPage") {
            console.log('here enter training');
            this.router.navigateByUrl('/trainings');
          }
          if (notifications.notification.data.page === "ReferenceletterPage") {
            console.log('here enter reference');
            this.router.navigateByUrl('/referenceletter');
          }
        } else {
          this.router.navigateByUrl('/list-master');
        }
    });

  }
}
