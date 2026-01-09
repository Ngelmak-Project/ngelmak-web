import { Routes } from "@angular/router";
import { PostsComponent } from "./posts/posts.component";
import SettingsComponent from "./settings/settings.component";

const nkAccountDetailRoute: Routes = [
  {
    path: "",
    component: SettingsComponent,
  },
  {
    path: "posts",
    component: PostsComponent,
  },
];

export default nkAccountDetailRoute;
