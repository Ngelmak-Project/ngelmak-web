import dayjs from 'dayjs/esm';
import { Accessibility } from 'app/entities/enumerations/accessibility.model';
import { IConfig } from './nk-config.model';
import { IUser } from '../user/user.model';

export interface IAccount {
  id: number | null;
  identifier?: string | null;
  name?: string | null;
  description?: string | null;
  avatar?: string | null;
  banner?: string | null;
  visibility?: keyof typeof Accessibility | null;
  createdAt?: dayjs.Dayjs | null;
  configuration?: IConfig;
  user?: IUser;
}
