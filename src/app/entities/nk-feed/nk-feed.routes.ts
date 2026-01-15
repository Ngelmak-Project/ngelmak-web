import { Routes } from '@angular/router';

import { DESC } from 'app/config/navigation.constants';
import { FeedComponent } from './list/nk-feed.component';

const postRoute: Routes = [
  {
    path: '',
    component: FeedComponent,
    data: {
      defaultSort: 'at,' + DESC,
    },
  },
];

export default postRoute;
