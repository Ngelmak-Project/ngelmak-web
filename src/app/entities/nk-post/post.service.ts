import { HttpClient, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";


import { ApplicationConfigService } from "app/core/config/application-config.service";
import { createRequestOption } from "app/core/request/request-util";
import { IFile } from "app/entities/models/nk-file.model";
import { IPost } from "app/entities/models/nk-post.model";
import { IPage } from "app/shared/pagination/pagination.model";

export type EntityResponseType = HttpResponse<IPost>;
export type EntityArrayResponseType = HttpResponse<IPost[]>;

@Injectable({ providedIn: "root" })
export class PostService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl =
    this.applicationConfigService.getEndpointFor("core/posts");

  create(
    post: IPost,
    files: IFile[],
  ): Observable<EntityResponseType> {
    const data: FormData = new FormData();
    // files.forEach(el => {
    //   data.append("files", el.blob);
    //   data.append("posters", el.posterBlob);
    //   if (el.url) {
    //     URL.revokeObjectURL(el.url);
    //     el.url = null;
    //   }
    //   if (el.posterUrl) {
    //     URL.revokeObjectURL(el.posterUrl);
    //     el.posterUrl = null;
    //   }
    //   el.blob = null;
    //   el.posterBlob = null;
    // });
    data.append(
      "post",
      new Blob([JSON.stringify(post)], { type: "application/json" })
    );
    data.append(
      "files",
      new Blob([JSON.stringify(files)], { type: "application/json" })
    );
    return this.http.post<IPost>(this.resourceUrl, data, {
      observe: "response",
    });
  }

  update(
    post: IPost,
    files: IFile[],
    deletedAttachments: IFile[],
  ): Observable<EntityResponseType> {
    const data: FormData = new FormData();
    // files.forEach(el => {
    //   data.append("files", el.blob);
    //   data.append("posters", el.posterBlob);
    //   if (el.url) {
    //     URL.revokeObjectURL(el.url);
    //     el.url = null;
    //   }
    //   if (el.posterUrl) {
    //     URL.revokeObjectURL(el.posterUrl);
    //     el.posterUrl = null;
    //   }
    //   el.blob = null;
    //   el.posterBlob = null;
    // });
    data.append(
      "post",
      new Blob([JSON.stringify(post)], { type: "application/json" })
    );
    data.append(
      "files",
      new Blob([JSON.stringify(files)], { type: "application/json" })
    );
    data.append(
      "deletedAttachments",
      new Blob([JSON.stringify(deletedAttachments)], {
        type: "application/json",
      })
    );
    return this.http.put<IPost>(this.resourceUrl, data, {
      observe: "response",
    });
  }

  partialUpdate(post: IPost): Observable<EntityResponseType> {
    return this.http.patch<IPost>(`${this.resourceUrl}/${post.id}`, post, {
      observe: "response",
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPost>(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }

  findByNkAccount(id: number, req?: any): Observable<HttpResponse<IPage<IPost>>> {
    const options = createRequestOption(req);
    return this.http.get<IPage<IPost>>(`${this.resourceUrl}/nk-account/${id}`, {
      params: options,
      observe: "response",
    });
  }

  search(req?: any): Observable<HttpResponse<IPage<IPost>>> {
    const options = createRequestOption(req);
    return this.http.get<IPage<IPost>>(`${this.resourceUrl}/search`, {
      params: options,
      observe: "response",
    });
  }

  query(req?: any): Observable<HttpResponse<IPage<IPost>>> {
    const options = createRequestOption(req);
    return this.http.get<IPage<IPost>>(this.resourceUrl, {
      params: options,
      observe: "response",
    });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }
}
