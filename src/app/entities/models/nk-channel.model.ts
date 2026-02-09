import { Accessibility } from 'app/entities/enumerations/accessibility.model';
import { IConfig } from './nk-config.model';

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
}

export interface IChannelDTO {
  id?: number;
  identifier?: string;
  name?: string;
  avatar?: string;
  userId?: number;
}
