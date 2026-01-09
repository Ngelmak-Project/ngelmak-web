import { HttpClient, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { IComment } from "app/entities/models/nk-comment.model";
import { Observable } from "rxjs";

import { ApplicationConfigService } from "app/core/config/application-config.service";
import { createRequestOption } from "app/core/request/request-util";

export type PartialUpdateComment = Partial<IComment> & Pick<IComment, "id">;

type RestOf<T extends IComment | IComment> = Omit<T, "at" | "lastUpdate"> & {
  at?: string | null;
  lastUpdate?: string | null;
};

export type NewIComment = RestOf<IComment>;

export type PartialUpdateIComment = RestOf<PartialUpdateComment>;

export type EntityResponseType = HttpResponse<IComment>;
export type EntityArrayResponseType = HttpResponse<IComment[]>;

@Injectable({ providedIn: "root" })
export class CommentService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl =
    this.applicationConfigService.getEndpointFor("core/comments");

  create(comment: IComment, file): Observable<EntityResponseType> {
    const data: FormData = new FormData();
    if (file) {
      data.append("file", file);
    }
    data.append(
      "comment",
      new Blob([JSON.stringify(comment)], { type: "application/json" })
    );
    return this.http.post<IComment>(this.resourceUrl, data, {
      observe: "response",
    });
  }

  update(comment: IComment, file): Observable<EntityResponseType> {
    const data: FormData = new FormData();
    if (file) {
      data.append("file", file);
    }
    data.append(
      "comment",
      new Blob([JSON.stringify(comment)], { type: "application/json" })
    );
    return this.http.put<IComment>(this.resourceUrl, data, {
      observe: "response",
    });
  }

  partialUpdate(comment: PartialUpdateComment): Observable<EntityResponseType> {
    return this.http.patch<IComment>(
      `${this.resourceUrl}/${comment.id}`,
      comment,
      { observe: "response" }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IComment>(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }

  findByPost(id: number): Observable<EntityArrayResponseType> {
    return this.http.get<IComment[]>(`${this.resourceUrl}/nk-post/${id}`, {
      observe: "response",
    });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IComment[]>(this.resourceUrl, {
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
