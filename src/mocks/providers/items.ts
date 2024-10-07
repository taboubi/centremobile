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
import { Injectable } from '@angular/core';

import { Item } from '../../models/item';
import { Api } from '../../providers/api/api';
import { Observable } from 'rxjs';

@Injectable()
export class Items {

  items: Item[] = [];

  defaultItem: any = {
    name: 'Burt Bear',
    profilePic: 'assets/img/speakers/bear.jpg',
    about: 'Burt is a Bear.',
  };

  constructor(public api: Api) {
      const items = [
          {
              name: 'Burt Bear',
              profilePic: 'assets/img/speakers/bear.jpg',
              about: 'Burt is a Bear.',
          },
          {
              name: 'Charlie Cheetah',
              profilePic: 'assets/img/speakers/cheetah.jpg',
              about: 'Charlie is a Cheetah.',
          },
          {
              name: 'Donald Duck',
              profilePic: 'assets/img/speakers/duck.jpg',
              about: 'Donald is a Duck.',
          },
          {
              name: 'Eva Eagle',
              profilePic: 'assets/img/speakers/eagle.jpg',
              about: 'Eva is an Eagle.',
          },
          {
              name: 'Ellie Elephant',
              profilePic: 'assets/img/speakers/elephant.jpg',
              about: 'Ellie is an Elephant.',
          },
          {
              name: 'Molly Mouse',
              profilePic: 'assets/img/speakers/mouse.jpg',
              about: 'Molly is a Mouse.',
          },
          {
              name: 'Paul Puppy',
              profilePic: 'assets/img/speakers/puppy.jpg',
              about: 'Paul is a Puppy.',
          },
      ];

      for (const item of items) {
          this.items.push(new Item(item));
      }
  }

  query(params?: any): Observable<any> {
      const req = this.api.get('api/event', params);

      return req;
  }

  querymylist(params?: any): Observable<any> {
      const req = this.api.get('api/myevent', params);

      return req;
  }

  querydetail(params?: any): Observable<any> {
      const req = this.api.get('api/eventdetail', params);

      return req;
  }

  querytraining(params?: any): Observable<any> {
      const req = this.api.get('api/training', params);

      return req;
  }

  queryletter(params?: any): Observable<any> {
      const req = this.api.get('api/myrf', params);

      return req;
  }

  queryinterests(params?: any): Observable<any> {
      const req = this.api.get('api/interests', params);

      return req;
  }

  querycategories(params?: any): Observable<any> {
      const req = this.api.get('api/categories', params);

      return req;
  }

  add(item: Item): any {
      this.items.push(item);
  }

  delete(item: Item): any {
      this.items.splice(this.items.indexOf(item), 1);
  }

}
