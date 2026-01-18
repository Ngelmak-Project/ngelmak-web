import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPost } from 'app/entities/models/nk-post.model';
import { IPage } from 'app/shared/pagination/pagination.model';
import { IFile } from '../models/nk-file.model';

export type EntityResponseType = HttpResponse<IPost>;
export type EntityArrayResponseType = HttpResponse<IPost[]>;

@Injectable({ providedIn: 'root' })
export class PostService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('core/posts');

  protected publicResourceUrl = this.applicationConfigService.getEndpointFor('core/r/posts');

  create(post: IPost, medias: IFile[], covers: IFile[]): Observable<EntityResponseType> {
    const data: FormData = new FormData();
    post.files = [];
    data.append('post', new Blob([JSON.stringify(post)], { type: 'application/json' }));
    const mediaBlob = new Blob([JSON.stringify(medias.map((e) => e.data))], {
      type: 'application/json',
    });
    data.append('medias', mediaBlob);
    const coverBlob = new Blob([JSON.stringify(covers.map((e) => e.data))], {
      type: 'application/json',
    });
    data.append('covers', coverBlob);
    return this.http.post<IPost>(this.resourceUrl, data, {
      observe: 'response',
    });
  }

  update(
    post: IPost,
    deletedFiles: IFile[],
    medias: IFile[],
    covers: IFile[],
  ): Observable<EntityResponseType> {
    const data: FormData = new FormData();
    post.files = [];
    data.append('post', new Blob([JSON.stringify(post)], { type: 'application/json' }));
    data.append(
      'deletedFiles',
      new Blob([JSON.stringify(deletedFiles)], { type: 'application/json' }),
    );
    data.append(
      'medias',
      new Blob([JSON.stringify(medias.map((e) => e.data))], { type: 'application/json' }),
    );
    data.append(
      'covers',
      new Blob([JSON.stringify(covers.map((e) => e.data))], { type: 'application/json' }),
    );
    return this.http.put<IPost>(this.resourceUrl, data, {
      observe: 'response',
    });
  }

  partialUpdate(post: IPost): Observable<EntityResponseType> {
    return this.http.patch<IPost>(`${this.resourceUrl}/${post.id}`, post, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPost>(`${this.publicResourceUrl}/${id}`, {
      observe: 'response',
    });
  }

  findByAccount(id: number, req?: any): Observable<HttpResponse<IPage<IPost>>> {
    const options = createRequestOption(req);
    return this.http.get<IPage<IPost>>(`${this.resourceUrl}/me/${id}`, {
      params: options,
      observe: 'response',
    });
  }

  search(req?: any): Observable<HttpResponse<IPage<IPost>>> {
    const options = createRequestOption(req);
    return this.http.get<IPage<IPost>>(`${this.publicResourceUrl}/search`, {
      params: options,
      observe: 'response',
    });
  }

  query(req?: any): Observable<HttpResponse<IPage<IPost>>> {
    const options = createRequestOption(req);
    return this.http.get<IPage<IPost>>(this.publicResourceUrl, {
      params: options,
      observe: 'response',
    });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, {
      observe: 'response',
    });
  }
}
