import { Routes } from '@angular/router';
import { PostFeedComponent } from './nk-post-feed.component';
import { PostFeedContentComponent } from './post-feed-content/post-feed-content.component';
import { TrendingComponent } from './trending/trending.component';


const postFeedRoutes: Routes = [
  {
    path: '',
    component: PostFeedComponent,
    children: [
      { path: '',
        title: 'ngelmakTranslation.layouts.sidebar.pageTitle.feed',
        component: PostFeedContentComponent },
      { path: 'search',
        title: 'ngelmakTranslation.layouts.sidebar.pageTitle.search',
        component: PostFeedContentComponent },
      { path: 'week',
        title: 'ngelmakTranslation.layouts.sidebar.pageTitle.week',
        component: PostFeedContentComponent },
      { path: 'month',
        title: 'ngelmakTranslation.layouts.sidebar.pageTitle.month',
        component: PostFeedContentComponent },
      { path: 'trending',
        title: 'ngelmakTranslation.layouts.sidebar.pageTitle.trending',
        component: TrendingComponent },
    ],
  },
];
export default postFeedRoutes;

