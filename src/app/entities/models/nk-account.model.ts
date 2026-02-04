import { Accessibility } from 'app/entities/enumerations/accessibility.model';
import { IUser } from '../user/user.model';
import { IConfig } from './nk-config.model';

export interface IAccount {
  id?: number | null;
  identifier?: string | null;
  name?: string | null;
  description?: string | null;
  avatar?: string | null;
  banner?: string | null;
  visibility?: keyof typeof Accessibility | null;
  createdAt?: Date | null;
  configuration?: IConfig;
  user?: IUser;
}

export interface IAccountDTO {
  id?: number;
  identifier?: string;
  name?: string;
  avatar?: string;
  userId?: number;
}
