import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from 'app/core/config/api-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IComment, ICommentDTO } from 'app/entities/models/nk-comment.model';
import { IPage } from 'app/shared/pagination/pagination.model';
import { Observable } from 'rxjs';
import { IFile } from '../models/nk-file.model';

@Injectable({ providedIn: 'root' })
export class CommentService {
  protected http = inject(HttpClient);
  protected resourceUrl = inject(ApiConfigService).buildApiUrl('core', 'comments');

  create(comment: IComment, media): Observable<HttpResponse<ICommentDTO>> {
    const data: FormData = new FormData();
    data.append('comment', new Blob([JSON.stringify(comment)], { type: 'application/json' }));

    if (media) {
      data.append('media', media);
    }

    return this.http.post<ICommentDTO>(this.resourceUrl, data, {
      observe: 'response',
    });
  }

  update(comment: IComment, deletedFile: IFile, media): Observable<HttpResponse<ICommentDTO>> {
    const data: FormData = new FormData();
    data.append('comment', new Blob([JSON.stringify(comment)], { type: 'application/json' }));

    if (deletedFile) {
      data.append(
        'deletedFile',
        new Blob([JSON.stringify(deletedFile)], { type: 'application/json' }),
      );
    }

    if (media) {
      data.append('media', media);
    }

    return this.http.put<ICommentDTO>(this.resourceUrl, data, {
      observe: 'response',
    });
  }

  find(id: number): Observable<HttpResponse<IComment>> {
    return this.http.get<IComment>(`${this.resourceUrl}/${id}`, {
      observe: 'response',
    });
  }

  findByChannel(id: number, req?: any): Observable<HttpResponse<IPage<ICommentDTO>>> {
    const options = createRequestOption(req);
    return this.http.get<IPage<ICommentDTO>>(`${this.resourceUrl}/channel/${id}`, {
      params: options,
      observe: 'response',
    });
  }

  findByPost(id: number, req?: any): Observable<HttpResponse<IPage<ICommentDTO>>> {
    const options = createRequestOption(req);
    return this.http.get<IPage<ICommentDTO>>(`${this.resourceUrl}/post/${id}`, {
      params: options,
      observe: 'response',
    });
  }

  /**
   * Retrieve replies for a given comment.
   *
   * The client may pass its locally stored replyCount (storedReplyCount).
   * The backend will compare this value with the actual number of replies
   * in the database. If they differ, the backend may trigger a background
   * repair action to correct the stored replyCount.
   *
   * @param id The ID of the comment whose replies should be fetched.
   * @param storedReplyCount The reply count currently known by the client.
   *                         If omitted, no consistency check is performed.
   *
   * @returns An HttpResponse containing the list of replies.
   */
  findRepliesByComment(
    id: number,
    storedReplyCount?: number,
  ): Observable<HttpResponse<ICommentDTO[]>> {
    return this.http.get<ICommentDTO[]>(`${this.resourceUrl}/reply/${id}`, {
      params: { storedReplyCount },
      observe: 'response',
    });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, {
      observe: 'response',
    });
  }
}
