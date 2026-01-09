import dayjs from 'dayjs/esm';
import { IAccount } from 'app/entities/models/nk-account.model';

export interface IMembership {
  id: number;
  at?: dayjs.Dayjs | null;
  activateNotification?: boolean | null;
  account?: Pick<IAccount, 'id'> | null;
  subscriber?: Pick<IAccount, 'id'> | null;
}
