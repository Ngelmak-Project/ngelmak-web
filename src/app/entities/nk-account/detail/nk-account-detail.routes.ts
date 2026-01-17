import { Routes } from "@angular/router";
import { PostsComponent } from "./posts/posts.component";
import SettingsComponent from "./settings/settings.component";

const accountDetailRoute: Routes = [
  {
    path: "",
    component: SettingsComponent,
  },
  {
    path: "posts",
    component: PostsComponent,
  },
];

export default accountDetailRoute;
