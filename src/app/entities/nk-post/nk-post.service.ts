import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPost, IPostDTO, ITrending } from 'app/entities/models/nk-post.model';
import { IPage } from 'app/shared/pagination/pagination.model';
import { IFile } from '../models/nk-file.model';

export type EntityResponseType = HttpResponse<IPostDTO>;
export type EntityArrayResponseType = HttpResponse<IPostDTO[]>;

@Injectable({ providedIn: 'root' })
export class PostService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);
  protected resourceUrl = this.applicationConfigService.getEndpointFor('core/posts');
  protected publicResourceUrl = this.applicationConfigService.getEndpointFor('core/r/posts');

  /**
   * Creates a new post with the given data, including handling file attachments for medias and covers.
   * @param post contains the main data of the post to be created.
   * @param medias is an array of media files to be attached to the post.
   * @param covers is an array of cover files to be attached to the post.
   */
  create(post: IPost, medias: IFile[], covers: IFile[]): Observable<EntityResponseType> {
    const data: FormData = new FormData();
    post.files = [];
    data.append('post', new Blob([JSON.stringify(post)], { type: 'application/json' }));

    medias.forEach((m) => {
      data.append('_medias', m.data);
    });

    const emptyFile = new File([''], 'empty', { type: 'application/octet-stream' });
    covers.forEach((c) => {
      data.append('_covers', c?.data ?? emptyFile);
    });

    return this.http.post<IPostDTO>(this.resourceUrl, data, {
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
    return this.http.put<IPostDTO>(this.resourceUrl, data, {
      observe: 'response',
    });
  }

  partialUpdate(post: IPost): Observable<EntityResponseType> {
    return this.http.patch<IPostDTO>(`${this.resourceUrl}/${post.id}`, post, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPostDTO>(`${this.publicResourceUrl}/${id}`, {
      observe: 'response',
    });
  }

  findByChannel(id: number, req?: any): Observable<HttpResponse<IPage<IPostDTO>>> {
    const options = createRequestOption(req);
    return this.http.get<IPage<IPostDTO>>(`${this.publicResourceUrl}/channel/${id}`, {
      params: options,
      observe: 'response',
    });
  }

  findByAuthenticatedUser(req?: any): Observable<HttpResponse<IPage<IPostDTO>>> {
    const options = createRequestOption(req);
    return this.http.get<IPage<IPostDTO>>(`${this.resourceUrl}/me`, {
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

  // query(req?: any): Observable<HttpResponse<IPage<IPost>>> {
  //   const options = createRequestOption(req);
  //   return this.http.get<IPage<IPost>>(this.publicResourceUrl, {
  //     params: options,
  //     observe: 'response',
  //   });
  // }

  feeds(req?: any): Observable<HttpResponse<IPage<IPost>>> {
    const options = createRequestOption(req);
    return this.http.get<IPage<IPost>>(`${this.publicResourceUrl}/feeds`, {
      params: options,
      observe: 'response',
    });
  }

  trending(): Observable<HttpResponse<ITrending>> {
    return this.http.get<ITrending>(`${this.publicResourceUrl}/trending`, {
      observe: 'response',
    });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, {
      observe: 'response',
    });
  }
}
