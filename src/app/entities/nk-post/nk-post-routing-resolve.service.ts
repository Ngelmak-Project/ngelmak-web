import { HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { IPost } from 'app/entities/models/nk-post.model';
import { EMPTY, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { PostService } from './nk-post.service';

const postResolve: ResolveFn<IPost> = (route, state) => {
  const id = route.params['id'];
  if (id) {
    return inject(PostService)
      .find(id)
      .pipe(
        mergeMap((post: HttpResponse<IPost>) => {
          if (post.body) {
            return of(post.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default postResolve;
