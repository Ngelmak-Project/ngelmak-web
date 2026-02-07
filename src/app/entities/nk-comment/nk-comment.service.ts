import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IComment, ICommentDTO } from 'app/entities/models/nk-comment.model';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPage } from 'app/shared/pagination/pagination.model';

@Injectable({ providedIn: 'root' })
export class CommentService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('core/comments');
  protected publicResourceUrl = this.applicationConfigService.getEndpointFor('core/r/comments');

  create(comment: IComment, file): Observable<HttpResponse<ICommentDTO>> {
    const data: FormData = new FormData();
    if (file) {
      data.append('file', file);
    }
    data.append('comment', new Blob([JSON.stringify(comment)], { type: 'application/json' }));
    return this.http.post<ICommentDTO>(this.resourceUrl, data, {
      observe: 'response',
    });
  }

  update(comment: IComment, file): Observable<HttpResponse<ICommentDTO>> {
    const data: FormData = new FormData();
    if (file) {
      data.append('file', file);
    }
    data.append('comment', new Blob([JSON.stringify(comment)], { type: 'application/json' }));
    return this.http.put<ICommentDTO>(this.resourceUrl, data, {
      observe: 'response',
    });
  }

  find(id: number): Observable<HttpResponse<IComment>> {
    return this.http.get<IComment>(`${this.resourceUrl}/${id}`, {
      observe: 'response',
    });
  }

  findByAccount(id: number, req?: any): Observable<HttpResponse<IPage<ICommentDTO>>> {
    const options = createRequestOption(req);
    return this.http.get<IPage<ICommentDTO>>(`${this.publicResourceUrl}/account/${id}`, {
      params: options,
      observe: 'response',
    });
  }

  findByPost(id: number, req?: any): Observable<HttpResponse<IPage<ICommentDTO>>> {
    const options = createRequestOption(req);
    return this.http.get<IPage<ICommentDTO>>(`${this.publicResourceUrl}/post/${id}`, {
      params: options,
      observe: 'response',
    });
  }

  findRepliesByComment(id: number): Observable<HttpResponse<ICommentDTO[]>> {
    return this.http.get<ICommentDTO[]>(`${this.publicResourceUrl}/reply/${id}`, {
      observe: 'response',
    });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, {
      observe: 'response',
    });
  }
}
