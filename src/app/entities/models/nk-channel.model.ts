import { Accessibility } from 'app/entities/enumerations/accessibility.model';
import { IConfig } from './nk-config.model';

export interface ISubscription {
  id: number;
  at?: Date | null;
  activateNotification?: boolean | null;
  channel?: Pick<IChannel, 'id'> | null;
  subscriber?: Pick<IChannel, 'id'> | null;
}

export interface IEngagementStats {
  channelId?: number;
  postCount?: number;
  followersCount?: number;
  followingCount?: number;
  followers?: ISubscriptionDTO[];
  following?: ISubscriptionDTO[];
}

export interface ISubscriptionDetailDTO {
  id: number;
  subscribedAt: Date; // Date when the subscription was created
  subscriber: IChannelDTO; // ID of the channel that is following
  subscribedTo: IChannelDTO; // ID of the channel being followed
}

export interface ISubscriptionDTO {
  id: number;
  subscribedAt: Date; // Date when the subscription was created
  subscriberId: number; // ID of the channel that is following
  subscribedToId: number; // ID of the channel being followed
}

export interface IChannel {
  id?: number | null;
  identifier?: string | null;
  name?: string | null;
  description?: string | null;
  avatar?: string | null;
  banner?: string | null;
  visibility?: keyof typeof Accessibility | null;
  createdAt?: Date | null;
  configuration?: IConfig;
  user?: number;
  stats?: IEngagementStats;
}

export interface IChannelDTO {
  id?: number;
  identifier?: string;
  name?: string;
  avatar?: string;
  userId?: number;
  stats?: IEngagementStats;
}
