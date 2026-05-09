import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IPostDTO } from 'app/entities/models/nk-post.model';
import SharedModule from 'app/shared/shared.module';
import { PostCardComponent } from '../card/nk-post-card.component';

@Component({
  standalone: true,
  selector: 'app-post-detail',
  templateUrl: './nk-post-detail.component.html',
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    PostCardComponent,
  ],
})
export class PostDetailComponent {
  post = input.required<IPostDTO>(); // The post to display
}
