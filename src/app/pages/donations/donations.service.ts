import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from 'app/core/config/api-config.service';
import { Observable } from 'rxjs';

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
  protected resourceUrl = inject(ApiConfigService).buildApiUrl('auth', 'donation');

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
    return this.http.get<IDonationStats>(`${this.resourceUrl}/stats`, {
      observe: 'response',
    });
  }

  /**
   * Get recent donations.
   * @returns An observable containing the HTTP response with recent donations
   */
  getRecentDonations(): Observable<HttpResponse<IDonation[]>> {
    return this.http.get<IDonation[]>(`${this.resourceUrl}/recent`, {
      observe: 'response',
    });
  }
}
