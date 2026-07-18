import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from 'app/core/config/api-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFile } from 'app/entities/models/nk-file.model';
import { Observable } from 'rxjs';

export type EntityResponseType = HttpResponse<IFile>;
export type EntityArrayResponseType = HttpResponse<IFile[]>;

@Injectable({ providedIn: 'root' })
export class FileService {
  protected http = inject(HttpClient);
  protected resourceUrl = inject(ApiConfigService).buildApiUrl('api', 'files');

  create(file: IFile): Observable<EntityResponseType> {
    return this.http.post<IFile>(this.resourceUrl, file, { observe: 'response' });
  }

  update(file: IFile): Observable<EntityResponseType> {
    return this.http.put<IFile>(`${this.resourceUrl}/${file.id}`, file, {
      observe: 'response',
    });
  }

  partialUpdate(file: IFile): Observable<EntityResponseType> {
    return this.http.patch<IFile>(`${this.resourceUrl}/${file.id}`, file, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFile>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByPost(id: number): Observable<EntityArrayResponseType> {
    return this.http.get<IFile[]>(`${this.resourceUrl}/nk-post/${id}`, { observe: 'response' });
  }

  getResource(id: number): Observable<Blob> {
    return this.http.get(`${this.resourceUrl}/${id}/resource`, { responseType: 'blob' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFile[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

}
