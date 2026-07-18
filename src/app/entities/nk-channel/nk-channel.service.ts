import { HttpClient, HttpResponse } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { ApiConfigService } from 'app/core/config/api-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IChannel, IEngagementStats, ISubscriptionDTO } from 'app/entities/models/nk-channel.model';
import { Observable } from 'rxjs';

export type EntityResponseType = HttpResponse<IChannel>;
export type EntityArrayResponseType = HttpResponse<IChannel[]>;

@Injectable({ providedIn: 'root' })
export class ChannelService {
  /**
   * Holds the current user's channel.
   * Null means "no authenticated user" or "channel not loaded".
   */
  private readonly _channel = signal<IChannel | null>(null);

  /**
   * Public readonly signal for components.
   */
  readonly channel = this._channel.asReadonly();
  private authService = inject(AuthenticationService);

  private http = inject(HttpClient);
  private resourceUrl = inject(ApiConfigService).buildApiUrl('core', 'channels');
  private stateStorageService = inject(StateStorageService);

  constructor() {
    /**
     * React to authentication changes.
     * When the user logs in → fetch channel.
     * When the user logs out → clear channel.
     */
    effect(() => {
      const auth = this.authService.authentication();
      if (auth) {
        this.loadChannel();
      } else {
        this._channel.set(null);
      }
    });
  }

  /**
   * Fetches the current user's channel from the backend.
   * Called automatically when authentication changes.
   */
  private loadChannel(): void {
    const cachedChannel = this.stateStorageService.getChannel();

    if (cachedChannel) {
      this._channel.set(cachedChannel);
      return;
    }

    this.http.get<IChannel>(`${this.resourceUrl}/me`).subscribe({
      next: (acc) => this.updateLocalChannel(acc),
      error: () => this.updateLocalChannel(null),
    });
  }

  /**
   * Allows manual updates to the channel (e.g., after editing profile).
   */
  updateLocalChannel(channel: IChannel): void {
    this._channel.set(channel);
    if (channel) {
      this.stateStorageService.storeChannel(channel);
    } else {
      this.stateStorageService.clearChannel();
    }
  }

  /**
   * Add a subscription to the local list of followed channels.
   * @param subscription The subscription to add.
   */
  addLocalSubs(subscription: ISubscriptionDTO): void {
    this._channel.update((value) => ({
      ...value,
      stats: { ...value.stats, following: [...value.stats.following, subscription] },
    }));
  }

  /**
   * Remove a subscription from the local list of followed channels.
   * @param id The ID of the subscription to remove.
   */
  removeLocalSubs(id: number): void {
    this._channel.update((value) => ({
      ...value,
      stats: { ...value.stats, following: value.stats.following.filter((s) => s.id !== id) },
    }));
  }

  // API

  /**
   * CRUD operations for channels (admin or profile editing).
   */
  create(channel: IChannel): Observable<EntityResponseType> {
    return this.http.post<IChannel>(this.resourceUrl, channel, {
      observe: 'response',
    });
  }

  update(channel: IChannel): Observable<EntityResponseType> {
    return this.http.put<IChannel>(this.resourceUrl, channel, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IChannel>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByUser(id: number): Observable<EntityResponseType> {
    return this.http.get<IChannel>(`${this.resourceUrl}/user/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IChannel[]>(this.resourceUrl, {
      params: options,
      observe: 'response',
    });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  updateAvatar(file: File): Observable<EntityResponseType> {
    const data: FormData = new FormData();
    data.append('file', file);
    return this.http.put<IChannel>(`${this.resourceUrl}/upload-avatar`, data, {
      observe: 'response',
    });
  }

  updateBanner(file: File): Observable<EntityResponseType> {
    const data: FormData = new FormData();
    data.append('file', file);
    return this.http.put<IChannel>(`${this.resourceUrl}/upload-banner`, data, {
      observe: 'response',
    });
  }

  /**
   * Follow a channel and return the created or existing channel.
   * @param channel contains the channel to subscribe to.
   */
  follow(channel: IChannel): Observable<HttpResponse<ISubscriptionDTO>> {
    return this.http.post<ISubscriptionDTO>(`${this.resourceUrl}/follow`, channel, {
      observe: 'response',
    });
  }

  /**
   * Unfollow a channel by its subscription ID.
   * @param id the ID of a subscription to remove.
   */
  unfollow(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/unfollow/${id}`, { observe: 'response' });
  }

  /**
   * Retrieve subscription statistics for a given channel.
   * @param channelId the ID of the channel to make the stats.
   */
  getStats(channelId: number): Observable<HttpResponse<IEngagementStats>> {
    return this.http.get<IEngagementStats>(`${this.resourceUrl}/stats/${channelId}`, {
      observe: 'response',
    });
  }
}
