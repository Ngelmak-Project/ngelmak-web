import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IConfig } from 'app/entities/models/nk-config.model';

export type PartialUpdateConfig = Partial<IConfig> & Pick<IConfig, 'id'>;

type RestOf<T extends IConfig | IConfig> = Omit<T, 'lastUpdate'> & {
  lastUpdate?: string | null;
};

export type RestConfig = RestOf<IConfig>;

export type NewRestConfig = RestOf<IConfig>;

export type PartialUpdateRestConfig = RestOf<PartialUpdateConfig>;

export type EntityResponseType = HttpResponse<IConfig>;
export type EntityArrayResponseType = HttpResponse<IConfig[]>;

@Injectable({ providedIn: 'root' })
export class ConfigService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/configs');

  create(config: IConfig): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(config);
    return this.http
      .post<RestConfig>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(config: IConfig): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(config);
    return this.http
      .put<RestConfig>(`${this.resourceUrl}/${this.getConfigIdentifier(config)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(config: PartialUpdateConfig): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(config);
    return this.http
      .patch<RestConfig>(`${this.resourceUrl}/${this.getConfigIdentifier(config)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestConfig>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestConfig[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getConfigIdentifier(config: Pick<IConfig, 'id'>): number {
    return config.id;
  }

  compareConfig(o1: Pick<IConfig, 'id'> | null, o2: Pick<IConfig, 'id'> | null): boolean {
    return o1 && o2 ? this.getConfigIdentifier(o1) === this.getConfigIdentifier(o2) : o1 === o2;
  }

  addConfigToCollectionIfMissing<Type extends Pick<IConfig, 'id'>>(
    configCollection: Type[],
    ...configsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const configs: Type[] = configsToCheck.filter(isPresent);
    if (configs.length > 0) {
      const configCollectionIdentifiers = configCollection.map(configItem => this.getConfigIdentifier(configItem));
      const configsToAdd = configs.filter(configItem => {
        const configIdentifier = this.getConfigIdentifier(configItem);
        if (configCollectionIdentifiers.includes(configIdentifier)) {
          return false;
        }
        configCollectionIdentifiers.push(configIdentifier);
        return true;
      });
      return [...configsToAdd, ...configCollection];
    }
    return configCollection;
  }

  protected convertDateFromClient<T extends IConfig | IConfig | PartialUpdateConfig>(config: T): RestOf<T> {
    return {
      ...config,
      lastUpdate: config.lastUpdate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restConfig: RestConfig): IConfig {
    return {
      ...restConfig,
      lastUpdate: restConfig.lastUpdate ? dayjs(restConfig.lastUpdate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestConfig>): HttpResponse<IConfig> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestConfig[]>): HttpResponse<IConfig[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
