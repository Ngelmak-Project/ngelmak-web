import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';

export interface IDonation {
  id?: number;
  amount?: number;
  message?: string | null;
  isAnonymous?: boolean;
  name?: string;
  createdAt?: string;
}

export interface IDonationStats {
  totalAmount?: number;
  count?: number;
  averageAmount?: number;
  lastDonationAmount?: number;
}

@Injectable({ providedIn: 'root' })
export class DonationService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);
  protected resourceUrl = this.applicationConfigService.getEndpointFor('auth/donation');
  protected publicResourceUrl =
    this.applicationConfigService.getEndpointFor('auth/public/donation');

  /**
   * Save a donation.
   * @param donation The donation to save
   */
  donate(donation: IDonation): Observable<HttpResponse<IDonation>> {
    return this.http.post<IDonation>(this.resourceUrl, donation, {
      observe: 'response',
    });
  }

  /**
   * Get donation statistics.
   * @returns An observable containing the HTTP response with donation stats
   */
  getStats(): Observable<HttpResponse<IDonationStats>> {
    return this.http.get<IDonationStats>(`${this.publicResourceUrl}/stats`, {
      observe: 'response',
    });
  }

  /**
   * Get recent donations.
   * @returns An observable containing the HTTP response with recent donations
   */
  getRecentDonations(): Observable<HttpResponse<IDonation[]>> {
    return this.http.get<IDonation[]>(`${this.publicResourceUrl}/recent`, {
      observe: 'response',
    });
  }
}
