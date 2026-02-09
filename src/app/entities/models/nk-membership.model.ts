import dayjs from 'dayjs/esm';
import { IChannel } from 'app/entities/models/nk-channel.model';

export interface IMembership {
  id: number;
  at?: dayjs.Dayjs | null;
  activateNotification?: boolean | null;
  channel?: Pick<IChannel, 'id'> | null;
  subscriber?: Pick<IChannel, 'id'> | null;
}
