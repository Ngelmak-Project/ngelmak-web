import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { IPost } from 'app/entities/models/nk-post.model';
import { PostService } from 'app/entities/nk-post/nk-post.service';
import { SortService, sortStateSignal } from 'app/shared/sort';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-table',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './nk-post-table.component.html',
  styleUrl: './nk-post-table.component.scss'
})
export class PostTableComponent implements OnInit {
  private postService = inject(PostService);
  private sortService = inject(SortService);

  // dataSource: MatTableDataSource<IPost> = new MatTableDataSource<IPost>();
  visibleColumns = [ 'at', 'status', 'keywords', 'title', 'subject', 'visibility', 'actions'];

  subscription: Subscription | null = null;
  posts?: IPost[];
  post?: IPost;
  isLoading = false;

  sortState = sortStateSignal({});
  itemsPerPage = ITEMS_PER_PAGE;
  totalItems = 0;
  page = 1;

  ngOnInit(): void {
    const { page } = this;

    this.isLoading = true;
    const pageToLoad: number = page;
    const queryObject: any = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      // sort: this.sortService.buildSortParam(this.sortState()),
    };

    // this.postService.query(queryObject).subscribe({
    //   next: (res: EntityArrayResponseType) => {
    //     this.posts = res.body;
    //     this.dataSource.data = this.posts;
    //   },
    //   complete:() =>  (this.isLoading = false),
    // });
  }

}
