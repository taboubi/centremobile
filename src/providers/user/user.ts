// (C) Copyright 2015 Moodle Pty Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import { Storage } from '@ionic/storage';

import { Injectable } from '@angular/core';
import { share } from 'rxjs';

import { Api } from '../api/api';
import { Device } from '@capacitor/device';

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }Ø
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class User {

  user: any;
  info: any;
  identifier: any;

  constructor(public api: Api, private storage: Storage) {

  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any): any {
      //this.storage.set('token', null);
      this.getDeviceInfo();
      const seq = this.api.post('oauth/v2/token', accountInfo).pipe(share());

      seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
          if (res.access_token !== '' && res.enabled == true) {
              this.storage.set('token', res.access_token);
              this.registerdevice();
              this._loggedIn(res);
          }
      }, (err: any) => {
          // eslint-disable-next-line no-console
          console.error('ERROR', err);
      });

      return seq;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any): any {
      const seq = this.api.post('signup', accountInfo).pipe(share());

      seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
          if (res.status == 'success') {

            this._loggedIn(res);
          }
      }, (err: any) => {
          // eslint-disable-next-line no-console
          console.error('ERROR', err);
      });

      return seq;
  }

  /**
   * Log the user out, which forgets the session
   */
  logout(): void {
      this.user = false;
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp: any): void {
      this.user = resp;
  }

  /**
   * Is logged In
   */
  isLoggedIn(): any {
      const seq = this.api.post('checktoken', []).pipe(share());
      seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
          if (res.error !== true) {
              return true;
          } else {
              return false;
          }
      });
  }
  async getDeviceInfo() {
    this.info =  await Device.getInfo();
    this.identifier = (await Device.getId()).identifier;

  } 

   registerdevice(): Promise<any> {
      return  this.storage.get('pushid')
          .then((pushid) => {
            if( pushid !==null) {
              const data = {
                  name:       this.info.manufacturer || '',
                  model:      this.info.model,
                  platform:   this.info.platform,
                  pushid:     pushid,
                  uuid:       this.identifier,
              };
              const seq = this.api.post('api/device', data).pipe(share());

              seq.subscribe((res: any) => {
                  // If the API returned a successful response, mark the user as logged in
                  if (res.status == 'success') {

                      this._loggedIn(res);
                  }
              }, (err: any) => {
                  // eslint-disable-next-line no-console
                  console.error('ERROR', err);
              });

              return seq;
            }
          });
  }

}
