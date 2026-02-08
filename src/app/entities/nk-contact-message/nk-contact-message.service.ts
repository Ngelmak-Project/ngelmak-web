import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IContactMessage, IContactMessageDTO } from '../models/nk-contact-message.model';
import { createRequestOption } from 'app/core/request/request-util';
import { IPage } from 'app/shared/pagination/pagination.model';

@Injectable({ providedIn: 'root' })
export class ContactMessageService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('core/contact-messages');
  protected publicResourceUrl =
    this.applicationConfigService.getEndpointFor('core/r/contact-messages');

  create(contactMessage: IContactMessage): Observable<HttpResponse<IContactMessageDTO>> {
    return this.http.post<IContactMessageDTO>(this.publicResourceUrl, contactMessage, {
      observe: 'response',
    });
  }

  update(contactMessage: IContactMessage): Observable<HttpResponse<IContactMessageDTO>> {
    return this.http.put<IContactMessageDTO>(this.publicResourceUrl, contactMessage, {
      observe: 'response',
    });
  }

  findUntreatedContactMessage(req?: any): Observable<HttpResponse<IPage<IContactMessageDTO>>> {
    const options = createRequestOption(req);
    return this.http.get<IPage<IContactMessageDTO>>(this.resourceUrl, {
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
