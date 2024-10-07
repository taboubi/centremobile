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
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../../app/storage.service';
import { Storage } from '@ionic/storage';
import { from, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {

  url = 'https://admin.centrebenevoleabc.org';
  // url: string = 'http://localhost/cabc/public/index.php';
  oauth: Record<string, unknown> = {
    grant_type: 'password',
    client_id: '1_3bcbxd9e24g0gk5plj0kwgcwg4o8k8g4g123kwc44gcc0gwwk4',
    client_secret: '4ok2x70rlhlnj8g0wws8c8kwcokw80l56lg48goc0ok4w0so0k',
  };

  constructor(public http: HttpClient, private storage: Storage, public StorageService: StorageService) {
  }

  get(endpoint: string, params?: any, reqOpts?: any): Observable<any> {
      if (!reqOpts) {
          reqOpts = {
              params: new HttpParams(),
          };
      }

      // Support easy query params for GET requests
      if (params) {
          reqOpts.params = new HttpParams();
          for (const k in params) {
              reqOpts.params = reqOpts.params.set(k, params[k]);
          }
      }

      return from(this.storage.get('token')).pipe(mergeMap( token => {
          if( token) {
              reqOpts.headers = {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'Authorization': 'Bearer ' + token,
              };
          }

          // make request
          return this.http.get(this.url + '/' + endpoint, reqOpts);
      }));
      // return this.http.get(this.url + '/' + endpoint, reqOpts);
  }

  post(endpoint: string, body: any, reqOpts?: any): any {

      return from(this.storage.get('token')).pipe(mergeMap( token => {
          if (endpoint == 'oauth/v2/token' || endpoint == 'updatepassword'
          || endpoint == 'forgottenpassword' || endpoint == 'subscribe') {
              token = null;
          }
          if( token) {
              if (endpoint != 'checktoken') {
                  if (!reqOpts) {
                      reqOpts = {
                          params: new HttpParams(),
                      };
                  }
                  reqOpts.headers = {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json',
                      'Authorization': 'Bearer ' + token,
                  };
              } else {
                  return this.http.post(this.url + '/' + endpoint,  { token : token }, reqOpts);
              }

          }

          // make request
          return this.http.post(this.url + '/' + endpoint, Object.assign(body, this.oauth), reqOpts);
      }));

  }

  put(endpoint: string, body: any, reqOpts?: any): Observable<any> {
      return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any): Observable<any> {
      return this.http.delete(this.url + '/' + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any): Observable<any> {
      return this.http.patch(this.url + '/' + endpoint, body, reqOpts);
  }

}
